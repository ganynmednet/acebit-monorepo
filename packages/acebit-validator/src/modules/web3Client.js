import Web3Modal from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import { providerOptions } from '../configs/providerOptions';
import { MAINNET } from '../configs/config';
import { utils } from 'ethers';
import store from "../store";
import Web3 from 'web3';


export const ConnectWallet = async (showPopup, hidePopup, setProvider, setSigner) => {

    // var state = store.getState()

    let connectedProvider, rawProvider, chain, signer, account, web3Modal;

    console.log("connect")
    web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: false, // optional
        providerOptions // required
        // request: {
        //   method: "eth_blockNumber",
        //   params: [],
        //   skipCache: true,
        //   jsonrpc: "2.0"
        // }
    });
    if (window.ethereum) {
        window.ethereum.autoRefreshOnNetworkChange = false;
    }

    // get provider
    try {
        rawProvider = await web3Modal.connect();
        connectedProvider = new Web3Provider(rawProvider, "any");
        setProvider(connectedProvider)

    } catch (e) {
        console.log(e)
        showPopup({
            header: "Problem getting Provider",
            message: `Please, check your wallet settings.`,
            buttons: [
                {
                    text: "Close and Check the Wallet",
                    highlighted: true,
                    action: hidePopup
                }
            ]
        })
        return false;
    }


    // get chain
    chain = await connectedProvider.getNetwork();
    console.log(chain.chainId, MAINNET.chainId)

    if (chain.chainId != MAINNET.chainId) {
        console.log("Bad network");
        console.log(window.ethereum)
        if (window.ethereum) {
            window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                    chainId: Web3.utils.toHex(MAINNET.chainId),
                    rpcUrls: ["https://rpc-mainnet.matic.network/"],
                    chainName: "Matic Mainnet",
                    nativeCurrency: {
                        name: "MATIC",
                        symbol: "MATIC",
                        decimals: 18
                    },
                    blockExplorerUrls: ["https://polygonscan.com/"]
                }]
            })
        }

    }

    // get signer
    try {
        signer = await connectedProvider.getSigner()
        setSigner(signer)

    } catch {
        console.log("get signer error")
        showPopup({
            header: "Problem getting Signer",
            message: `Check your wallet settings.`,
            buttons: [
                {
                    text: "Check Wallet and Try Again",
                    highlighted: true,
                    action: hidePopup
                }
            ]
        })
        return false;

    }


    // get account
    try {
        account = await signer.getAddress();
    } catch {
        console.log("get account error")
        return false;
    }

    store.dispatch({
        type: "USERDATA/UPDATE_WEB3_DATA", payload: {
            account: account,
            chainId: chain.chainId
        }
    })

    store.dispatch({
        type: "STATES/TOGGLE_STATE",
        payload: "WALLET_CONNECTED_DONE"
    })

    console.log("WALLET HAS BEEN CONNECTED")
}


export const DisconnectWallet = async (setProvider, setSigner) => {
    console.log("WALLET HAS BEEN DISCONNECTED")
    setProvider(null);
    setSigner(null);
    store.dispatch({
        type: "USERDATA/UPDATE_WEB3_DATA", payload: {
            account: "",
            chainId: ""
        }
    })

}