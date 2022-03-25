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
  const [TokenName ,setTokenName] = useState();
  const [feedRegistry, setFeedRegistery] = useState();
  const [decimals, setDecimals] = useState();
  const [symbol, setSymbols] = useState();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const token = await new web3.eth.Contract(ERC20.abi, "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa");
    const deployedNetwork = Owner.networks[networkId];
    const addr = "0xAa7F6f7f507457a1EE157fE97F6c7DB2BEec5cD0";
    const feedRegistry = new web3.eth.Contract(feedRegistryInterfaceABI, addr);
    const LINK = '0xa36085F69e2889c224210F603D836748e7dC0088';  

    const instanceOwner = new web3.eth.Contract(
      Owner.abi,
      deployedNetwork && deployedNetwork.address
    );

    const actualBalance = await instanceOwner.methods.getBalance(token._address, accounts[0]).call(); 

    setFeedRegistery(feedRegistry);
    setTokenName(await token.methods.name().call());
    setBalanceOf(actualBalance);
    setERC20(token);
    setWeb3(web3);
    setAccounts(accounts);
    setNetworkId(networkId);
    setInstanceOwner(instanceOwner);
  };

  const UpdateToken = async (token) => {
    const newToken = await new web3.eth.Contract(ERC20.abi, token);
    const { methods } = newToken;

    setERC20(newToken);
    setTokenName(await methods.name().call());
    setDecimals(await methods.decimals().call());
    console.log(ERC20Token);
  } 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputState({ ...inputState, [name]: value });
  };


  const depositERC20 = async (amount) => {
    await ERC20Token.methods
    .approve(instanceOwner._address, amount)
    .send({from:accounts[0]}).on("receipt", (hash) => {
       instanceOwner.methods
      .depositToken("0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa", 
      amount)
      .send({ from: accounts[0] }).then(() => {
        updateBalance();
      });
    }); 
  };

  const widthdrawERC20 = async (amount) => {
    await ERC20Token.methods
    .approve(accounts[0], amount)
    .send({from:accounts[0]}).on("receipt", (hash) => {
       instanceOwner.methods
      .widthdrawToken("0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa", 
      amount)
      .send({ from: accounts[0] }).then(() => {
        updateBalance();
      });
    }); 
  };

  const getTokenValue = async (token1) => {
    const USD = '0x0000000000000000000000000000000000000348';
    
    console.log(ERC20Token);
    feedRegistry.methods.latestRoundData(token1, USD).call()
    .then((roundData) => {
        console.log("Latest Round Data", (roundData.answer / 10 ** decimals))
    });
  }

  const updateBalance = async() => {
    const setBalance = await instanceOwner.methods.getBalance(ERC20Token._address, accounts[0]).call(); 
    setBalanceOf(setBalance);
  }

  return (
    <div className="homePage">
      <h1>Staking Project</h1>
      <div>
        <h3>Nombre de tokens stakés : {balanceOf} {TokenName}</h3>
      </div>

      <div className="stakeContainer">
        <p>Stacker vos tokens</p>
        <input type="number" name="valueDeposit" onChange={handleInputChange} />
        <button onClick={() => depositERC20(100)}>Deposit</button>
      </div>
      <div>
        <p>Réclamer vos tokens</p>
        <input
          type="number"
          name="valueWidthraw"
          onChange={handleInputChange}
        />
        <button onClick={() => widthdrawERC20(100)}>Withdraw</button>
      </div>

      <button onClick={() => UpdateToken("0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa")}>Update</button>
      <button onClick={() => getTokenValue("0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa")}>Update</button>

    </div>
  );
};

export default App;
