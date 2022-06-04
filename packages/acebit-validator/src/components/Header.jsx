
import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { ConnectWallet, DisconnectWallet } from '../modules/web3Client.js';
import { addressShortener } from '../helpers';
import { PopupContext } from '../App';
import { Web3Context } from '../App';
// import { ConnectWallet } from '../modules/web3Client';
// import store from "../store";


function Header(props) {

    const { showPopup, hidePopup, popupMessage } = useContext(PopupContext)
    const { setSigner, setProvider } = useContext(Web3Context)

    const connectWallet = () => {
        console.log("HEADER: I TRY TO CONNECT")
        ConnectWallet(showPopup, hidePopup, setProvider, setSigner )
    }

    const disconnectWallet = () => {
        console.log("HEADER: I TRY TO CONNECT")
        DisconnectWallet(setProvider, setSigner )
    }

    const getButtonText = () => {
        console.log(props)
        if (props.account) {
            return (
                <a className="header__btn-disconnect" href="#" onClick={disconnectWallet}>  {addressShortener(props.account)}  </a>
            )
        }

        // if (props.currentState > 3) {
        //     return (
        //         <a className="header__btn" href="#" onClick={ConnectWallet}> Connect Wallet </a>
        //     )
        // }

        return (
            <a className="header__btn" href="#" onClick={connectWallet}> Connect Wallet </a>
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
                        {getButtonText(props.account)}
                    </div>
                </div>
            </header>
        </>
    )
}

const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account
    }
}

export default connect(mapStateToProps)(Header);