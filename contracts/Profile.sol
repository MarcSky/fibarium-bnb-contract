// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ISBT721.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Profile is Ownable, AccessControl, ISBT721 {
    using Strings for uint256;
    using Counters for Counters.Counter;
    using EnumerableMap for EnumerableMap.AddressToUintMap;
    using EnumerableMap for EnumerableMap.UintToAddressMap;

    // Mapping from token ID to owner address
    EnumerableMap.UintToAddressMap private _ownerMap;
    EnumerableMap.AddressToUintMap private _tokenMap;

    // Token Id
    Counters.Counter private _tokenId;

    // Token name
    string public name;

    // Token symbol
    string public symbol;

    // Token URI
    string private _baseTokenURI;

    // Operator
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    constructor(string memory name_, string memory symbol_, address admin_) public {
        name = name_;
        symbol = symbol_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(OPERATOR_ROLE, admin_);
    }

    function mint(address to) external returns (uint256) {
        require(
            hasRole(OPERATOR_ROLE, _msgSender()),
            "Only the account with OPERATOR_ROLE can mint the SBT"
        );
        require(to != address(0), "Address is empty");

        if (_tokenMap.contains(to)) {
            burn(to);
        }

        _tokenId.increment();
        uint256 tokenId = _tokenId.current();

        _tokenMap.set(to, tokenId);
        _ownerMap.set(tokenId, to);

        emit Mint(to, tokenId);

        return tokenId;
    }

    function burn(address owner) public {
        require(
            hasRole(OPERATOR_ROLE, _msgSender()),
            "Only the account with OPERATOR_ROLE can mint the SBT"
        );
        require(owner != address(0), "Address is empty");
        require(
            _tokenMap.contains(owner),
            "The account does not have any SBT"
        );

        uint256 tokenId = _tokenMap.get(owner);

        _tokenMap.remove(owner);
        _ownerMap.remove(tokenId);

        emit Burn(owner, tokenId);
    }

    /**
     * @dev Update _baseTokenURI
     */
    function setBaseTokenURI(string calldata uri) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Only the account with DEFAULT_ADMIN_ROLE can set the base token URI"
        );

        _baseTokenURI = uri;
    }

    function balanceOf(address owner) external view returns (uint256) {
        (bool success,) = _tokenMap.tryGet(owner);
        return success ? 1 : 0;
    }

    function tokenIdOf(address from) external view returns (uint256) {
        return _tokenMap.get(from, "The wallet has not mint any SBT");
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        return _ownerMap.get(tokenId, "Invalid tokenId");
    }

    function totalSupply() external view returns (uint256) {
        return _tokenMap.length();
    }

    function isOperator(address account) external view returns (bool) {
        return hasRole(OPERATOR_ROLE, account);
    }

    function isAdmin(address account) external view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) external view returns (string memory) {
        return
        bytes(_baseTokenURI).length > 0
        ? string(abi.encodePacked(_baseTokenURI, tokenId.toString()))
        : "";
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override
    returns (bool)
    {
        return
        super.supportsInterface(interfaceId);
    }
}
