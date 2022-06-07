import React, { useEffect } from 'react';
import { fetcher, sortRoles, urlencodeSerializer } from '../helpers';
import { config } from "../configs/config"
// import { connect } from 'react-redux'
// import { updateUserData, updateAccessToken } from "../store/actions"
import store from "../store"

require('dotenv').config();

// const DiscordOauth2 = require("discord-oauth2");

let _res;

export const checkLocalStorage = async () => {
  console.log("checkLocalStorage >>>")
  let accessToken;

  var localData = localStorage.getItem("nw_discord_token")
  // console.log("checkLocalStorage: ??? >>>")
  // console.log(localData)

  if (!localData) {
    console.log("checkLocalStorage: returning false >>>")
    return false
  }

  const dataValue = JSON.parse(localData);
  var currentTime = new Date().getTime()
  console.log("checkLocalStorage: comparing time >>>")
  console.log((dataValue.setAt + dataValue.expires_in * 1000))
  console.log(currentTime)

  if (currentTime > (dataValue.setAt + dataValue.expires_in * 1000)) {
    // store.dispatch({ type: "USERDATA/UPDATE_ACCESS_TOKEN", payload: _res.access_token })
    var resultRefresh = await refreshToken(dataValue.refresh_token)

    if (!resultRefresh.access_token) {
      console.log("UNABLE TO FETCH REFRESH TOKEN")
      return false;
    }

    var dataToStore = {
      ...resultRefresh,
      setAt: new Date().getTime()
    }
    localStorage.setItem("nw_discord_token", JSON.stringify(dataToStore))

    // store.dispatch({ type: "USERDATA/UPDATE_ACCESS_TOKEN", payload: result.access_token })
    // return resultRefresh;
    accessToken = resultRefresh.access_token

  } else {

    accessToken = dataValue.access_token;

  }

  store.dispatch({ type: "USERDATA/UPDATE_ACCESS_TOKEN", payload: accessToken })
  // return localData.access_token

  var _dataRes = await fetchFullUserData()
  if (!_dataRes) {
    // store.dispatch({ type: "STATES/TOGGLE_STATE", payload: "DISCORD_CONNECTED_DONE" })
    return false;
  }


  return true

}

const fetchAccessToken = async (code) => {

  const details = {
    'client_id': process.env.REACT_APP_CLIENT_ID,
    'client_secret': process.env.REACT_APP_CLIENT_SECRET,
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': config.directionURLs[process.env.NODE_ENV]
  }
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Credentials': 'true'
    },
    body: urlencodeSerializer(details)
  };
  // console.log(requestOptions)
  const result = await fetcher('https://discord.com/api/v8/oauth2/token', requestOptions);
  console.log(result)

  if (result.access_token) {
    // store.dispatch({ type: "UPDATE_ACCESS_TOKEN", payload: result.access_token })
    var dataToStore = {
      ...result,
      setAt: new Date().getTime()
    }
    localStorage.setItem("nw_discord_token", JSON.stringify(dataToStore))
    return result;
  }

  return false;
}

const getUser = async () => {
  // https://stackoverflow.com/questions/54045938/how-to-get-user-id-from-oauth-on-discord

  const state = store.getState()

  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${state.discordAccessToken}`
    }
  };

  console.log(requestOptions)
  const _user = await fetcher("https://discord.com/api/users/@me", requestOptions)

  if (!_user) {
    return false;
  }

  console.log(_user)
  return _user;
}

export const getUserRoles = async () => {
  const state = store.getState()
  const _url = `https://discordapp.com/api/users/@me/guilds/${config.discordServer}/member`

  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${state.discordAccessToken}`
    }
  };

  const _res = await fetcher(_url, requestOptions);
  console.log(_res);
  return _res.roles
}

export const refreshToken = async (refreshToken) => {
  console.log("getRefreshToken >>")
  const state = store.getState()

  const details = {
    'client_id': process.env.REACT_APP_CLIENT_ID,
    'client_secret': process.env.REACT_APP_CLIENT_SECRET,
    'grant_type': 'refresh_token',
    'refresh_token': refreshToken,
  }
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Credentials': 'true'
    },
    body: urlencodeSerializer(details)
  };

  console.log(requestOptions)
  const result = await fetcher('https://discord.com/api/v8/oauth2/token', requestOptions);
  console.log(result)
  if (result.access_token) {
    return result;
  }
  // const _res = await fetcher(_url, requestOptions);
  return false
}


export const getDiscordAvatart = async (_id, _img) => {
  const _url = `https://cdn.discordapp.com/avatars/${_id}/${_img}.webp?size=100`

  const res = await fetch(_url);
  const imageBlob = await res.blob({ type: 'image/png' });
  const imageObjectURL = URL.createObjectURL(imageBlob);
  console.log(imageObjectURL);
  console.log(_url);
  return _url;
}

// export function connectDiscord(code) {
//   console.log("CONNECT DISCORD >>>");
//   console.log(code)
//   // console.log(updateUserData)

//   createUser()
export const connectDiscord = async (code) => {

  console.log("CONNECT DISCORD >>>");
  console.log(code)

  // fetching access token
  _res = await fetchAccessToken(code);
  if (!_res) {
    console.log("error getting TOKEN");
    return false;
  }

  store.dispatch({ type: "USERDATA/UPDATE_ACCESS_TOKEN", payload: _res.access_token })

  var _dataRes = await fetchFullUserData()
  if (_dataRes) {
    store.dispatch({ type: "STATES/TOGGLE_STATE", payload: "DISCORD_CONNECTED_DONE" })
    return true;
  }

  return false;
}

const fetchFullUserData = async () => {

  var _userData = await getUser();
  if (!_userData) {
    console.log("error getting USER DATA");
    return false;
  }

  // fetch user Roles
  var _userRoles = await getUserRoles();
  console.log("USER ROLES FETCHED >>");
  console.log(_userRoles)
  _userData["roles"] = sortRoles(_userRoles);

  if (!_userRoles) {
    console.log("error getting USER DATA");
    return false;
  }

  // set user data and toggle state
  store.dispatch({ type: "USERDATA/UPDATE_USER_DATA", payload: _userData })
  // store.dispatch( {type: "STATES/TOGGLE_STATE", payload: "DISCORD_DONE"})

  return true;

}