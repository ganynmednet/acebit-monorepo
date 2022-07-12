import { config } from './configs/config';
import { v4 as uuid } from 'uuid';
import Davatar from '@davatar/react';

export const getUniqueKey = () => {
  return uuid();
}

export const urlencodeSerializer = (details) => {
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return formBody;
}

export const sortRoles = (userRoles) => {
  // https://stackoverflow.com/questions/12433604/how-can-i-find-matching-values-in-two-arrays
  // https://replit.com/languages/nodejs

  // var _supportedRoles = ['1', '2', '3'];
  // var roles = ['1', '2', '3', '5', '6'];

  // var filteredKeywords = fullWordList.filter((word) => wordsToRemove.includes(word));

  var _supportedRoles = Object.keys(config.supportedRoles);
  var _validRoles = _supportedRoles.filter((e) => userRoles.includes(e));

  return _validRoles
}

export const fetcher = async (URL, requestOptions) => {
  // https://stackoverflow.com/questions/43462367/how-to-overcome-the-cors-issue-in-reactjs

  var _url = URL

  if (process.env.NODE_ENV == "development") {
    var _url = "https://cors-anywhere.herokuapp.com/" + URL
  }


  var _res = await fetch(_url, requestOptions)
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => { throw new Error(text) })
      }
      else {
        return res.json();
      }
    })
    .catch(err => {
      console.log('caught it!', err);
      return false
    })

  if (!_res) {
    return false
  }

  return _res
}


export const addressShortener = (_address) => {

  const first4 = _address.slice(0, 5);
  const last4 = _address.slice(-5);

  return first4 + "....." + last4
}


export const getDefaultAvatar = (_address) => {
  // https://github.com/nounsDAO/nouns-monorepo/blob/master/packages/nouns-webapp/src/components/ShortAddress/index.tsx
  // https://www.npmjs.com/package/@davatar/react
  // console.log(_address)

  if (process.env.NODE_ENV == "development") {
    return;
  }

  return <Davatar size={24} address={_address} generatedAvatarType='jazzicon' />
}

export const verifyCaptchaAPI = async (token, ekey) => {
  // https://docs.hcaptcha.com/

  console.log(token, ekey)

  const details = {
    'secret': config.hCaptcha.secret,
    'response': token,
  }

  // 'Access-Control-Allow-Origin': '*',
  // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  // 'Access-Control-Allow-Headers': 'Authorization',
  // 'Access-Control-Allow-Credentials': 'true'
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: urlencodeSerializer(details)
  };

  console.log(requestOptions)
  const result = await fetcher('https://hcaptcha.com/siteverify', requestOptions);

  if (result["success"]) {
    return true
  }
  return false
}


export const validUsername = new RegExp('^[ A-Za-z0-9_@./#&+-S]*$');