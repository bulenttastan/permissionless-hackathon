import { ethers } from 'hardhat';
import { expect } from 'chai';

const parseEther = (val: string) => ethers.parseUnits(val, 18);

async function main() {
  const [deployer, user1, user2] = await ethers.getSigners();

  const MockUSDC = await ethers.getContractFactory('MockUSDC');
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  console.log('USDC is deployed to:', await usdc.getAddress());

  const YesToken = await ethers.getContractFactory('YesToken');
  const yes = await YesToken.deploy();
  await yes.waitForDeployment();
  console.log('YES is deployed to:', await yes.getAddress());

  const NoToken = await ethers.getContractFactory('NoToken');
  const no = await NoToken.deploy();
  await no.waitForDeployment();
  console.log('NO is deployed to:', await no.getAddress());

  const MockOracle = await ethers.getContractFactory('MockOracle');
  const oracle = await MockOracle.deploy();
  await oracle.waitForDeployment();
  console.log('Oracle is deployed to:', await oracle.getAddress());

  const CPMM = await ethers.getContractFactory('CPMMWithERC20Shares');
  const market = await CPMM.deploy(usdc.target, oracle.target, yes.target, no.target);
  await market.waitForDeployment();
  console.log('Market is deployed to:', await market.getAddress());

  // Pre-mint 500 YES and 500 NO tokens and send to CPMM contract as initial liquidity
  await yes.mint(market.target, parseEther('500'));
  await no.mint(market.target, parseEther('500'));

  // Mint USDC to the user and approve the CPMM contract
  await usdc.mint(user1.address, parseEther('10000'));
  await usdc.connect(user1).approve(market.target, parseEther('10000'));
  await usdc.mint(user2.address, parseEther('10000'));
  await usdc.connect(user2).approve(market.target, parseEther('10000'));

  // Set up for user to purchase 100 tokens twice
  await market.connect(user2).buyYes(parseEther('100'));
  await market.connect(user2).buyYes(parseEther('100'));

  // Show probability on UI
  const yesProb = await market.getYesProbability();
  const noProb = await market.getNoProbability();
  console.log('Yes Prob:', yesProb);
  console.log('No Prob:', noProb);

  // Now purchase $1 worth of YES tokens
  const moneySpend = parseEther('1');
  const reserveBefore = await market.yesReserve();
  const reserveValue = await market.yesReserveValue();
  const estimateShares = await market.getDollarToShares(moneySpend, reserveValue, reserveBefore);
  await usdc.connect(user1).approve(market.target, moneySpend);
  await market.connect(user1).buyYes(estimateShares);

  // Validation
  const yesReserveAfter = await market.yesReserve();
  const noReserveBefore = await market.noReserve();
  const noReserveAfter = await market.noReserve();
  const yesReserveValueAfter = await market.yesReserveValue();
  expect(yesReserveAfter).to.be.closeTo(parseEther('299.64'), parseEther('0.01'));
  expect(noReserveAfter).to.be.closeTo(noReserveBefore, parseEther('0.0001'));
  expect(yesReserveValueAfter).to.be.closeTo(parseEther('835.46'), parseEther('0.01'));

  // Redeem a win/lose
  await oracle.setResolved(true, true);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
