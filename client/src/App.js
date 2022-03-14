import React, { Component, useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
import StackingCore from "./contracts/stakingCore.json";

const App = () => {
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [networkId, setNetworkId] = useState();
  const [contract, setContract] = useState();
  const [instance, setInstance] = useState();
  const [balanceOf, setBalanceOf] = useState(0);
  const [balancOfContract, setBalancOfContract] = useState(0);
  const [inputState, setInputState] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = StackingCore.networks[networkId];
    const instance = new web3.eth.Contract(
      StackingCore.abi,
      deployedNetwork && deployedNetwork.address
    );

    setBalanceOf(await instance.methods.balanceOf(accounts[0],"0xa36085F69e2889c224210F603D836748e7dC0088").call());
    setBalancOfContract(await instance.methods.getBalance().call());

    setInstance(instance);
    setWeb3(web3);
    setAccounts(accounts);
    setNetworkId(networkId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInputState({ ...inputState, [name]: value });

    console.log(inputState);
  };

  const deposit = async () => {
    await web3.eth.sendTransaction({
      to: instance._address,
      from: accounts[0],
      value: web3.utils.toWei(inputState.valueDeposit, "ether"),
    });
    setBalanceOf(await instance.methods.balanceOf(accounts[0],"0xa36085F69e2889c224210F603D836748e7dC0088").call());
  };

  const withdraw = async () => {
    await instance.methods
      .withdrawMoney(web3.utils.toWei(inputState.valueWidthraw, "ether"))
      .send({ from: accounts[0] });
    setBalanceOf(await instance.methods.balanceOf(accounts[0]).call());
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

  const depositERC20 = async () => {
    await instance.methods
      .stakeERC20(2, "0xa36085F69e2889c224210F603D836748e7dC0088")
      .send({ from: accounts[0] });
  };

  return (
    <div className="homePage">
      <h1>Staking Project</h1>
      <div>
        <h2>Total stacker sur le contract : {balancOfContract}</h2>
      </div>
      <div>
        <h3>Nombre de tokens stakés : {balanceOf}</h3>
      </div>

      <div>
        Valeur de <button onClick={handleChainLinkValue}>Clicl</button>
      </div>

      <div>
        <p>Stacker vos tokens</p>
        <input type="number" name="valueDeposit" onChange={handleInputChange} />
        <button onClick={deposit}>Stacker</button>
      </div>

      <div>
        <p>Stacker vos tokens</p>
        <input type="number" name="valueDeposit" onChange={handleInputChange} />
        <button onClick={depositERC20}>Stacker</button>
      </div>
      <div>
        <p>Réclamer vos tokens</p>
        <input
          type="number"
          name="valueWidthraw"
          onChange={handleInputChange}
        />
        <button onClick={withdraw}>Retirer</button>
      </div>
    </div>
  );
};

export default App;
