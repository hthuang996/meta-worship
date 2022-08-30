// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Test {
    function getUint128FromBytes16(bytes16 b) external view returns (uint128) {
        return uint128(b);
    }
}