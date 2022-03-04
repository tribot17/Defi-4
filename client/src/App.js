import React, { Component, useEffect, useState } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

const App = () => {
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [networkId, setNetworkId] = useState();
  const [contract, setContract] = useState();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();

    setWeb3(web3);
    setAccounts(accounts);
    setNetworkId(networkId);
  };

  return (
    <div className="homePage">
      <h1>Staking Project</h1>
      <div>
        <h3>Staker vos tokens ERC20</h3>
      </div>
    </div>
  );
};

export default App;
