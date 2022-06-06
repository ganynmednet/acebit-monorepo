import os
import yaml


def get_config():
    # fetching config
    with open("{}/config.yml".format(os.path.dirname(os.path.realpath(__file__))), 'r') as stream:
        _config = yaml.safe_load(stream)
    return _config
