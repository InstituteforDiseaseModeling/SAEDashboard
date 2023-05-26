import logging
import os
import nose

if __name__ == '__main__':
    dir_path = os.path.dirname(os.path.realpath(__file__))
    logger = logging.getLogger(__name__)
    nose.main()
