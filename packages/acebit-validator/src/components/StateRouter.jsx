
import React, { useContext } from 'react';
import { connect } from 'react-redux';
import ConnectDiscordStep from './steps/ConnectDiscordStep'
import ConnectWalletStep from './steps/ConnectWalletStep';
import CreateAccountStep from './steps/CreateAccountStep'
import ConfirmationStep from './steps/ConfirmationStep';

function StateRouter(props) {

    console.log("ROUTER STATES >>")
    console.log(props)


    if (!props.userStates["DISCORD_CONNECTED_DONE"].completed) {
        console.log("ROUTE TO StepConnectDiscord")
        return <ConnectDiscordStep />
    }


    if (!props.userStates["WALLET_CONNECTED_DONE"].completed) {
        console.log("ROUTE TO StepConnectWallet")
        return <ConnectWalletStep />
    }


    if (!props.userStates["ACCOUNT_CREATED_DONE"].completed) {
        console.log("ROUTE TO StepCreateAccount")
        return <CreateAccountStep />
    }

    return <ConfirmationStep />

}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(StateRouter);