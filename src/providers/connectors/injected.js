const ConnectToInjected = async (isConnectedBefore = true) => {
  let provider = null;
  const params = [{
    "chainId": "0x38", // 56 in decimal
    "chainName": "Binance Smart Chain",
    "rpcUrls": [
      "https://bsc-dataseed.binance.org"
    ],
    "nativeCurrency": {
      "name": "Binance Coin",
      "symbol": "BNB",
      "decimals": 18
    },
    "blockExplorerUrls": [
      "https://bscscan.com"
    ]
  }];
  if (typeof window.ethereum !== 'undefined') {
    provider = window.ethereum;
    try {
      await provider.request({ method: 'eth_requestAccounts', })
      // await provider.request({ method: 'wallet_addEthereumChain', params, })
      if (!isConnectedBefore) {
        await provider.request({
          method: "wallet_requestPermissions",
          params: [
            {
              eth_accounts: {}
            }
          ]
        });
      }
    } catch (error) {
      throw new Error("User Rejected");
    }
  } else if (window.web3) {
    provider = window.web3.currentProvider;
  } else {
    throw new Error("No Web3 Provider found");
  }
  return provider;
};

export default ConnectToInjected;