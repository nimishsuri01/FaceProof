# FACEPROOF Architecture Specification

## 1. System Overview

FaceProof is an enterprise-grade cyber forensics platform that unites computer vision face discovery with immutable blockchain provenance.

```mermaid
graph TD
    User([Investigator / User]) -->|Upload Face Image| Frontend[React + Vite + Tailwind Forensic UI]
    Frontend -->|REST API Requests| Backend[Node.js / Express Forensic Backend]
    
    subgraph "Face Analysis & Embedding Engine"
        Backend -->|Image Payload| FaceEngine[Face Detection & Landmark Analyzer]
        FaceEngine -->|Extract Geometry & Blur Score| QualityAssessment[Image Quality & Pose Estimator]
        QualityAssessment -->|Vectorization| EmbeddingGen[512-D Normalized Facial Embedding]
    end
    
    subgraph "Search & Retrieval Layer"
        Backend -->|Embedding & Visual Traits| SearchManager[Search Provider Interface]
        SearchManager -->|Live Search| LiveSearch[Google/SerpApi/DuckDuckGo Engine]
        SearchManager -->|Fallback Mode| DemoEngine[Structured Forensic Demo Corpus]
        LiveSearch --> CandidateNorm[Candidate Normalization & Deduplication]
        DemoEngine --> CandidateNorm
    end

    subgraph "Candidate Matching & Confidence Engine"
        CandidateNorm --> CandidateAnalyzer[Multi-Signal Candidate Evaluator]
        CandidateAnalyzer --> FaceSim[Cosine Face Similarity: 45%]
        CandidateAnalyzer --> ImgSim[Structural Image Similarity: 30%]
        CandidateAnalyzer --> MetaScore[Metadata Consistency: 15%]
        CandidateAnalyzer --> SourceScore[Domain Credibility: 10%]
        FaceSim & ImgSim & MetaScore & SourceScore --> WeightedRanker[Explainable Confidence Score & Ranking]
    end

    subgraph "Cryptographic Fingerprinting & Blockchain"
        WeightedRanker --> SelectedEvidence[Selected Candidate Evidence Package]
        SelectedEvidence --> Hasher[Deterministic SHA-256 Canonical Fingerprinter]
        Hasher --> EthersClient[Ethers.js EVM Client]
        EthersClient -->|registerEvidence| SmartContract[(EvidenceRegistry.sol - EVM / Testnet)]
        SmartContract -->|Event Emission| BlockReceipt[Immutable Transaction & Block Receipt]
    end

    subgraph "Integrity Verification & Tamper Detection"
        SmartContract --> Reverifier[Cryptographic Re-Verification Engine]
        Hasher --> Reverifier
        Reverifier -->|Current Hash == Blockchain Hash| GreenVerified[✓ VERIFIED: Provenance Intact]
        Reverifier -->|Current Hash != Blockchain Hash| RedTamper[✕ TAMPER DETECTED: Data Modified]
    end
```

## 2. Face Processing Pipeline Flow

```mermaid
sequenceDiagram
    autonumber
    actor Investigator as Investigator (Client UI)
    participant Backend as Express API Gateway
    participant CV as Vision & Quality Engine
    participant Search as Search Provider Interface
    participant Scorer as Multi-Signal Confidence Ranker
    participant Hasher as SHA-256 Hasher
    participant Chain as EvidenceRegistry (Solidity)

    Investigator->>Backend: POST /api/investigations (Multipart / Base64)
    Backend->>CV: Analyze Image (Resolution, Blur, Faces, Lighting)
    CV-->>Backend: Quality: 94/100, Faces: 1, Blur: Low, Geometry Valid
    CV->>CV: Generate 512-D Normalized Vector
    Backend->>Search: searchByImage(Vector, VisualSignatures)
    Search-->>Backend: Discovered Candidate Pages & URLs
    Backend->>Scorer: Compare Input vs Candidates
    Scorer-->>Backend: Ranked Candidates with Confidence Breakdown
    Backend-->>Investigator: Investigation Object + Ranked Matches
    Investigator->>Backend: POST /api/evidence/register (Candidate ID)
    Backend->>Hasher: Hash Canonical Package (URL, Metadata, Timestamp)
    Hasher-->>Backend: Evidence Fingerprint (SHA-256 / bytes32)
    Backend->>Chain: registerEvidence(evidenceHash, canonicalSource)
    Chain-->>Backend: TxHash: 0x..., Block: #1982412, Gas: 47210
    Backend-->>Investigator: Anchored Receipt & Certificate Data
```

## 3. Evidence Verification & Tamper Detection Mechanics

1. **Canonical Evidence Serialization**:
   - `canonicalUrl`: Standardized uniform resource locator
   - `discoveredTimestamp`: ISO-8601 UTC timestamp
   - `candidateContentHash`: SHA-256 of discovered media payload
   - `metadataPayload`: Standardized JSON representation
2. **Cryptographic Fingerprint**:
   $$\text{EvidenceHash} = \text{SHA-256}(\text{canonicalUrl} + \text{discoveredTimestamp} + \text{contentHash} + \text{metadata})$$
3. **Verification**:
   - Query smart contract state on-chain: `getEvidence(evidenceHash)`.
   - If record exists and matches, return status `CRYPTOGRAPHICALLY_VERIFIED`.
   - If evidence fields or content are altered, $\text{SHA-256}(\text{modified}) \neq \text{EvidenceHash}$, triggering `TAMPER_DETECTED`.
