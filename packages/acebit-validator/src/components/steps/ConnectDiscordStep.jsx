
import React, { useEffect, useState } from 'react';
import { config } from '../../configs/config';
import BouncingDotsLoader from '../utils/BouncingDotsLoader';
import store from '../../store';
import { checkLocalStorage } from '../../modules/DiscordClient'
import { connect } from 'react-redux';

export function ConnectDiscordStep(props) {

    const authorizeDiscord = async () => {
        if (!props.userStates["DISCORD_CONNECTED_PENDING"].completed) {
            store.dispatch({ type: "STATES/TOGGLE_STATE", payload: "DISCORD_CONNECTED_PENDING" })
        }

        console.log("TRYING TO FETCH LOCAL DATA")
        var _res = await checkLocalStorage()
        console.log("LOCAL DATA FETCHED")

        if (_res) {
            store.dispatch({ type: "STATES/TOGGLE_STATE", payload: "DISCORD_CONNECTED_DONE" })
            return;
        }

        window.location.href = config.discordURLs[process.env.NODE_ENV];
        return;

    }

    if (props.userStates["DISCORD_CONNECTED_PENDING"].completed) {
        return (

            <>
                <div class="connect">
                    <div class="connect__logo">
                        <img src="./images/connect/connect-logo.svg" alt="" />
                    </div>
                    <div class="connect__title">
                        Connect your Discord
                    </div>
                    <div class="connect__description">
                        Connect your Discord account to link
                        it to your AceBit profile.
                    </div>
                    <br />
                    {/* <br /><br /> */}
                    <BouncingDotsLoader />
                </div>
            </>
        )

    }

    return (
        <>

            <div class="connect">
                <div class="connect__logo">
                    <img src="./images/connect/connect-logo.svg" alt="" />
                </div>
                <div class="connect__title">
                    Connect your Discord
                </div>
                <div class="connect__description">
                    Connect your Discord account to link
                    it to your AceBit profile.
                </div>

                <a class="connect__auth global__btn-yellow" href="#" onClick={async () => { await authorizeDiscord() }}>
                    CONNECT MY DISCORD ACCOUNT
                </a>
            </div>

        </>
    )

};
const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(ConnectDiscordStep);
