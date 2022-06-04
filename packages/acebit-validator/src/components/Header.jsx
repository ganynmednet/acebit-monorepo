import { addressShortener } from '../helpers';
import { Web3Context } from '../App';
import React, { useContext } from 'react';
import { ConnectWallet, DisconnectWallet } from '../modules/web3Client.js';
// import { ConnectWallet } from '../modules/web3Client';
import store from "../store";



function Header(props) {

    // const currentState = props.currentState;
    // const { connect, disconnect, account } = useContext(Web3Context)
    var state = store.getState()

    // const connectWallet = () => {
    //     // console.log("HEADER: I TRY TO CONNECT")
    //     // connect()
    //     ConnectWallet();
    // }


    // const disconnectWallet = () => {
    //     // disconnect();
    //     DisconnectWallet();
    // }


    const getButtonText = (account) => {
        console.log(account)
        if (props.account) {
            return (
                <a className="header__btn-disconnect" href="#" onClick={DisconnectWallet}>  {addressShortener(props.account)}  </a>
            )
        }

        // if (props.currentState > 3) {
        //     return (
        //         <a className="header__btn" href="#" onClick={ConnectWallet}> Connect Wallet </a>
        //     )
        // }

        return (
            <a className="header__btn" href="#" onClick={ConnectWallet}> Connect Wallet </a>
        )

    }   

    return (
        <>
            <header class="header">
                <div class="container">
                    <div class="header__box">
                        <div class="header__logo">
                            <img src={process.env.PUBLIC_URL + "/images/logo.svg"} alt="" />
                        </div>
                        { getButtonText(props.account) }
                    </div>
                </div>
            </header>

        </>
    )
}

export default Header;