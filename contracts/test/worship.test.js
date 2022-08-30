const utils = require('./utils');
const { assert } = require('console');

const Config = artifacts.require('Config');
const UserManager = artifacts.require('UserManager');
const WorshipManager = artifacts.require("WorshipManager");
const Test = artifacts.require("Test");

contract('Worship', function(accounts) {
    let admin = accounts[0];
    let member = accounts[1];
    let stranger = accounts[2];

    let worshipId;

    describe('User manager', function() {
        describe('Metadata uri', function() {
            it('should be set properly', async () => {
                let test = await Test.new();
                let user = await UserManager.deployed();
                let uri = await user.getMetadataUri(member);
                let id = await test.getUint128FromBytes16('0x12345678123456781234567812345678');
                assert(uri == 'https://www.baidu.com/' + id);
            });
        });
    });

    describe('Worship manager', function() {
        describe('Metadata uri', function() {
            it('should be set properly', async () => {
                let test = await Test.new();
                let worship = await WorshipManager.deployed();
                let uri = await worship.getMetadataUri('0x12345678123456781234567812345678');
                let id = await test.getUint128FromBytes16('0x12345678123456781234567812345678');
                assert(uri == 'https://www.baidu.com/' + id);
            });
        });

        describe('Create worship', function() {
            it('should succeed', async () => {
                let worship = await WorshipManager.deployed();
                await worship.createWorship({from: admin});
                let userManager = await UserManager.deployed();
                let userInfo = await userManager.getUserInfo(admin);
                worshipId = userInfo.worships[0];
            });
        });

        describe('Apply join', function() {
            describe('Worship not exists', function() {
                it('should fail', async () => {
                    let worship = await WorshipManager.deployed();
                    await utils.expectThrow(worship.applyJoin('0x12345678123456781234567812345678', {from: member}), 'Worship not exists');
                });
            });

            describe('Worship exists', function() {
                it('should succeed', async () => {
                    let worship = await WorshipManager.deployed();
                    await worship.applyJoin(worshipId, {from: member});
                });
            });
        });

        describe('Accept application', function() {
            describe('Worship not exists', function() {
                it('should fail', async () => {
                    let worship = await WorshipManager.deployed();
                    await utils.expectThrow(worship.acceptApplication('0x12345678123456781234567812345678', stranger, {from: member}), 'Worship not exists');
                });
            });

            describe('Permission denied', function() {
                it('should fail', async () => {
                    let worship = await WorshipManager.deployed();
                    await utils.expectThrow(worship.acceptApplication(worshipId, stranger, {from: member}), 'Permission denied');
                });
            });

            describe('Applicant not exists', function() {
                it('should fail', async () => {
                    let worship = await WorshipManager.deployed();
                    await utils.expectThrow(worship.acceptApplication(worshipId, stranger, {from: admin}), 'Applicant not exists');
                });
            });

            describe('All conditions satisfied', function() {
                it('should succeed', async () => {
                    let worship = await WorshipManager.deployed();
                    await worship.acceptApplication(worshipId, member, {from: admin});
                });
            });
        });
    });
});