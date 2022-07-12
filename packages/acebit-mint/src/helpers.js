import { config } from './configs/config';
import { v4 as uuid } from 'uuid';

export const getUniqueKey = () => {
    return uuid();
}

export const addressShortener = (_address) => {

    const first4 = _address.slice(0, 5);
    const last4 = _address.slice(-5);

    return first4 + "....." + last4
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
