// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WalletLock {
    event Locked(address indexed owner, address indexed nominee, uint256 amount, uint256 timestamp);
    event Released(address indexed owner, address indexed nominee, uint256 amount, uint256 timestamp);
    event MonitorSignerUpdated(address indexed oldSigner, address indexed newSigner);
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);

    struct LockInfo {
        address nominee;
        uint256 amount;
        uint256 lockedAt;
        bool released;
    }

    mapping(address => LockInfo) public locks;

    address public monitorSigner;
    address public owner;

    uint256 public constant INACTIVITY_PERIOD = 60 days;

    modifier onlyOwner() {
        require(msg.sender == owner, "WalletLock: caller is not owner");
        _;
    }

    constructor(address _monitorSigner) {
        require(_monitorSigner != address(0), "Invalid monitor signer");
        monitorSigner = _monitorSigner;
        owner = msg.sender;
        emit MonitorSignerUpdated(address(0), _monitorSigner);
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function lock(address nominee) external payable {
        require(nominee != address(0), "Invalid nominee");
        require(msg.value > 0, "Must send ETH to lock");

        LockInfo storage li = locks[msg.sender];
        require(!li.released && li.amount == 0, "Existing active lock present");

        locks[msg.sender] = LockInfo({
            nominee: nominee,
            amount: msg.value,
            lockedAt: block.timestamp,
            released: false
        });

        emit Locked(msg.sender, nominee, msg.value, block.timestamp);
    }

    function unlock(address ownerAddr, uint256 lastActiveTimestamp, bytes calldata signature) external {
        LockInfo storage li = locks[ownerAddr];
        require(li.amount > 0, "No funds locked for owner");
        require(!li.released, "Already released");
        require(block.timestamp >= lastActiveTimestamp + INACTIVITY_PERIOD, "Inactivity period not yet reached");

        bytes32 messageHash = keccak256(abi.encodePacked(address(this), ownerAddr, lastActiveTimestamp));
        bytes32 ethSigned = _toEthSignedMessageHash(messageHash);
        address recovered = _recoverSigner(ethSigned, signature);
        require(recovered == monitorSigner, "Invalid inactivity proof signature");

        li.released = true;
        uint256 amount = li.amount;
        address nominee = li.nominee;
        li.amount = 0;

        (bool sent, ) = nominee.call{value: amount}("");
        require(sent, "Transfer to nominee failed");

        emit Released(ownerAddr, nominee, amount, block.timestamp);
    }

    function updateMonitorSigner(address newSigner) external onlyOwner {
        require(newSigner != address(0), "Invalid new signer");
        address old = monitorSigner;
        monitorSigner = newSigner;
        emit MonitorSignerUpdated(old, newSigner);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        address old = owner;
        owner = newOwner;
        emit OwnershipTransferred(old, newOwner);
    }

    receive() external payable {}

    function _toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    function _recoverSigner(bytes32 ethSignedMessageHash, bytes memory signature) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }
        if (v < 27) {
            v += 27;
        }
        require(v == 27 || v == 28, "Invalid signature 'v' value");
        return ecrecover(ethSignedMessageHash, v, r, s);
    }
}
