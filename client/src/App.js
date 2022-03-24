import React, { Component, useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
// import StackingCore from "./contracts/stakingCore.json";
import Token from "./contracts/Token.json";
import StackingCore from "./contracts/StackingCore.json";
import ERC20 from "./contracts/ERC20.json";
import feedRegistryInterfaceABI from "./FeedRegistryInterABI.json";

const App = () => {
  const initialState = {
    balance: 0,
  };
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [networkId, setNetworkId] = useState();
  const [contract, setContract] = useState();
  const [stacker, setStacker] = useState(initialState);
  const [balance, setBalance] = useState();
  const [balancOfContract, setBalancOfContract] = useState(0);
  const [inputState, setInputState] = useState({});
  const [instance, setinstance] = useState();
  const [ERC20Token, setERC20] = useState();
  const [TokenName, setTokenName] = useState();
  const [feedRegistry, setFeedRegistery] = useState();
  const [decimals, setDecimals] = useState();
  const USD = "0x0000000000000000000000000000000000000348";

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
    const deployedNetwork = StackingCore.networks[networkId];
    const addr = "0xAa7F6f7f507457a1EE157fE97F6c7DB2BEec5cD0";
    const feedRegistry = new web3.eth.Contract(feedRegistryInterfaceABI, addr);
    const LINK = "0xa36085F69e2889c224210F603D836748e7dC0088";

    const instance = new web3.eth.Contract(
      StackingCore.abi,
      deployedNetwork && deployedNetwork.address
    );

    // const setBalance = await instance.methods
    //   .getBalance(token._address)
    //   .call();

    setFeedRegistery(feedRegistry);
    setERC20(token);
    setStacker(
      await instance.methods.stacker(accounts[0], token._address).call()
    );
    setTokenName(await token.methods.name().call());
    setDecimals(await token.methods.decimals().call());
    setWeb3(web3);
    setAccounts(accounts);
    setNetworkId(networkId);
    setinstance(instance);
    setBalance(
      await instance.methods.getBalance(token._address, accounts[0]).call()
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputState({ ...inputState, [name]: value });
  };

  const UpdateToken = async (token) => {
    const newToken = await new web3.eth.Contract(ERC20.abi, token);
    const { methods } = newToken;
    setStacker(
      await instance.methods.stacker(accounts[0], newToken._address).call()
    );
    setERC20(newToken);
    setTokenName(await methods.name().call());
    setDecimals(await methods.decimals().call());
  };

  const depositERC20 = async (amount, token) => {
    await ERC20Token.methods
      .approve(instance._address, web3.utils.toWei(amount, "ether"))
      .send({ from: accounts[0] })
      .then((hash) => {
        instance.methods
          .depositToken(
            ERC20Token._address,
            web3.utils.toWei(amount, "ether"),
            decimals
          )
          .send({ from: accounts[0] })
          .then(() => {
            updateBalance(token);
          });
      });
  };

  const widthdrawERC20 = async (amount, token) => {
    await ERC20Token.methods
      .approve(accounts[0], amount)
      .send({ from: accounts[0] })
      .on("receipt", () => {
        instance.methods
          .withdrawToken(token, web3.utils.toWei(amount, "ether"))
          .send({ from: accounts[0] })
          .then(() => {
            updateBalance(token);
          });
      });
  };

  const getBalance = async () => {
    console.log(stacker);
  };

  const rewardValue = async () => {
    await instance.methods
      .getRewardValue(ERC20Token._address, accounts[0])
      .call()
      .then((res) => {
        console.log(res);
      });
  };

  const redeem = async () => {
    await instance.methods.redeemReward(ERC20Token._address).call();
  };

  const depositTime = async () => {
    console.log(
      await instance.methods
        .depositTime(accounts[0], ERC20Token._address)
        .call()
    );
  };

  const updateBalance = async (token) => {
    setBalance(
      await instance.methods.getBalance(ERC20Token._address, accounts[0]).call()
    );
  };

  return (
    <div className="homePage">
      <h1>Staking Project</h1>
      <div>
        <h3>
          Nombre de tokens stakés :{" "}
          {balance != undefined ? balance / 10 ** decimals : 0} {TokenName}
        </h3>
      </div>

      <div>
        <div className="stakeContainer">
          <select>
            <option>DAI</option>
            <option>ChainLink</option>
          </select>
          <div className="deposit">
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
            <p style={{ marginTop: "10px" }}>Réclamer vos tokens</p>
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
        </div>
        <div className="redeem">
          <p>Montant de votre récompense : </p>
          <button onClick={redeem}>Réclamer</button>
        </div>
        <div>
          <p>Token custom</p>
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

        <button onClick={() => rewardValue()}>reward</button>
        <button onClick={() => getBalance()}>balance</button>
        <button onClick={() => depositTime()}>time</button>
      </div>
    </div>
  );
};

export default App;
