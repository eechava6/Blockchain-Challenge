pragma solidity ^0.5.0;

contract MetaStore {
    uint8 private clientCount;
    mapping (address => uint) private balances;
    address public buyer;

  // Log the event about a deposit being made by an address and its amount
    event LogProductBuyed(address indexed buyer, uint amount);

    /// @notice Deposit ether into bank, requires method is "payable"
    /// @return The balance of the user after the deposit is made
    function buyProduct() public payable returns (uint) {
        balances[msg.sender] += msg.value;
        emit LogProductBuyed(msg.sender, msg.value);
        return balances[msg.sender];
    }

    /// @return The balance of the Simple Bank contract
    function moneyReached() public view returns (uint) {
        return address(this).balance;
    }
}