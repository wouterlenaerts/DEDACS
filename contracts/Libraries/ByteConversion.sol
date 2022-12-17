// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

library ByteConversion {
    function uintToBytes(uint256 number) internal pure returns (bytes memory) {
        bytes memory b = abi.encodePacked(number);
        return b;
    }

    function stringToBytes(string memory s) internal pure returns (bytes memory) {
        bytes memory b = bytes(s);
        return b;
    }    

    function bytesToUint256(bytes memory _bytes, uint256 _start) internal pure returns (uint256) {
        //This function is copied from: 
        //https://ethereum.stackexchange.com/questions/51229/how-to-convert-bytes-to-uint-in-solidity/51234
        require(_bytes.length >= _start + 32, "toUint256_outOfBounds");
        uint256 tempUint;
        assembly {
            tempUint := mload(add(add(_bytes, 0x20), _start))
        }
        
        return tempUint;
    }

    function bytesToString(bytes memory b) internal pure returns (string memory) {
        return string(abi.encodePacked(b));
    }    
    
    function addressToBytes(address a) public pure returns (bytes memory) {
        return abi.encodePacked(a);
    }

    function bytesToAddress(bytes memory b) public pure returns (address addr) {
    //This function is copied from https://ethereum.stackexchange.com/questions/15350/how-to-convert-an-bytes-to-address-in-solidity
        assembly {
            addr := mload(add(b,20))
        } 
    }

}
