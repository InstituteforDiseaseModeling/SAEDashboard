import os
from urllib.parse import urlparse


# Return testing url
def url():
    _url = "https://sae-dev.20.69.119.9.nip.io/"
    try:
        print("Looking for an override")
        temp = os.environ['URL']
        if is_url(temp):
            _url = os.environ['URL']
    except:
        print('No url override found; Testing against dev site:', _url)

    print("Now testing...... ", _url)
    return _url


def is_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False
