// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ProductRegistry.sol";

contract TraceabilityLog {
    // ─── Structs ────────────────────────────────────────────────────────────────

    struct TraceEvent {
        string  stage;
        string  location;
        string  actor;
        string  description;
        uint256 timestamp;
        bool    verified;
        address registeredBy;
    }

    // ─── State ──────────────────────────────────────────────────────────────────

    ProductRegistry private _registry;

    /// @dev productId => ordered list of trace events
    mapping(uint256 => TraceEvent[]) private _events;

    // ─── Events ─────────────────────────────────────────────────────────────────

    event StageAdded(uint256 indexed productId, string stage, address indexed by);

    // ─── Errors ─────────────────────────────────────────────────────────────────

    error NotProductOwner(uint256 productId, address caller);

    // ─── Constructor ────────────────────────────────────────────────────────────

    constructor(address registryAddress) {
        _registry = ProductRegistry(registryAddress);
    }

    // ─── Core ───────────────────────────────────────────────────────────────────

    /// @notice Appends a new traceability event to a product's log.
    ///         Only the product owner (the manufacturer who created it) can call this.
    ///         The timestamp is set automatically to block.timestamp.
    function addEvent(
        uint256        productId,
        string calldata stage,
        string calldata location,
        string calldata actor,
        string calldata description
    ) external {
        ProductRegistry.Product memory product = _registry.getProduct(productId);
        if (product.owner != msg.sender) revert NotProductOwner(productId, msg.sender);

        _events[productId].push(TraceEvent({
            stage:        stage,
            location:     location,
            actor:        actor,
            description:  description,
            timestamp:    block.timestamp,
            verified:     false,
            registeredBy: msg.sender
        }));

        emit StageAdded(productId, stage, msg.sender);
    }

    // ─── Views ──────────────────────────────────────────────────────────────────

    /// @notice Returns the full event log for a product.
    function getEvents(uint256 productId) external view returns (TraceEvent[] memory) {
        return _events[productId];
    }

    /// @notice Returns the number of events registered for a product.
    function getEventCount(uint256 productId) external view returns (uint256) {
        return _events[productId].length;
    }
}
