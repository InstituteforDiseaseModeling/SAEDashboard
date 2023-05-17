import os
TRUE_OPTIONS = ["true", "1", "y", "yes", "on"]
DEV_ENVIRONMENTS = ['dev', 'development', 'test', 'testing', 'documentation', 'doc']

# make sure DEBUG is off unless enabled explicitly otherwise
DEBUG = os.environ.get("DEBUG", "False").lower() in TRUE_OPTIONS or os.environ.get("FLASK_ENV", "production") in DEV_ENVIRONMENTS
LOG_DIR = '.'  # create log files in current working directory

# These are all DB related settings
current_dir = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(current_dir, 'data')
DATA_DIR = os.path.join(DATA_DIR, 'latest', 'data') if os.getenv('SAE_AKS') else DATA_DIR
