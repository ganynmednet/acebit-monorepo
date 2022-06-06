
import React, { useEffect, useState } from 'react';
import { config } from '../../configs/config';
import BouncingDotsLoader from '../utils/BouncingDotsLoader';
import store from '../../store';
import { checkLocalStorage } from '../../modules/DiscordClient'
import { connect } from 'react-redux';

export function ConnectDiscord(props) {
    // var state = store.getState()


    // const authorizeDiscord = async () => {
    //     if (!state.userStates["DISCORD_CONNECTED_PENDING"].completed) {
    //         store.dispatch({ type: "STATES/TOGGLE_STATE", payload: "DISCORD_CONNECTED_PENDING" })
    //         // props.rerendRouter()
    //     }

    //     console.log("TRYING TO FETCH LOCAL DATA")
    //     var _res = await checkLocalStorage()
    //     console.log("LOCAL DATA FETCHED")

    //     if(_res) {
    //         store.dispatch({ type: "STATES/TOGGLE_STATE", payload: "DISCORD_CONNECTED_DONE" })
    //         props.rerendRouter()
    //         return true;
    //     }
    //     window.location.href = config.discordURLs[process.env.NODE_ENV];
    //     return;
    // }

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

        // window.location.href = config.discordURLs[process.env.NODE_ENV];
        return;

    }
    // console.log("ACCESS TOKEN " + this.accessToken)

    if (props.userStates["DISCORD_CONNECTED_PENDING"].completed) {
        return (

            <>
                <div class="validator__content-box">
                    <div class="validator__content">

                        <div class="validator__content-logo">
                            <img src={process.env.PUBLIC_URL + "/images/validator-logo-discord.svg"} alt="" />
                        </div>
                        <div class="validator__content-title">
                            Connect your Discord account {process.platform}
                        </div>
                        <div class="validator__content-description">
                            We need to validate that you have the Whitelist Role in the
                            <a href="#"> NeoWorld Discord Server</a>.
                        </div>
                        <br /><br /><br />
                        <BouncingDotsLoader />
                    </div>
                </div>
            </>
        )

    }

    return (
        <>

            <div class="validator__content-box">
                <div class="validator__content">
                    <div class="validator__content-logo">
                        <img src={process.env.PUBLIC_URL + "/images/validator-logo-discord.svg"} alt="" />
                    </div>
                    <div class="validator__content-title">
                        Connect your Discord account
                    </div>
                    <div class="validator__content-description">
                        We need to validate that you have the Whitelist Role in the
                        <a href="#"> NeoWorld Discord Server</a>.
                    </div>
                    <a class="validator__content-link" href="#" onClick={async () => { await authorizeDiscord() }}>CONNECT My DISCORD ACCOUNT</a>
                </div>
            </div>
        </>
    )
    // }
};
const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(ConnectDiscord);
