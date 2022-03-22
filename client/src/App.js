import React, { Component, useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
// import StackingCore from "./contracts/stakingCore.json";
import Token from "./contracts/Token.json";
import Owner from "./contracts/Ower.json";
import ERC20 from "./contracts/ERC20.json";
import feedRegistryInterfaceABI from "./FeedRegistryInterABI.json";

const App = () => {
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [networkId, setNetworkId] = useState();
  const [contract, setContract] = useState();
  const [balanceOf, setBalanceOf] = useState(0);
  const [balancOfContract, setBalancOfContract] = useState(0);
  const [inputState, setInputState] = useState({});
  const [instanceOwner, setInstanceOwner] = useState();
  const [ERC20Token, setERC20] = useState();
  const [TokenName, setTokenName] = useState();
  const [feedRegistry, setFeedRegistery] = useState();
  const [decimals, setDecimals] = useState();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const token = await new web3.eth.Contract(
      ERC20.abi,
      "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"
    );
    const deployedNetwork = Owner.networks[networkId];
    const addr = "0xAa7F6f7f507457a1EE157fE97F6c7DB2BEec5cD0";
    const feedRegistry = new web3.eth.Contract(feedRegistryInterfaceABI, addr);
    const LINK = "0xa36085F69e2889c224210F603D836748e7dC0088";

    const instanceOwner = new web3.eth.Contract(
      Owner.abi,
      deployedNetwork && deployedNetwork.address
    );

    const setBalance = await instanceOwner.methods
      .addressBalance(token._address, accounts[0])
      .call();

    console.log(setBalance / 10 ** (await token.methods.decimals().call()));

    setFeedRegistery(feedRegistry);
    setERC20(token);
    setTokenName(await token.methods.name().call());
    setDecimals(await token.methods.decimals().call());
    setBalanceOf(setBalance / 10 ** (await token.methods.decimals().call()));
    setWeb3(web3);
    setAccounts(accounts);
    setNetworkId(networkId);
    setInstanceOwner(instanceOwner);
  };

  const UpdateToken = async (token) => {
    const newToken = await new web3.eth.Contract(ERC20.abi, token);
    const { methods } = newToken;
    console.log(await methods.name().call());

    setERC20(newToken);
    setTokenName(await methods.name().call());
    setDecimals(await methods.decimals().call());
    updateBalance(token);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputState({ ...inputState, [name]: value });
  };

  const getRealBalance = async () => {
    console.log(
      await instanceOwner.methods
        .addressBalance(ERC20Token._address, accounts[0])
        .call()
    );
  };

  const depositERC20 = async (amount, token) => {
    let tokenValue = (await getTokenValue(token)).toString();

    var number = web3.utils.toBN(tokenValue);

    await ERC20Token.methods
      .approve(instanceOwner._address, web3.utils.toWei(amount, "ether"))
      .send({ from: accounts[0] })
      .then((hash) => {
        instanceOwner.methods
          .depositToken(
            ERC20Token._address,
            web3.utils.toWei(amount, "ether"),
            tokenValue
          )
          .send({ from: accounts[0] })
          .then(() => {
            updateBalance(token);
          });
      });
  };

  const widthdrawERC20 = async (amount, token) => {
    // "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"
    let tokenValue = await getTokenValue(token);
    await ERC20Token.methods
      .approve(accounts[0], amount)
      .send({ from: accounts[0] })
      .on("receipt", () => {
        instanceOwner.methods
          .widthdrawToken(token, web3.utils.toWei(amount, "ether"), tokenValue)
          .send({ from: accounts[0] })
          .then(() => {
            updateBalance(token);
          });
      });
  };

  const getTokenValue = async (token1) => {
    const USD = "0x0000000000000000000000000000000000000348";
    let value;

    await feedRegistry.methods
      .latestRoundData(token1, USD)
      .call()
      .then((roundData) => {
        value = Math.round(roundData.answer / 10 ** 8);
      });
    // let res = Math.round(value * 100) / 10;
    return value;
  };

  const rewardValue = async () => {
    let valuer = await instanceOwner.methods
      .getReward(ERC20Token._address)
      .call();
    console.log(valuer);
  };

  const redeem = async () => {
    await instanceOwner.methods.redeemReward(ERC20Token._address).call();
  };

  const updateBalance = async (token) => {
    const setBalance = await instanceOwner.methods
      .getBalance(token, accounts[0], decimals)
      .call();
    setBalanceOf(setBalance);
  };

  return (
    <div className="homePage">
      <h1>Staking Project</h1>
      <div>
        <h3>
          Nombre de tokens stakés : {balanceOf} {TokenName}
        </h3>
      </div>

      <div>
        <div className="stakeContainer">
          <p>Stacker vos tokens</p>
          <input
            type="number"
            name="valueDeposit"
            onChange={handleInputChange}
          />
          <button
            onClick={() =>
              depositERC20(inputState.valueDeposit, ERC20Token._address)
            }
          >
            Deposit
          </button>
        </div>
        <div>
          <p>Réclamer vos tokens</p>
          <input
            type="number"
            name="valueWidthraw"
            onChange={handleInputChange}
          />
          <button
            onClick={() =>
              widthdrawERC20(inputState.valueWidthraw, ERC20Token._address)
            }
          >
            Withdraw
          </button>
        </div>
        <div>
          <p>Réclamer la récompenses</p>
          <button onClick={redeem}>Réclamer</button>
        </div>
        <div>
          <p>Changer de token</p>
          <input
            type="number"
            name="valueDeposit"
            onChange={handleInputChange}
          />
          <button
            onClick={() =>
              UpdateToken("0xa36085F69e2889c224210F603D836748e7dC0088")
            }
          >
            Update
          </button>
        </div>
        <button
          onClick={() =>
            getTokenValue("0xa36085F69e2889c224210F603D836748e7dC0088")
          }
        >
          valeur
        </button>

        <button onClick={() => rewardValue()}>reward</button>
        <button onClick={() => getRealBalance()}>balance</button>
      </div>
    </div>
  );
};

export default App;
