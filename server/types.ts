/**
 * Type definitions for FaceProof Backend & Frontend
 */

export interface FaceLandmarks {
  leftEye: [number, number];
  rightEye: [number, number];
  noseTip: [number, number];
  mouthLeft: [number, number];
  mouthRight: [number, number];
  jawOutline?: [number, number][];
}

export interface FaceAnalysisResult {
  faceDetected: boolean;
  faceCount: number;
  qualityScore: number; // 0 - 100
  blurScore: number;    // Laplacian variance score
  blurLabel: 'Low' | 'Moderate' | 'High (Unacceptable)';
  resolutionLabel: 'Ultra High' | 'Good' | 'Low';
  pose: {
    yaw: number;
    pitch: number;
    roll: number;
    label: 'Frontal' | 'Slight Angle' | 'Extreme Profile';
  };
  lighting: {
    score: number;
    label: 'Optimal' | 'Under-exposed' | 'Over-exposed';
  };
  landmarks: FaceLandmarks;
  embeddingGenerated: boolean;
  embeddingDimension: number; // e.g. 512
  embeddingPreview: number[]; // First 8 values for visual inspection
  processingTimeMs: number;
}

export interface SearchCandidate {
  id: string;
  investigationId: string;
  url: string;
  canonicalUrl: string;
  source: string; // e.g. "Public Registry", "Global News Wire", "Academic Repository", "Social Media Archive"
  title: string;
  snippet: string;
  imageUrl: string;
  timestamp: string;
  faceSimilarity: number;       // 0.00 - 1.00
  imageSimilarity: number;      // 0.00 - 1.00
  metadataScore: number;        // 0.00 - 1.00
  sourceSignalScore: number;    // 0.00 - 1.00
  finalScore: number;           // Weighted composite (0.00 - 1.00)
  confidenceLabel: 'HIGH' | 'POTENTIAL' | 'LOW' | 'NO_MATCH';
  ranking: number;
  landmarks?: FaceLandmarks;
  metadata: Record<string, string | number>;
  scoringRationale: string[];
}

export interface CanonicalEvidencePackage {
  investigationId: string;
  candidateId: string;
  canonicalSourceUrl: string;
  discoveredAt: string;
  candidateTitle: string;
  candidatePlatform: string;
  faceSimilarity: number;
  finalConfidence: number;
  contentHash: string; // SHA-256 of candidate payload
  metadataDigest: string;
}

export interface BlockchainRecord {
  recordId: string;
  evidenceHash: string; // bytes32 hex
  timestamp: number;
  dateTimeStr: string;
  sourceReference: string;
  registeredBy: string;
  transactionHash: string;
  blockNumber: number;
  gasUsed: number;
  network: string;
  status: 'VERIFIED' | 'PENDING' | 'INVALID';
  contractAddress: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeLabel: string;
  stage: string;
  status: 'completed' | 'in_progress' | 'failed' | 'pending';
  description: string;
  durationMs: number;
}

export interface Investigation {
  id: string;
  title: string;
  inputImage: string; // Base64 or URL
  createdAt: string;
  status: 'created' | 'analyzing' | 'searched' | 'evidence_selected' | 'anchored' | 'verified' | 'tamper_detected';
  faceAnalysis: FaceAnalysisResult;
  searchMode: 'LIVE' | 'DEMO';
  searchProviderName: string;
  candidates: SearchCandidate[];
  selectedCandidateId?: string;
  evidencePackage?: CanonicalEvidencePackage;
  evidenceHash?: string;
  blockchainRecord?: BlockchainRecord;
  timeline: TimelineEvent[];
  isTampered?: boolean;
  tamperedHash?: string;
  notes?: string;
}

export interface SystemEvaluationMetrics {
  totalInvestigations: number;
  faceDetectionRate: number;
  candidateRetrievalRate: number;
  averageProcessingTimeMs: number;
  tamperDetectionAccuracy: number;
  blockchainConfirmationTimeSec: number;
  confidenceDistribution: {
    high: number;
    potential: number;
    low: number;
    noMatch: number;
  };
  pipelineStageDurations: {
    stage: string;
    durationMs: number;
  }[];
  testCaseResults: {
    testId: string;
    name: string;
    scenario: string;
    status: 'PASSED' | 'FAILED';
    executionTimeMs: number;
    details: string;
  }[];
}
