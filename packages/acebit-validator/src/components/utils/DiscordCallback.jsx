import React, { useState, useEffect, createContext } from "react"
import { connectDiscord } from "../../modules/DiscordClient.js";
import { useSearchParams, useNavigate } from "react-router-dom";




function DiscordCallback(props) {
    console.log("DiscordCallback")

    let navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    var _code = searchParams.get("code");

    console.log(_code)


    const fetchUserData = async (code) => {
        // connectDiscord(code)
        await connectDiscord(code);
        navigate("../")
    }


    useEffect(() => {

        if (_code) {
            console.log("code founds")

            fetchUserData(_code);

            //   navigate("./?code" + _code);
            return;
        }


    }, []);


    //   navigate("../?code_" + _code)


    return (
        <div class="validator__content-box">
            <div class="validator__content">
                <div class="validator__congratulations-logo">
                    <img src="./images/validator-logo-congratulations.png" alt="" />
                </div>
                <div class="validator__congratulations-title">
                    LOADING SCREEN
                </div>
            </div>
        </div>
    )

}


export default DiscordCallback;