import base64
import requests
from suite_distributor import SuiteDistributor


def main():
    _ipfs_array = []
    suiteDistributor = SuiteDistributor()

    for _i in range(1, 5):
        _suite = suiteDistributor.getSuite()

        # _hex = hex(_i)
        # _paddedHex = "0000000000000000000000000000000000000000000000000000000000000000{}".format(_hex[2:])
        # _paddedHex = _paddedHex[-64:]
        # print(_paddedHex)

        # "ISO-8859-1"
        #  UTF-8
        # with open('./assets/{}.jpg'.format(_paddedHex), "rb") as _file:
        #     _base64_str = base64.b64encode(_file.read())
        #     _img = {
        #         "path": "images/{}.jgp".format(_paddedHex),
        #         "content": _base64_str.decode('UTF-8')
        #     }

        with open('./assets/{}.png'.format(_suite), "rb") as _file:
            _base64_str = base64.b64encode(_file.read())
            _img = {
                "path": "images/{}.png".format(_suite),
                "content": _base64_str.decode('UTF-8')
            }

        _ipfs_array.append(_img)

    headers = {
        "X-API-KEY": 'jhm4AZUaFMTlqcD5eHT2tuyY06pspE6Pu7S9eLo74XyQsPrmEhEP3ZQNrGKD8psh',
        "Content-Type": "application/json",
        "accept": "application/json"
    }
    URI = "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder"

    # for _file in _ipfs_array:
    _res = requests.post(URI, headers=headers, json=_ipfs_array)
    print(_res.content)


if __name__ == '__main__':
    main()
