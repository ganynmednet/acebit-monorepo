let fs = require("fs");
let axios = require("axios");

let ipfsArray = [];
let promises = [];
let totalAces = 10;

// total aces
// total each suite
//

for (let i = 1; i < 5; i++) {
    let paddedHex = ("0000000000000000000000000000000000000000000000000000000000000000" + i.toString(16)).substr("-64");
    console.log(paddedHex)
    promises.push(new Promise( (res, rej) => {
        fs.readFile(`${__dirname}/../assets/${paddedHex}.jpg`, (err, data) => {
            if(err) rej();
            ipfsArray.push({
                path: `images/${paddedHex}.png`,
                content: data.toString("base64")
            })
            res();
        })
    }))
    // console.log(promises)
}
Promise.all(promises).then( () => {
    axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
        ipfsArray,
        {
            headers: {
                "X-API-KEY": 'jhm4AZUaFMTlqcD5eHT2tuyY06pspE6Pu7S9eLo74XyQsPrmEhEP3ZQNrGKD8psh',
                "Content-Type": "application/json",
                "accept": "application/json"
            }
        }
    ).then( (res) => {
        console.log(res.data);
    })
    .catch ( (error) => {
        console.log(error)
    })
})