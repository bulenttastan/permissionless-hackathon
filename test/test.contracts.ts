// test/test.contracts.js

import { expect } from 'chai';
import { ethers } from 'hardhat';
import { CPMMWithERC20Shares, MockOracle, MockUSDC, NoToken } from '../typechain-types';
import { YesToken } from '../typechain-types/contracts/Tokens.sol';

const parseEther = (val: string) => ethers.parseUnits(val, 18);

describe('CPMMWithERC20Shares', function () {
  let deployer, user;
  let usdc: MockUSDC, yes: YesToken, no: NoToken, oracle: MockOracle, market: CPMMWithERC20Shares;

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory('MockUSDC');
    usdc = await MockUSDC.deploy();

    const YesToken = await ethers.getContractFactory('YesToken');
    yes = await YesToken.deploy();

    const NoToken = await ethers.getContractFactory('NoToken');
    no = await NoToken.deploy();

    const MockOracle = await ethers.getContractFactory('MockOracle');
    oracle = await MockOracle.deploy();

    const CPMM = await ethers.getContractFactory('CPMMWithERC20Shares');
    market = await CPMM.deploy(usdc.target, oracle.target, yes.target, no.target);

    // Pre-mint 500 YES and 500 NO tokens and send to CPMM contract as initial liquidity
    await yes.mint(market.target, parseEther('500'));
    await no.mint(market.target, parseEther('500'));

    // Mint USDC to the user and approve the CPMM contract
    await usdc.mint(user.address, parseEther('10000'));
    await usdc.connect(user).approve(market.target, parseEther('10000'));
  });

  it('step 1: buy 100 YES and check price', async function () {
    const amountOut = parseEther('100');
    const amountIn = await market.getSharesToDollar(amountOut, parseEther('500'), parseEther('500'));
    expect(amountIn).to.be.closeTo(parseEther('125'), parseEther('0.5'));
    const yesReserveValue0 = await market.yesReserveValue();

    await market.connect(user).buyYes(amountOut);
    const yesReserve = await market.yesReserve();
    const noReserve = await market.noReserve();
    const yesReserveValue = await market.yesReserveValue();
    expect(yesReserve).to.be.closeTo(parseEther('400'), parseEther('0.0001'));
    expect(noReserve).to.be.closeTo(parseEther('500'), parseEther('0.0001'));
    expect(yesReserveValue).to.be.closeTo(parseEther('625'), parseEther('0.5'));
  });

  it('step 2: buy another 100 YES and check new price', async function () {
    const amountOut1 = parseEther('100');
    await market.connect(user).buyYes(amountOut1);
    const newYesReserve = await market.yesReserve();
    const newNoReserve = await market.noReserve();
    const yesReserveValue1 = await market.yesReserveValue();

    const amountOut2 = parseEther('100');
    const amountIn2 = await market.getSharesToDollar(amountOut2, yesReserveValue1, newYesReserve);
    expect(amountIn2).to.be.closeTo(parseEther('209.08'), parseEther('0.5'));
    await market.connect(user).buyYes(amountOut2);
    const yesReserve = await market.yesReserve();
    const noReserve = await market.noReserve();
    const yesReserveValue = await market.yesReserveValue();
    expect(yesReserve).to.be.closeTo(parseEther('300'), parseEther('0.0001'));
    expect(noReserve).to.be.closeTo(parseEther('500'), parseEther('0.0001'));
    expect(yesReserveValue).to.be.closeTo(parseEther('834.333333333333333333'), parseEther('0.5'));
  });

  // not working
  it('step 3: buy $1 of YES and check price', async function () {
    await market.connect(user).buyYes(parseEther('100'));
    await market.connect(user).buyYes(parseEther('100'));
    const yesReserveBefore = await market.yesReserve();
    const noReserveBefore = await market.noReserve();

    // Now purchase $1 worth of tokens
    const moneySpend = parseEther('1');
    const yesReserveValue = await market.yesReserveValue();
    const estimateShares = await market.getDollarToShares(moneySpend, yesReserveValue, yesReserveBefore);
    await usdc.connect(user).approve(market.target, moneySpend);
    await market.connect(user).buyYes(estimateShares);

    const yesReserveAfter = await market.yesReserve();
    const noReserveAfter = await market.noReserve();
    const yesReserveValueAfter = await market.yesReserveValue();
    expect(yesReserveAfter).to.be.closeTo(parseEther('299.64'), parseEther('0.01'));
    expect(noReserveAfter).to.be.closeTo(noReserveBefore, parseEther('0.0001'));
    expect(yesReserveValueAfter).to.be.closeTo(parseEther('835.46'), parseEther('0.01'));
  });
});
