
import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { config } from '../../configs/config';
import { getDiscordAvatart } from '../../modules/DiscordClient.js'
import { ConnectWallet, DisconnectWallet } from '../../modules/web3Client.js';
import ConnectionButtonSection from '../utils/ConnectionButton'
import { Web3Context } from '../../App';
import { PopupContext } from '../../App';
import store from '../../store';

class RolesList extends React.Component {
    constructor(props) {
        super(props);
        this.userData = props.userData;
    }
    render() {
        if (this.userData.roles.length == 0) {
            return null
        }

        return (
            this.userData.roles.map((keyName, i) =>

                <div class={config.roleColors[keyName]} key={i}>
                    <div class="validator__account-color"></div>
                    {config.roles[keyName]}
                </div>
            )
        )
    }
}


function ConnectWalletStep(props) {
    console.log("StepConnectWallet >>>")

    const { showPopup, hidePopup, popupMessage } = useContext(PopupContext)
    const { setSigner, setProvider } = useContext(Web3Context)

    async function handleConnect() {

        if (!props.userStates["WALLET_CONNECTED_PENDING"].completed) {
            store.dispatch({ type: "STATES/TOGGLE_STATE", payload: "WALLET_CONNECTED_PENDING" })
        }
        console.log("HEADER: I TRY TO CONNECT")
        ConnectWallet(showPopup, hidePopup, setProvider, setSigner)

    }

    return (
        <div class="validator__content-box">
            <div class="validator__content">
                <div class="validator__account">
                    <div class="validator__account-your">
                        your discord account
                    </div>

                    <div class="validator__account-img">
                        <img src={getDiscordAvatart(props.userData.id, props.userData.avatar)} alt="" />
                    </div>

                    <div class="validator__account-name">
                        {props.userData.username}
                    </div>

                    <div class="validator__account-items">

                        <RolesList userData={props.userData} />

                    </div>
                </div>

                <ConnectionButtonSection userData={props.userData} connect={handleConnect} />

            </div>
        </div>
    )
};

const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates,
        userData: store.userData
    }
}

export default connect(mapStateToProps)(ConnectWalletStep);
