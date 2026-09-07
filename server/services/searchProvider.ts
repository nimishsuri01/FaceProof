import crypto from 'crypto';
import { SearchCandidate } from '../types.js';
import { FaceEmbeddingService } from './faceEmbedding.js';

export interface SearchProviderResult {
  mode: 'LIVE';
  providerName: string;
  queryTimeMs: number;
  searchId?: string;
  searchTimestamp: string;
  responseMetadata?: Record<string, unknown>;
  candidates: SearchCandidate[];
}

export class LiveSearchProvider {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  public getApiKey(): string | undefined {
    return this.apiKey || process.env.SERPAPI_API_KEY || process.env.SEARCH_PROVIDER_API_KEY;
  }

  /**
   * Real Google Lens Search using SerpApi with user's uploaded local file.
   * Follows exact 2-step flow:
   * Step A: POST to https://serpapi.com/image with actual user file -> returns { image_id }
   * Step B: GET https://serpapi.com/search?engine=google_lens&image_id={image_id}
   */
  public async searchByImageBuffer(
    imageBuffer: Buffer,
    mimeType: string,
    filename: string = 'evidence.jpg',
    subjectEmbedding?: number[]
  ): Promise<SearchProviderResult> {
    const startTime = Date.now();
    const apiKey = this.getApiKey();

    if (!apiKey) {
      throw new Error('SERPAPI_API_KEY is not configured. Configure a live search provider before starting an investigation.');
    }

    // ========================================================
    // STEP A: Upload user's file to SerpApi Image API
    // ========================================================
    console.log(`[SerpApi] STEP A: Uploading ${filename} (${imageBuffer.length} bytes) to https://serpapi.com/image...`);
    const uploadFormData = new FormData();
    const blob = new Blob([imageBuffer], { type: mimeType });
    uploadFormData.append('image', blob, filename);
    uploadFormData.append('api_key', apiKey);

    const uploadResponse = await fetch('https://serpapi.com/image', {
      method: 'POST',
      body: uploadFormData
    });

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text().catch(() => '');
      throw new Error(`SerpApi Image Upload failed (HTTP ${uploadResponse.status}): ${errText}`);
    }

    const uploadData = await uploadResponse.json().catch(() => null);
    const imageId = uploadData?.image_id;

    if (!imageId) {
      throw new Error(`SerpApi Image Upload did not return an image_id: ${JSON.stringify(uploadData)}`);
    }

    console.log(`[SerpApi] STEP A completed. Received image_id: ${imageId}`);

    // ========================================================
    // STEP B: Call Google Lens with returned image_id
    // ========================================================
    console.log(`[SerpApi] STEP B: Calling Google Lens with image_id=${imageId}...`);
    const searchUrl = new URL('https://serpapi.com/search');
    searchUrl.searchParams.set('engine', 'google_lens');
    searchUrl.searchParams.set('image_id', imageId);
    searchUrl.searchParams.set('api_key', apiKey);
    searchUrl.searchParams.set('type', 'all');

    const searchResponse = await fetch(searchUrl.toString());
    if (!searchResponse.ok) {
      const errText = await searchResponse.text().catch(() => '');
      throw new Error(`SerpApi Google Lens search failed (HTTP ${searchResponse.status}): ${errText}`);
    }

    const searchData = await searchResponse.json().catch(() => null);

    if (searchData?.error) {
      throw new Error(`SerpApi Google Lens returned an error: ${searchData.error}`);
    }

    const rawVisualMatches: any[] = searchData?.visual_matches || [];
    const rawExactMatches: any[] = searchData?.exact_matches || [];
    const combinedMatches = [...rawExactMatches, ...rawVisualMatches];

    console.log(`[SerpApi] STEP B completed. Found ${combinedMatches.length} visual matches from Google Lens.`);

    // If no matches found on Google Lens
    if (combinedMatches.length === 0) {
      return {
        mode: 'LIVE',
        providerName: 'Google Lens via SerpApi',
        queryTimeMs: Date.now() - startTime,
        searchId: imageId,
        searchTimestamp: new Date().toISOString(),
        responseMetadata: sanitizeResponseMetadata(searchData),
        candidates: []
      };
    }

    // Process real candidates (up to 8)
    const candidates: SearchCandidate[] = [];
    const topMatches = combinedMatches.slice(0, 8);

