// SPDX-License-Identifier: GPL-3.0
/// @title ACEBIT UserStorage contract

pragma solidity ^0.8.6;
import "hardhat/console.sol";

//https://mumbai.polygonscan.com/address/0x3Bd5638e43BdD7687EdF8C4b35648261998eD4E5#readContract

contract UserStorage {
    constructor(address _owner) {
        owner = _owner;
        deployer = msg.sender;
    }

    address public owner;
    address private deployer;
    int256 private activeUsers;
    int256 private deletedUsers;

    struct Record {
        uint256 date;
        string text;
        string reason;
    }

    struct UserStruct {
        address userAddress;
        string userName;
        string discordId;
        string userEmail;
        bool whitelisted;
        bool active;
        Record[] history;
        uint256 updatedAt;
        uint256 deletedAt;
        uint256 createdAt;
    }

    mapping(address => UserStruct) private userStructs;
    // mapping(address => deletedUserStruct) private deletedUserStructs;

    address[] private userIndex;

    event LogNewUser(
        address indexed userAddress,
        string userName,
        string discordId,
        string userEmail,
        bool whitelited,
        uint256 created,
        uint256 updated
    );
    event LogUpdateUser(
        address indexed userAddress,
        string userName,
        string discordId,
        string userEmail,
        uint256 updated
    );
    event LogRecordAdded(
        address indexed userAddress,
        string text,
        string reason,
        uint256 updated
    );

    event LogDeleteUser(address indexed userAddress, uint256 deleted);

    modifier onlyOwner() {
        require(
            msg.sender == owner || msg.sender == deployer,
            "Ownable: caller is not the owner"
        );
        _;
    }

    modifier isWhitelisted(address _userAddress) {
        require(
            userStructs[_userAddress].whitelisted == true,
            "Whitelist: You need to be whitelisted"
        );
        _;
    }

    // @notice Check if user exist
    function isUser(address userAddress) public view onlyOwner returns (bool) {
        // if (userIndex.length == 0) return false;
        // require(userIndex.length != 0, "Whitelist: You need to be whitelisted");
        if (userStructs[userAddress].createdAt > 0) {
            return true;
        }
        return false;
    }

    // @notice Check if user exist Private
    function _isUser(address userAddress)
        private
        view
        onlyOwner
        returns (bool)
    {
        // if (userIndex.length == 0) return false;
        // require(userIndex.length != 0, "Whitelist: You need to be whitelisted");
        if (userStructs[userAddress].createdAt > 0) {
            return true;
        }
        return false;
    }

    function isUserWhitelisted(address userAddress) public view returns (bool) {
        return userStructs[userAddress].whitelisted;
    }

    // @notice insert user
    function addUser(
        address userAddress,
        string memory userName,
        string memory discordId,
        string memory userEmail,
        string memory reason,
        bool whitelisted,
        uint256 created
    ) public onlyOwner returns (bool) {
        require(!_isUser(userAddress), "User exists");

        userStructs[userAddress].userAddress = userAddress;
        userStructs[userAddress].userName = userName;
        userStructs[userAddress].discordId = discordId;
        userStructs[userAddress].userEmail = userEmail;
        userStructs[userAddress].whitelisted = whitelisted;
        userStructs[userAddress].active = true;
        userStructs[userAddress].createdAt = created;
        userStructs[userAddress].updatedAt = created;
        userStructs[userAddress].history.push(
            Record(created, "User has been created", reason)
        );

        activeUsers++;

        emit LogNewUser(
            userAddress,
            userName,
            discordId,
            userEmail,
            whitelisted,
            created,
            created
        );
        return true;
    }

    function addUserHistoryRecord(
        address userAddress,
        string memory text,
        string memory reason,
        uint256 updated
    ) public onlyOwner returns (bool) {
        require(_isUser(userAddress), "User doesn't exist");

        userStructs[userAddress].history.push(Record(updated, text, reason));

        emit LogRecordAdded(userAddress, text, reason, updated);
        return true;
    }

    function updateUserName(
        address userAddress,
        string memory userName,
        string memory reason,
        uint256 updated
    ) public onlyOwner returns (bool) {
        require(_isUser(userAddress), "User doesn't exist");
        userStructs[userAddress].userName = userName;

        userStructs[userAddress].history.push(
            Record(updated, "User Name has been updated", reason)
        );

        emit LogUpdateUser(
            userAddress,
            userName,
            userStructs[userAddress].discordId,
            userStructs[userAddress].userEmail,
            updated
        );
        return true;
    }

    function updateDiscordId(
        address userAddress,
        string memory discordId,
        string memory reason,
        uint256 updated
    ) public onlyOwner returns (bool) {
        require(_isUser(userAddress), "User doesn't exist");
        userStructs[userAddress].discordId = discordId;

        userStructs[userAddress].history.push(
            Record(updated, "User DiscordId has been updated", reason)
        );

        emit LogUpdateUser(
            userAddress,
            userStructs[userAddress].userName,
            discordId,
            userStructs[userAddress].userEmail,
            updated
        );
        return true;
    }

    function updateUserEmail(
        address userAddress,
        string memory userEmail,
        string memory reason,
        uint256 updated
    ) public onlyOwner returns (bool) {
        require(_isUser(userAddress), "User doesn't exist");
        userStructs[userAddress].userEmail = userEmail;

        userStructs[userAddress].history.push(
            Record(updated, "User Email has been updated", reason)
        );

        emit LogUpdateUser(
            userAddress,
            userStructs[userAddress].userName,
            userStructs[userAddress].discordId,
            userEmail,
            updated
        );
        return true;
    }

    // @notice delete user
    function deleteUser(
        address userAddress,
        string memory reason,
        uint256 deleted
    ) public onlyOwner returns (bool) {
        require(_isUser(userAddress), "User doesn't exist");

        userStructs[userAddress].active = false;
        userStructs[userAddress].deletedAt = deleted;

        userStructs[userAddress].history.push(
            Record(deleted, "User has been deleted", reason)
        );

        activeUsers--;
        deletedUsers++;

        emit LogDeleteUser(userAddress, deleted);
        return true;
    }

    function getUser(address userAddress)
        external
        view
        onlyOwner
        returns (UserStruct memory)
    {
        return userStructs[userAddress];
    }

    // function getAlpha() public onlyOwner returns (address) {
    //     console.log("test");
    //     // console.log(deployer);
    //     address _deployer = deployer;
    //     return _deployer;
    // }

    function setOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    function getDeployer() external view onlyOwner returns (address) {
        address _deployer = deployer;
        return _deployer;
    }

    function getActiveUsers() external view onlyOwner returns (int256) {
        return activeUsers;
    }

    function getDeletedUsers() external view onlyOwner returns (int256) {
        return deletedUsers;
    }
}
