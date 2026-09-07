// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EvidenceRegistry
 * @dev FaceProof - AI-Powered Face Evidence Discovery & Blockchain Verification
 * Stores cryptographic fingerprints (SHA-256/bytes32) and metadata for immutable provenance.
 * Never stores raw biometric images or raw face embeddings on-chain.
 */
contract EvidenceRegistry {
    struct EvidenceRecord {
        bytes32 evidenceHash;      // SHA-256 fingerprint of canonical evidence package
        uint256 timestamp;         // Unix timestamp of registration
        string sourceReference;    // Canonical web reference or URI
        address registeredBy;      // Authorized investigator/caller address
        uint256 blockNumber;       // Block height at registration
        bool exists;               // Existence flag to guard duplicates
    }

    // Mapping from evidenceHash to EvidenceRecord
    mapping(bytes32 => EvidenceRecord) private _registry;

    // Array of all registered evidence hashes for enumeration
    bytes32[] private _allHashes;

    // Contract owner
    address public immutable owner;

    // Events
    event EvidenceRegistered(
        bytes32 indexed evidenceHash,
        address indexed registeredBy,
        uint256 timestamp,
        string sourceReference,
        uint256 blockNumber
    );

    event EvidenceVerified(
        bytes32 indexed evidenceHash,
        address indexed checkedBy,
        bool isValid,
        uint256 timestamp
    );

    error EvidenceAlreadyRegistered(bytes32 evidenceHash);
    error EvidenceNotFound(bytes32 evidenceHash);
    error InvalidEvidenceHash();

    modifier validHash(bytes32 hash) {
        if (hash == bytes32(0)) revert InvalidEvidenceHash();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Registers a new cryptographic evidence fingerprint
     * @param evidenceHash The SHA-256 digest of the canonical evidence package
     * @param sourceReference Canonical web URL or content identifier
     */
    function registerEvidence(
        bytes32 evidenceHash,
        string calldata sourceReference
    ) external validHash(evidenceHash) returns (bool) {
        if (_registry[evidenceHash].exists) {
            revert EvidenceAlreadyRegistered(evidenceHash);
        }

        EvidenceRecord memory record = EvidenceRecord({
            evidenceHash: evidenceHash,
            timestamp: block.timestamp,
            sourceReference: sourceReference,
            registeredBy: msg.sender,
            blockNumber: block.number,
            exists: true
        });

        _registry[evidenceHash] = record;
        _allHashes.push(evidenceHash);

        emit EvidenceRegistered(
            evidenceHash,
            msg.sender,
            block.timestamp,
            sourceReference,
            block.number
        );

        return true;
    }

    /**
     * @notice Verifies if an evidence hash exists and returns its immutable status
     * @param evidenceHash The cryptographic hash to test
     */
    function verifyEvidence(bytes32 evidenceHash) external returns (bool isValid, uint256 registeredAt, address registrant) {
        EvidenceRecord memory record = _registry[evidenceHash];
        isValid = record.exists;
        
        emit EvidenceVerified(evidenceHash, msg.sender, isValid, block.timestamp);

        if (isValid) {
            return (true, record.timestamp, record.registeredBy);
        }
        return (false, 0, address(0));
    }

    /**
     * @notice Retrieves the full immutable evidence record
     * @param evidenceHash The cryptographic hash to look up
     */
    function getEvidence(bytes32 evidenceHash) external view returns (EvidenceRecord memory) {
        if (!_registry[evidenceHash].exists) {
            revert EvidenceNotFound(evidenceHash);
        }
        return _registry[evidenceHash];
    }

    /**
     * @notice Returns total number of registered evidence proofs
     */
    function getTotalRecords() external view returns (uint256) {
        return _allHashes.length;
    }

    /**
     * @notice Returns evidence hash by index
     */
    function getHashByIndex(uint256 index) external view returns (bytes32) {
        require(index < _allHashes.length, "Index out of bounds");
        return _allHashes[index];
    }
}