    for (let idx = 0; idx < topMatches.length; idx++) {
      const match = topMatches[idx];
      const link = match.link || match.url || '';
      const canonicalUrl = normalizeUrl(link);
      const title = match.title || 'Discovered Web Asset';
      const snippet = match.source || match.snippet || `Indexed on ${extractDomain(canonicalUrl)}`;
      const thumbnail = match.thumbnail || match.original || '';
      const sourceDomain = extractDomain(canonicalUrl);

      // Compute biometric similarity using real InsightFace if thumbnail is fetchable & subject embedding available
      let calculatedFaceSim: number | null = null;
      let calculatedImageSim: number | null = null;
      let candidateStatus: SearchCandidate['candidateStatus'] = 'IMAGE_UNAVAILABLE';

      if (subjectEmbedding && thumbnail && thumbnail.startsWith('http')) {
        try {
          const thumbRes = await fetch(thumbnail, { signal: AbortSignal.timeout(3000) });
          if (thumbRes.ok) {
            const thumbBuffer = Buffer.from(await thumbRes.arrayBuffer());
            const compareResult = await FaceEmbeddingService.compareFace(
              subjectEmbedding,
              thumbBuffer,
              'image/jpeg'
            );
            if (compareResult.faceDetected && compareResult.cosineSimilarity > 0) {
              calculatedFaceSim = compareResult.cosineSimilarity;
              candidateStatus = 'ANALYZED';
            }
          }
        } catch {
          candidateStatus = 'ANALYSIS_FAILED';
        }
      }

      const imageSimilarity = null;
      const metadataScore = null;
      const sourceSignalScore = null;
      const finalScore = calculateTrustScore({
        faceSimilarity: calculatedFaceSim,
        imageSimilarity,
        metadataScore,
        sourceSignalScore
      });

      const confidenceLabel: SearchCandidate['confidenceLabel'] = finalScore === null
        ? 'NO_MATCH'
        : finalScore >= 0.82 ? 'HIGH'
        : finalScore >= 0.65 ? 'POTENTIAL'
        : finalScore >= 0.45 ? 'LOW'
        : 'NO_MATCH';

      candidates.push({
        id: `cand_lens_${Date.now()}_${idx + 1}`,
        investigationId: '',
        url: link,
        canonicalUrl,
        source: sourceDomain,
        title,
        snippet,
        imageUrl: thumbnail,
        timestamp: new Date().toISOString(),
        faceSimilarity: Number(calculatedFaceSim.toFixed(3)),
        imageSimilarity: Number(calculatedImageSim.toFixed(3)),
        metadataScore,
        sourceSignalScore,
        finalScore,
        confidenceLabel,
        ranking: idx + 1,
        metadata: {
          serpApiImageId: imageId,
          engine: 'google_lens',
          sourceDomain,
          position: match.position || idx + 1
        },
        scoringRationale: [
          `Visual match confirmed from Google Lens reverse index for image_id: ${imageId.slice(0, 10)}...`,
          ...(calculatedFaceSim !== null ? [`Computed face similarity: ${(calculatedFaceSim * 100).toFixed(1)}% against primary 512-D vector`] : ['Candidate face comparison was unavailable.']),
          ...(sourceDomain ? [`Source URL available: ${sourceDomain}`] : ['Source signal was unavailable.'])
        ]
      });
      candidates[candidates.length - 1].candidateStatus = candidateStatus;
    }

    candidates.sort((left, right) => (right.finalScore ?? -1) - (left.finalScore ?? -1));
    candidates.forEach((candidate, index) => {
      candidate.ranking = index + 1;
    });

    return {
      mode: 'LIVE',
      providerName: 'Google Lens via SerpApi',
      queryTimeMs: Date.now() - startTime,
      searchId: imageId,
      searchTimestamp: new Date().toISOString(),
      responseMetadata: sanitizeResponseMetadata(searchData),
      candidates
    };
  }
}

function normalizeUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    parsed.searchParams.delete('utm_source');
    parsed.searchParams.delete('utm_medium');
    parsed.searchParams.delete('utm_campaign');
    parsed.searchParams.delete('fbclid');
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return 'web-source';
  }
}

function calculateTrustScore(signals: Record<string, number | null>): number | null {
  if (signals.faceSimilarity === null) return null;

  const weights: Record<string, number> = {
    faceSimilarity: 0.45,
    imageSimilarity: 0.30,
    metadataScore: 0.15,
    sourceSignalScore: 0.10
  };
  const available = Object.entries(signals).filter(([, value]) => value !== null);
  if (!available.length) return null;
  const weightTotal = available.reduce((total, [key]) => total + weights[key], 0);
  return Number((available.reduce((total, [key, value]) => total + (value as number) * weights[key], 0) / weightTotal).toFixed(3));
}

function sanitizeResponseMetadata(response: any): Record<string, unknown> {
  return {
    searchMetadata: response?.search_metadata || null,
    searchParameters: response?.search_parameters || null,
    visualMatchCount: Array.isArray(response?.visual_matches) ? response.visual_matches.length : 0,
    exactMatchCount: Array.isArray(response?.exact_matches) ? response.exact_matches.length : 0
  };
}
