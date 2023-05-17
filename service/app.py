import os
from rse_api import get_application
from rse_api.utils import dynamic_import_all

APP_NAME = 'service'
SETTING_OBJECT = 'service.default_settings'

dir_path = os.path.dirname(os.path.realpath(__file__))

# Initialize our Flask application. We provide the path to our default settings object
# If you do not need dramtiq, use the following instead
# application = get_application(SETTING_OBJECT, setup_broker_func=None)
application = get_application(SETTING_OBJECT)


# setup controllers
dynamic_import_all('service.controllers')
# setup tasks
# dynamic_import_all('service.tasks')

# Run the cli and let the parameters determine what we
# To run, run python app.py manage run
# or to setup db run
# python app.py db create
if __name__ == "__main__":
    application.cli()
