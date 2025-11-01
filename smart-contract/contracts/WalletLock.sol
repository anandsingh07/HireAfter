// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WalletLock {
    event Locked(address indexed owner, address indexed nominee, uint256 amount, uint256 timestamp);
    event Released(address indexed owner, address indexed nominee, uint256 amount, uint256 timestamp);
    event ActivityUpdated(address indexed user, uint256 newTimestamp);
    event MonitorSignerUpdated(address indexed oldSigner, address indexed newSigner);
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
    event Paused(bool status);

    struct LockInfo {
        address nominee;
        uint256 amount;
        bool released;
        uint256 timestamp;
    }

    mapping(address => LockInfo[]) public locks;
    mapping(address => uint256) public lastActiveTimestamp;
    address[] private allLockers;
    bool public paused;
    address public monitorSigner;
    address public owner;
    uint256 public constant INACTIVITY_PERIOD = 60 days;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier notPaused() {
        require(!paused, "System paused");
        _;
    }

    constructor(address _monitorSigner) {
        owner = msg.sender;
        monitorSigner = _monitorSigner;
    }

    function lock(address[] calldata nominees) external payable notPaused {
        require(msg.value > 0, "Must send ETH");
        require(nominees.length > 0, "No nominees");
        uint256 share = msg.value / nominees.length;
        require(share > 0, "Too many nominees");
        if (locks[msg.sender].length == 0) {
            allLockers.push(msg.sender);
        }
        for (uint256 i = 0; i < nominees.length; i++) {
            locks[msg.sender].push(
                LockInfo({
                    nominee: nominees[i],
                    amount: share,
                    released: false,
                    timestamp: block.timestamp
                })
            );
            emit Locked(msg.sender, nominees[i], share, block.timestamp);
        }
        lastActiveTimestamp[msg.sender] = block.timestamp;
    }

    function withdraw() external notPaused {
        LockInfo[] storage userLocks = locks[msg.sender];
        require(userLocks.length > 0, "No locks found");
        uint256 totalWithdraw = 0;
        for (uint256 i = 0; i < userLocks.length; i++) {
            if (!userLocks[i].released && userLocks[i].amount > 0) {
                totalWithdraw += userLocks[i].amount;
                userLocks[i].released = true;
                emit Released(msg.sender, userLocks[i].nominee, userLocks[i].amount, block.timestamp);
            }
        }
        require(totalWithdraw > 0, "Nothing to withdraw");
        (bool sent, ) = msg.sender.call{value: totalWithdraw}("");
        require(sent, "Withdraw failed");
    }

    function autoRelease(address ownerAddr) external notPaused {
        require(msg.sender == monitorSigner || msg.sender == owner, "Not authorized");
        LockInfo[] storage userLocks = locks[ownerAddr];
        require(userLocks.length > 0, "No locks");
        require(block.timestamp >= lastActiveTimestamp[ownerAddr] + INACTIVITY_PERIOD, "Inactivity not reached");
        uint256 totalReleased = 0;
        for (uint256 i = 0; i < userLocks.length; i++) {
            if (!userLocks[i].released && userLocks[i].amount > 0) {
                userLocks[i].released = true;
                totalReleased += userLocks[i].amount;
                (bool sent, ) = userLocks[i].nominee.call{value: userLocks[i].amount}("");
                require(sent, "Transfer failed");
                emit Released(ownerAddr, userLocks[i].nominee, userLocks[i].amount, block.timestamp);
            }
        }
        require(totalReleased > 0, "No funds released");
    }

    function markActive(address user, uint256 timestamp) external {
        require(msg.sender == monitorSigner, "Only monitor");
        lastActiveTimestamp[user] = timestamp;
        emit ActivityUpdated(user, timestamp);
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit Paused(_paused);
    }

    function updateMonitorSigner(address newSigner) external onlyOwner {
        require(newSigner != address(0), "Invalid");
        emit MonitorSignerUpdated(monitorSigner, newSigner);
        monitorSigner = newSigner;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function getLocks(address user) external view returns (LockInfo[] memory) {
        return locks[user];
    }

    function getAllLockers() external view returns (address[] memory) {
        return allLockers;
    }

    receive() external payable {}
}
