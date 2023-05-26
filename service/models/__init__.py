import importlib
from os.path import dirname, basename, isfile
import glob
from rse_db.utils import get_declarative_base

# It is best to set your base in the base of your models directory. Here it can be safely loaded by each submodule
Base = get_declarative_base()


modules = glob.glob(dirname(__file__) + "/*.py")
__all__ = [importlib.import_module('{}.{}'.format(__name__, basename(f)[:-3])) for f in modules if isfile(f) and not f.endswith('__init__.py')]
