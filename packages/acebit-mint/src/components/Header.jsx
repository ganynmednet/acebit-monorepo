
import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { PopupContext } from '../App';
import { Web3Context } from '../App';
import { ConnectWallet, DisconnectWallet } from '../modules/web3Connector';
import { addressShortener } from '../helpers';
import store from '../store';


function Header(props) {

    const { showPopup, hidePopup, popupMessage } = useContext(PopupContext)
    const { setSigner, setProvider } = useContext(Web3Context)

    const connectWallet = () => {
        console.log("HEADER: I TRY TO CONNECT")

        if (!props.userStates["WALLET_CONNECTED_PENDING"].completed) {
            store.dispatch({ type: "STATES/TOGGLE_STATE", payload: "WALLET_CONNECTED_PENDING" })
        }
        
        ConnectWallet(showPopup, hidePopup, setProvider, setSigner)
    }

    const disconnectWallet = () => {
        console.log("HEADER: I TRY TO CONNECT")
        DisconnectWallet(setProvider, setSigner)
    }

    const getButtonText = () => {
        // console.log(props)
        if (props.account) {
            return (
                <a class="header__menu-profile" href="" onClick={disconnectWallet}>
                    <img src="./images/global/profile-img.png" alt="" />

                    {addressShortener(props.account)} </a>

            )
        }

        return (
            <a class="header__menu-profile" href="" onClick={connectWallet}>
                Connect Wallet 
            </a>
        );

    }


    return (
        <header class="header">
            <a class="header__logo" href="#">
                <img src="./images/global/logo.svg" alt="" />
            </a>
            <div class="header__menu">
                <div class="header__menu-container">
                    <a class="header__menu-link" href="#">Documentation</a>
                    <a class="header__menu-link" href="#">Website</a>
                </div>

                {getButtonText()}

            </div>
            <button class="menu-btn" aria-label="Main Menu">
                <svg width="30" height="30" viewBox="0 0 100 100">
                    <path class="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                    <path class="line line2" d="M 20,50 H 80" />
                    <path class="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                </svg>
            </button>
        </header>
    )
}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(Header);