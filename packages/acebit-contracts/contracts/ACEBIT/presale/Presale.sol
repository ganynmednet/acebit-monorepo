// SPDX-License-Identifier: GPL-3.0
/// @title ACEBIT Presale contract

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// https://github.com/CutupAngel/Presale-IERC20/blob/master/pre-sale.sol

interface IAlphaAceBitERC20 {
    function mint(address account_, uint256 amount_) external;
}

interface IUserStorage {
    function isUserWhitelisted(address account_) external returns(bool);
}

contract AceBitPresale is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    struct UserInfo {
        uint256 amount; // Amount DAI deposited by user
        uint256 debt; // total ROME claimed thus aROME debt
        bool claimed; // True if a user has claimed ROME
    }

    // Tokens to raise (DAI) & (FRAX) and for offer (aROME) which can be swapped for (ROME)
    IERC20 public ACEBIT;
    IERC20 public aACEBIT;
    IERC20 public DAI; // for user deposits

    address public UserStorage;
    address public DAO; // Multisig treasury to send proceeds to

    // address public WARCHEST; // Multisig to send team proceeds to
    mapping (address => uint256) public _contributions;
    

    uint256 public price = 20 * 1e18; // 20 DAI per ACEBIT

    uint256 public minCap = 500 * 1e18; // 1500 DAI cap per whitelisted user

    uint256 public maxCap = 1500 * 1e18; // 1500 DAI cap per whitelisted user

    uint256 public totalDAIRaised; // total DAI raised by sale
    // uint256 public totalRaisedFRAX; // total FRAX raised by sale

    uint256 public totalACEBITDebt; // total aROME and thus ACEBIT owed to users

    bool public started; // true when sale is started

    bool public ended; // true when sale is ended

    bool public claimable; // true when sale is claimable

    // bool public claimAlpha; // true when aROME is claimable

    bool public contractPaused; // circuit breaker

    mapping(address => UserInfo) public userInfo;

    // mapping(address => TeamInfo) public teamInfo;

    // mapping(address => bool) public whitelisted; // True if user is whitelisted

    // mapping(address => bool) public whitelistedTeam; // True if team member is whitelisted

    mapping(address => uint256) public romeClaimable; // amount of rome claimable by address

    event Deposit(address indexed who, uint256 amount);
    event Withdraw(address token, address indexed who, uint256 amount);
    event Mint(address token, address indexed who, uint256 amount);
    event SaleStarted(uint256 block);
    event SaleEnded(uint256 block);
    event ClaimUnlocked(uint256 block);
    event ClaimAlphaUnlocked(uint256 block);
    event AdminWithdrawal(address token, uint256 amount);

    constructor(
        address _ACEBIT,
        address _aACEBIT,
        address _DAI,
        address _DAO,
        address _UserStorage
    ) {
        require( _ACEBIT != address(0) );
        ACEBIT = IERC20(_ACEBIT );

        require( _aACEBIT != address(0) );
        aACEBIT = IERC20(_aACEBIT );

        require( _DAI != address(0) );
        DAI = IERC20(_DAI);
    
        require( _DAO != address(0) );
        DAO = _DAO;

        require( _UserStorage != address(0) );
        UserStorage = _UserStorage;
    }

    //* @notice modifer to check if contract is paused
    modifier checkIfPaused() {
        require(contractPaused == false, "contract is paused");
        _;
    }

  
    // @notice Starts the sale
    function start() external onlyOwner {
        require(!started, "Sale has already started");
        started = true;
        emit SaleStarted(block.number);
    }

    // @notice Ends the sale
    function end() external onlyOwner {
        require(started, "Sale has not started");
        require(!ended, "Sale has already ended");
        ended = true;
        emit SaleEnded(block.number);
    }

    // @notice lets users claim ACEBIT
    // @dev send sufficient ACEBIT before calling
    function unlockACEBITClaim() external onlyOwner {
        require(ended, "Sale has not ended");
        require(!claimable, "Claim has already been unlocked");
        require(ACEBIT.balanceOf(address(this)) >= totalACEBITDebt, 'not enough ROME in contract');
        claimable = true;
        emit ClaimUnlocked(block.number);
    }


    // // @notice lets users claim aROME
    // function claimAlphaUnlock() external onlyOwner {
    //     require(claimable, "Claim has not been unlocked");
    //     require(!claimAlpha, "Claim Alpha has already been unlocked");
    //     claimAlpha = true;
    //     emit ClaimAlphaUnlocked(block.number);
    // }

    // @notice lets owner pause contract
    function togglePause() external onlyOwner returns (bool){
        contractPaused = !contractPaused;
        return contractPaused;
    }
    
    /**
     *  @notice transfer ERC20 token to DAO multisig
     *  @param _token: token address to withdraw
     *  @param _amount: amount of token to withdraw
     */
    function adminWithdraw(address _token, uint256 _amount) external onlyOwner {
        IERC20( _token ).safeTransfer( address(msg.sender), _amount );
        emit AdminWithdrawal(_token, _amount);
    }

    /**
     *  @notice it deposits DAI for the sale
     *  @param _amount: amount of DAI to deposit to sale (18 decimals)
     */
    function deposit(uint256 _amount) external checkIfPaused {
        require(started, 'Sale has not started');
        require(!ended, 'Sale has ended');
        // require(whitelisted[msg.sender] == true, 'msg.sender is not whitelisted user');
        require( IUserStorage( UserStorage ).isUserWhitelisted(msg.sender), "User is not whitelisted!");

        UserInfo storage user = userInfo[msg.sender];

        require(
            maxCap >= user.amount.add(_amount),
            'new amount above user limit'
            );

        require(
            minCap <= user.amount.add(_amount),
            'new amount below user limit'
            );

        user.amount = user.amount.add(_amount);
        totalDAIRaised = totalDAIRaised.add(_amount);

        uint256 payout = _amount.mul(1e18).div(price).div(1e9); // aROME to mint for _amount

        totalACEBITDebt = totalACEBITDebt.add(payout);

        DAI.safeTransferFrom( msg.sender, DAO, _amount );

        IAlphaAceBitERC20( address(aACEBIT) ).mint( msg.sender, payout );

        emit Deposit(msg.sender, _amount);
    }

    /**
     *  @notice it deposits aACEBIT to withdraw ACEBIT from the sale
     *  @param _amount: amount of aACEBIT to deposit to sale (9 decimals)
     */
    function claimACEBIT(uint256 _amount) external checkIfPaused {
        require(claimable, 'ACEBIT is not yet claimable');
        require(_amount > 0, '_amount must be greater than zero');
        require(aACEBIT.balanceOf(address(this)) >= _amount, 'Not enough aACEBIT');

        UserInfo storage user = userInfo[msg.sender];

        user.debt = user.debt.add(_amount);

        totalACEBITDebt = totalACEBITDebt.sub(_amount);

        aACEBIT.safeTransferFrom( msg.sender, address(this), _amount );

        ACEBIT.safeTransfer( msg.sender, _amount );

        emit Mint(address(aACEBIT), msg.sender, _amount);
        emit Withdraw(address(ACEBIT), msg.sender, _amount);
    }

    // @notice it checks a users DAI allocation remaining
    function getUserRemainingAllocation(address _user) external view returns ( uint256 ) {
        UserInfo memory user = userInfo[_user];
        return maxCap.sub(user.amount);

    }
    // @notice it claims aROME back from the sale
    // function claimAlphaRome() external checkIfPaused {
    //     require(claimAlpha, 'aROME is not yet claimable');

    //     UserInfo storage user = userInfo[msg.sender];

    //     require(user.debt > 0, 'msg.sender has not participated');
    //     require(!user.claimed, 'msg.sender has already claimed');

    //     user.claimed = true;

    //     uint256 payout = user.debt;
    //     user.debt = 0;

    //     aROME.safeTransfer( msg.sender, payout );

    //     emit Withdraw(address(aROME),msg.sender, payout);
    // }

}