
import store from "../store";


export const ConnectWallet = async () => {
    
    var state = store.getState()
    console.log(state)

    store.dispatch({ type: "USERDATA/UPDATE_WEB3_DATA", payload: {
        account: "0xAF662D14D8Ab5C5d251E7DB7BB93fE7F102C1AC9",
        chainId: "80001"
    } })
    console.log("WALLET HAS BEEN CONNECTED")

}


export const DisconnectWallet = async () => {
    console.log("WALLET HAS BEEN DISCONNECTED")
    var state = store.getState()
    console.log(state)

}