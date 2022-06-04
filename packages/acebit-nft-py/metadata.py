import base64
import requests


def main():
    _ipfsArray = []
    _ipfsImages = "ipfs://xxxpy"

    for _i in range(1, 5):
        _hex = hex(_i)
        _paddedHex = "0000000000000000000000000000000000000000000000000000000000000000{}".format(_hex[2:])
        _paddedHex = _paddedHex[-64:]
        print(_paddedHex)

        _meta = {
            "path": "metadata/{}.json".format(_paddedHex),
            "content": {
                "image": "{}/images/{}.jpg".format(_ipfsImages, _paddedHex),
                "name": "Ace NFT #{}".format(_i),
                "description": "Ace NFT Collection",
                "properties": {
                    "name": "Ace SUITE",
                    "suite": "SUITE"
                }
            }
            
        
        }


        _ipfsArray.append(_meta )

    # print(_ipfsArray)

    headers = {
        "X-API-KEY": 'jhm4AZUaFMTlqcD5eHT2tuyY06pspE6Pu7S9eLo74XyQsPrmEhEP3ZQNrGKD8psh',
        "Content-Type": "application/json",
        "accept": "application/json"
    }
    URI = "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder"

    # for _file in _ipfs_array:
    _res = requests.post(URI, headers=headers, json=_ipfsArray)
    print(_res.content)


if __name__ == '__main__':
    main()
