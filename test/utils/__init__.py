import json
import os
from functools import wraps

BASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
FIXTURE_PATH = os.path.join(BASE_PATH, 'fixtures')


def load_fixture(url):
    global BASE_PATH
    if url[0] == '/':
        url = url[1:]
    for ext in ['', '.json']:
        p = os.path.join(FIXTURE_PATH, url + ext)
        if os.path.exists(p) and os.path.isfile(p):
            return json.load(open(p, 'r'))
    raise FileNotFoundError('Cannot find file {}'.format(p))


def requires_fixture(url, *args):
    data = load_fixture(url)

    def decorate_test(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if args is None:
                args = (data,)
            else:
                args = list(args)
                args.append(data)
                args = tuple(args)
            return func(*args, **kwargs)
        return wrapper
    return decorate_test
