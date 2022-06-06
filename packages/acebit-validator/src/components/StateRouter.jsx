
import React, { useContext } from 'react';
import { connect } from 'react-redux';
import ConnectDiscord from './steps/ConnectDiscord'
import ConnectWallet from './steps/ConnectWallet';


function StateRouter(props) {

    console.log("ROUTER STATES >>")
    console.log(props)


    if (!props.userStates["DISCORD_CONNECTED_DONE"].completed) {
        console.log("ROUTE TO StepConnectDiscord")
        return <ConnectDiscord />
    }


    if (!props.userStates["WALLET_CONNECTED_DONE"].completed) {
        console.log("ROUTE TO StepConnectWallet")
        return <ConnectWallet />
      }

}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(StateRouter);