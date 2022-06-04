import Web3Modal from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import { providerOptions } from '../configs/providerOptions';
import store from "../store";


export const ConnectWallet = async (showPopup, hidePopup, setProvider, setSigner) => {

    // var state = store.getState()

    let connectedProvider, rawProvider, changeState, signer, account, web3Modal;

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

    try {
        rawProvider = await web3Modal.connect();
        connectedProvider = new Web3Provider(rawProvider, "any");
        setProvider(connectedProvider)
        console.log("PROVIDER HAS BEEN SET")

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

    store.dispatch({
        type: "USERDATA/UPDATE_WEB3_DATA", payload: {
            account: "0xAF662D14D8Ab5C5d251E7DB7BB93fE7F102C1AC9",
            chainId: "80001"
        }
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