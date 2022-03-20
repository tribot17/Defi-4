import React, { Component, useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
// import StackingCore from "./contracts/stakingCore.json";
import Token from "./contracts/Token.json";
import Owner from "./contracts/Ower.json";
import ERC20 from "./contracts/ERC20.json";

const App = () => {
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [networkId, setNetworkId] = useState();
  const [contract, setContract] = useState();
  const [instance, setInstance] = useState();
  const [balanceOf, setBalanceOf] = useState(0);
  const [balancOfContract, setBalancOfContract] = useState(0);
  const [inputState, setInputState] = useState({});
  const [instanceOwner, setInstanceOwner] = useState();
  const [ERC20Token, setERC20] = useState();
  const [TokenName ,setTokenName] = useState();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const token = await new web3.eth.Contract(ERC20.abi, "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa");
    const deployedNetwork = Token.networks[networkId];
    const deployedNetwork2 = Owner.networks[networkId];

    const instance = new web3.eth.Contract(
      Token.abi,
      deployedNetwork && deployedNetwork.address
    );
    const instanceOwner = new web3.eth.Contract(
      Owner.abi,
      deployedNetwork2 && deployedNetwork2.address
    );

    const actualBalance = await instanceOwner.methods.getBalance(token._address, accounts[0]).call(); 

    setTokenName(await token.methods.name().call());
    setBalanceOf(actualBalance);
    setERC20(token);
    setInstance(instance);
    setWeb3(web3);
    setAccounts(accounts);
    setNetworkId(networkId);
    setInstanceOwner(instanceOwner);
  };

  const UpdateToken = async (token) => {
    const newToken = await new web3.eth.Contract(ERC20.abi, token);

    setERC20(newToken);
    console.log(ERC20Token);
  } 

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInputState({ ...inputState, [name]: value });
  };

  const handleChainLinkValue = async () => {
    console.log(instance.methods);

    let data = await instance.methods
      .getTokenEthPrice("0x64A436ae831C1672AE81F674CAb8B6775df3475C")
      .call()
      .then((res) => {
        console.log(res);
      });
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

  const updateBalance = async() => {
    const setBalance = await instanceOwner.methods.getBalance(ERC20Token._address, accounts[0]).call(); 
    setBalanceOf(setBalance);
  }

  return (
    <div className="homePage">
      <h1>Staking Project</h1>
      {/* <div>
        <h2>Total stacker sur le contract : {balancOfContract}</h2>
      </div> */}
      <div>
        <h3>Nombre de tokens stakés : {balanceOf} {TokenName}</h3>
      </div>

      {/* <div>
        Valeur de <button onClick={handleChainLinkValue}>Clicl</button>
      </div> */}

      {/* <div>
        <p>Stacker vos tokens</p>
        <input type="number" name="valueDeposit" onChange={handleInputChange} />
        <button onClick={deposit}>Stacker</button>
      </div> */}

      <div className="stakeContainer">
        <p>Stacker vos tokens</p>
        <input type="number" name="valueDeposit" onChange={handleInputChange} />
        {/* <button onClick={depositERC20}>Stacker</button> */}
      </div>
      <div>
        <p>Réclamer vos tokens</p>
        <input
          type="number"
          name="valueWidthraw"
          onChange={handleInputChange}
        />
        {/* <button onClick={withdraw}>Retirer</button> */}
      </div>

      <button onClick={() => depositERC20(100)}>Deposit</button>
      <button onClick={() => widthdrawERC20(100)}>Withdraw</button>
      <button onClick={() => UpdateToken("0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa")}>aprove</button>

    </div>
  );
};

export default App;
