// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ProductRegistry {
    // ─── Structs ────────────────────────────────────────────────────────────────

    struct Product {
        uint256 id;
        string  name;
        string  category;
        string  manufacturer;
        uint256 createdAt;
        address owner;
        bool    exists;
    }

    // ─── State ──────────────────────────────────────────────────────────────────

    address public contractOwner;
    uint256 private _productCounter;

    mapping(uint256 => Product) private _products;
    mapping(address => bool)    private _manufacturers;

    // ─── Events ─────────────────────────────────────────────────────────────────

    event ProductCreated(uint256 indexed id, address indexed owner, string name);

    // ─── Errors ─────────────────────────────────────────────────────────────────

    error NotContractOwner();
    error NotRegisteredManufacturer();
    error ProductNotFound(uint256 id);

    // ─── Modifiers ──────────────────────────────────────────────────────────────

    modifier onlyContractOwner() {
        if (msg.sender != contractOwner) revert NotContractOwner();
        _;
    }

    modifier onlyManufacturer() {
        if (!_manufacturers[msg.sender]) revert NotRegisteredManufacturer();
        _;
    }

    // ─── Constructor ────────────────────────────────────────────────────────────

    constructor() {
        contractOwner = msg.sender;
    }

    // ─── Admin ──────────────────────────────────────────────────────────────────

    /// @notice Grants manufacturer role to an address. Only callable by the contract owner.
    function registerManufacturer(address manufacturer) external onlyContractOwner {
        _manufacturers[manufacturer] = true;
    }

    /// @notice Returns whether an address is a registered manufacturer.
    function isManufacturer(address account) external view returns (bool) {
        return _manufacturers[account];
    }

    // ─── Core ───────────────────────────────────────────────────────────────────

    /// @notice Creates a new product. Only registered manufacturers can call this.
    /// @return newId The auto-incremented product ID.
    function createProduct(
        string calldata name,
        string calldata category,
        string calldata manufacturer
    ) external onlyManufacturer returns (uint256 newId) {
        unchecked { ++_productCounter; }
        newId = _productCounter;

        _products[newId] = Product({
            id:           newId,
            name:         name,
            category:     category,
            manufacturer: manufacturer,
            createdAt:    block.timestamp,
            owner:        msg.sender,
            exists:       true
        });

        emit ProductCreated(newId, msg.sender, name);
    }

    // ─── Views ──────────────────────────────────────────────────────────────────

    /// @notice Returns the product data for a given ID.
    function getProduct(uint256 id) external view returns (Product memory) {
        if (!_products[id].exists) revert ProductNotFound(id);
        return _products[id];
    }

    /// @notice Returns the total number of products registered.
    function getProductCount() external view returns (uint256) {
        return _productCounter;
    }
}
