// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./interfaces/IConfig.sol";
import "./UserManager.sol";

enum Role {
    None,
    Admin,
    Manager,
    Member
}

struct Member {
    address id;
    Role role;
}

struct Worship {
    bytes16 id;
    address[] members;
    mapping(address => Member) memberMap;
    address[] applicants;
    bool used;
}

contract WorshipManager {
    uint8 constant RETRY_TIMES = 10;

    // all worships
    mapping(bytes16 => Worship) worships;
    // total worship number
    uint128 public worshipNumber;
    // config contract
    IConfig public configContract;
    // user manager contract
    UserManager public userManagerContract;

    /**
     * @dev Creates a worship group
     */
    function createWorship() external {
        bool found = false;
        for (uint8 i = 0; i < RETRY_TIMES; i++) {
            bytes32 hash = keccak256(abi.encode(block.number, msg.sender, i));
            bytes16 worshipAddr = bytes16(hash);
            Worship storage ws = worships[worshipAddr];
            if (!ws.used) {
                ws.id = worshipAddr;
                ws.used = true;
                ws.members.push(msg.sender);
                Member storage m = ws.memberMap[msg.sender];
                m.id = msg.sender;
                m.role = Role.Admin;
                found = true;
                userManagerContract.joinWorship(worshipAddr, msg.sender);
                break;
            }
        }

        require(found, "Create worship failed");
    }

    /**
     * @dev Returns the uri of the metadata
     */
    function getMetadataUri(bytes16 _id) external view returns (string memory) {
        return configContract.getWorshipMetadataUri(_id);
    }

    /**
     * @dev Applys to join the worship group
     * @param _id: the id of worship group
     */
    function applyJoin(bytes16 _id) external {
        Worship storage ws = worships[_id];
        require(ws.used, "Worship not exists");

        for (uint256 i = 0; i < ws.applicants.length; i++) {
            require(ws.applicants[i] != msg.sender, "Duplicated ppplication");
        }

        ws.applicants.push(msg.sender);
    }

    /**
     * @dev Accepts the application
     * @param _id: the id of worship group
     * @param _userId: the id of applicant
     */
    function acceptApplication(bytes16 _id, address _userId) external {
        Worship storage ws = worships[_id];
        require(ws.used, "Worship not exists");

        require(ws.memberMap[msg.sender].role == Role.Admin, "Permission denied");

        bool found = false;
        for (uint256 i = 0; i < ws.applicants.length; i++) {
            if (ws.applicants[i] == _userId) {
                found = true;
                ws.applicants[i] = ws.applicants[ws.applicants.length - 1];
                ws.applicants.pop();
                ws.members.push(_userId);
                Member storage m = ws.memberMap[_userId];
                m.id = _userId;
                m.role = Role.Member;
                break;
            }
        }

        require(found, "Applicant not exists");
    }

    function setConfigContractAddress(address _address) external {
        configContract = IConfig(_address);
    }

    function setUserManagerContractAddress(address _address) external {
        userManagerContract = UserManager(_address);
    }
}
