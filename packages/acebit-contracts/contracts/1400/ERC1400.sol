pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IERC1400.sol";

// contract ERC1400 is IERC20, IERC1400, Ownable, ERC1820Client, ERC1820Implementer, MinterRole, DomainAware {

abstract contract ERC1400 is IERC20, IERC1400, Ownable {
    using SafeMath for uint256;

    // Token
    string internal constant ERC1400_INTERFACE_NAME = "ERC1400Token";
    string internal constant ERC20_INTERFACE_NAME = "ERC20Token";

    // Token extensions
    string internal constant ERC1400_TOKENS_CHECKER = "ERC1400TokensChecker";
    string internal constant ERC1400_TOKENS_VALIDATOR =
        "ERC1400TokensValidator";

    // User extensions
    string internal constant ERC1400_TOKENS_SENDER = "ERC1400TokensSender";
    string internal constant ERC1400_TOKENS_RECIPIENT =
        "ERC1400TokensRecipient";

    /************************************* Token description ****************************************/
    string internal _name;
    string internal _symbol;
    uint256 internal _granularity;
    uint256 internal _totalSupply;
    bool internal _migrated;
    /************************************************************************************************/

    /**************************************** Token behaviours **************************************/
    // Indicate whether the token can still be controlled by operators or not anymore.
    bool internal _isControllable;

    // Indicate whether the token can still be issued by the issuer or not anymore.
    bool internal _isIssuable;
    /************************************************************************************************/

    /********************************** ERC20 Token mappings ****************************************/
    // Mapping from tokenHolder to balance.
    mapping(address => uint256) internal _balances;

    // Mapping from (tokenHolder, spender) to allowed value.
    mapping(address => mapping(address => uint256)) internal _allowed;
    /************************************************************************************************/

    /**************************************** Documents *********************************************/
    struct Doc {
        string docURI;
        bytes32 docHash;
        uint256 timestamp;
    }
    // Mapping for documents.
    mapping(bytes32 => Doc) internal _documents;
    mapping(bytes32 => uint256) internal _indexOfDocHashes;
    bytes32[] internal _docHashes;
    /************************************************************************************************/

    /*********************************** Partitions  mappings ***************************************/
    // List of partitions.
    bytes32[] internal _totalPartitions;

    // Mapping from partition to their index.
    mapping(bytes32 => uint256) internal _indexOfTotalPartitions;

    // Mapping from partition to global balance of corresponding partition.
    mapping(bytes32 => uint256) internal _totalSupplyByPartition;

    // Mapping from tokenHolder to their partitions.
    mapping(address => bytes32[]) internal _partitionsOf;

    // Mapping from (tokenHolder, partition) to their index.
    mapping(address => mapping(bytes32 => uint256))
        internal _indexOfPartitionsOf;

    // Mapping from (tokenHolder, partition) to balance of corresponding partition.
    mapping(address => mapping(bytes32 => uint256))
        internal _balanceOfByPartition;

    // List of token default partitions (for ERC20 compatibility).
    bytes32[] internal _defaultPartitions;
    /************************************************************************************************/

    /********************************* Global operators mappings ************************************/
    // Mapping from (operator, tokenHolder) to authorized status. [TOKEN-HOLDER-SPECIFIC]
    mapping(address => mapping(address => bool)) internal _authorizedOperator;

    // Array of controllers. [GLOBAL - NOT TOKEN-HOLDER-SPECIFIC]
    address[] internal _controllers;

    // Mapping from operator to controller status. [GLOBAL - NOT TOKEN-HOLDER-SPECIFIC]
    mapping(address => bool) internal _isController;
    /************************************************************************************************/

    /******************************** Partition operators mappings **********************************/
    // Mapping from (partition, tokenHolder, spender) to allowed value. [TOKEN-HOLDER-SPECIFIC]
    mapping(bytes32 => mapping(address => mapping(address => uint256)))
        internal _allowedByPartition;

    // Mapping from (tokenHolder, partition, operator) to 'approved for partition' status. [TOKEN-HOLDER-SPECIFIC]
    mapping(address => mapping(bytes32 => mapping(address => bool)))
        internal _authorizedOperatorByPartition;

    // Mapping from partition to controllers for the partition. [NOT TOKEN-HOLDER-SPECIFIC]
    mapping(bytes32 => address[]) internal _controllersByPartition;

    // Mapping from (partition, operator) to PartitionController status. [NOT TOKEN-HOLDER-SPECIFIC]
    mapping(bytes32 => mapping(address => bool))
        internal _isControllerByPartition;
    /************************************************************************************************/

    /***************************************** Modifiers ********************************************/
    /**
     * @dev Modifier to verify if token is issuable.
     */
    modifier isIssuableToken() {
        require(_isIssuable, "55"); // 0x55	funds locked (lockup period)
        _;
    }
    /**
     * @dev Modifier to make a function callable only when the contract is not migrated.
     */
    modifier isNotMigratedToken() {
        require(!_migrated, "54"); // 0x54	transfers halted (contract paused)
        _;
    }
    // /**
    //  * @dev Modifier to verifiy if sender is a minter.
    //  */
    // modifier onlyMinter() override {
    //     require(isMinter(msg.sender) || owner() == _msgSender());
    //     _;
    // }
    /************************************************************************************************/

    /**************************** Events (additional - not mandatory) *******************************/
    event ApprovalByPartition(
        bytes32 indexed partition,
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    /************************************************************************************************/

    /**
     * @dev Initialize ERC1400 + register the contract implementation in ERC1820Registry.
     * @param name Name of the token.
     * @param symbol Symbol of the token.
     * @param granularity Granularity of the token.
     * @param controllers Array of initial controllers.
     * @param defaultPartitions Partitions chosen by default, when partition is
     * not specified, like the case ERC20 tranfers.
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 granularity,
        address[] memory controllers,
        bytes32[] memory defaultPartitions
    )  { // public TBA
        _name = name;
        _symbol = symbol;
        _totalSupply = 0;
        require(granularity >= 1); // Constructor Blocked - Token granularity can not be lower than 1
        _granularity = granularity;

        // _setControllers(controllers);

        _defaultPartitions = defaultPartitions;

        _isControllable = true;
        _isIssuable = true;

        // Register contract in ERC1820 registry
        // ERC1820Client.setInterfaceImplementation(
        //     ERC1400_INTERFACE_NAME,
        //     address(this)
        // );
        // ERC1820Client.setInterfaceImplementation(
        //     ERC20_INTERFACE_NAME,
        //     address(this)
        // );

        // Indicate token verifies ERC1400 and ERC20 interfaces
        // ERC1820Implementer._setInterface(ERC1400_INTERFACE_NAME); // For migration
        // ERC1820Implementer._setInterface(ERC20_INTERFACE_NAME); // For migration
    }
}
