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
        // var _res = await ConnectDiscord(code);
        // if (_res) {
        //   setUserData(UserProfile.getData());
        // }

        navigate("../")
    }
    

    useEffect(() => {

        if (_code) {
          console.log("code founds")
          
          fetchUserData(_code);
          
        //   navigate("./?code" + _code);
          return;
        }
        
        // navigate("../")

      }, []);

      
      navigate("../?code_" + _code)
    

    // if (_code) {
    //     // setUserState(1);

    //     fetchUserData(_code);
    //     navigate("./?code" + _code);
    // }
    // console.log("navigate")
    // navigate("../index.html")

}


export default DiscordCallback;