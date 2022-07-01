
import React, { useContext } from 'react';
import { connect } from 'react-redux';
import PreMint from './steps/PreMint'
import Mint from './steps/Mint';
import Done from './steps/Done';
import Error from './steps/Error';

function StateRouter(props) {

    console.log("ROUTER STATES >>")
    console.log(props)


    // if (!props.userStates["DISCORD_CONNECTED_DONE"].completed) {
    //     console.log("ROUTE TO StepConnectDiscord")
    //     return <ConnectDiscordStep />
    // }


    // if (!props.userStates["WALLET_CONNECTED_DONE"].completed) {
    //     console.log("ROUTE TO StepConnectWallet")
    //     return <ConnectWalletStep />
    // }


    // if (!props.userStates["ACCOUNT_CREATED_DONE"].completed) {
    //     console.log("ROUTE TO StepCreateAccount")
    //     return <CreateAccountStep />
    // }
    console.log(process.env.REACT_APP_MINT)
    if (process.env.REACT_APP_MINT == "OFF") {
        return <PreMint />
    }

    return <Mint />

}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(StateRouter);