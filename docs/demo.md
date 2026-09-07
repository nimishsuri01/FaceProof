# FACEPROOF 60-Second Judge Demo Script

## The 8-Step Core Narrative

"FaceProof solves the critical problem of digital media forensics: when a face is discovered in web evidence, how do we evaluate candidate similarity, prove that the retrieved evidence hasn't been altered or fabricated later, and establish permanent provenance?"

### Step 1: Upload or Choose an Authorized Face
- Open **New Investigation**.
- Upload an image or select one of the sample forensic subjects (e.g. *Dr. Elena Vance*, *Officer Marcus Chen*, or *Subject Alpha*).
- Notice the **Real-Time Input Analysis**:
  - Face Detection: Passed (1 primary face)
  - Blur Analysis: Low
  - Resolution & Lighting: 94/100
  - 512-D Normalized Vector Embedding generated.

### Step 2: Dynamic Reverse Discovery
- Click **"Analyze & Search Web Evidence"**.
- Watch the animated **8-Stage Forensic Pipeline** in action:
  - Uploading → Detecting Face → Quality Assessment → Generating Embedding → Search Retrieval → Analyzing Candidates → Ranking → Fingerprinting.
- Clearly note the provider status:
  - If external API key is present: `LIVE WEB SEARCH`.
  - If running in offline/unconfigured environment: `DEMO MODE` badge clearly displayed.

### Step 3: Multi-Signal Explainable Scoring
- Review the ranked candidate cards:
  - Face Similarity (cosine distance)
  - Structural Image Similarity
  - Metadata Consistency
  - Weighted Final Confidence (High, Potential, Low)
- Click **"Compare"** on the #1 Best Candidate:
  - Side-by-side landmark overlay inspection.
  - Transparent rationale list detailing why this candidate was selected.

### Step 4: Cryptographic SHA-256 Fingerprinting
- Inspect the **Evidence Record**:
  - Deterministic canonical serialization.
  - Generates a 256-bit SHA-256 hash.
  - *Notice: Raw face biometric images and raw embeddings are NEVER written to the blockchain! Only the canonical fingerprint is anchored.*

### Step 5: Immutable Blockchain Anchoring
- Click **"Anchor on Blockchain"**.
- Watch the confirmation sequence:
  - Submitting transaction → mining block → receipt confirmed.
  - View real Tx Hash (`0x...`), Block Height, and Gas Used.

### Step 6: Instant Verification (The Green State)
- Navigate to **Verification** tab.
- Click **"Verify Evidence Integrity"**.
- Result: **✓ CRYPTOGRAPHICALLY VERIFIED** (Current Hash == On-chain Hash).

### Step 7: The Controlled Tamper Simulation (The Red State)
- Click **"Simulate Evidence Modification (Controlled Demo)"**.
- The system alters a byte in the discovered evidence URL/metadata payload.
- System recomputes the hash and queries the smart contract.
- Result: **✕ TAMPER DETECTED!**
  - Current Hash differs from Blockchain Hash.
  - Explains the exact discrepancy to the judges.

### Step 8: Restore & Generate Verification Certificate
- Click **"Restore Original Evidence"**.
- Re-verify: Returns to **✓ VERIFIED**.
- Click **"View Certificate"**:
  - Produces an official tamper-evident forensic receipt suitable for court discovery or legal provenance.
