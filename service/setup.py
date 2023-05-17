from setuptools import setup, find_packages
from os import path
here = path.abspath(path.dirname(__file__))

# Get the long description from the README file
with open(path.join(here, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='sae_dashaboard_service',  # Required

    # Versions should comply with PEP 440:
    # https://www.python.org/dev/peps/pep-0440/
    version='1.0.0',  # Required
    description='SAE Dashboard',
    long_description=long_description,
    long_description_content_type='text/markdown',
    url='https://github.com/InstituteforDiseaseModeling/service',
    author='Institute for Disease Modeling - RSE Team',
    author_email='SWResearch@idmod.org',

    # Classifiers help users find your project by categorizing it.
    #
    # For a list of valid classifiers, see https://pypi.org/classifiers/
    classifiers=[  # Optional
        # How mature is this project? Common values are
        #   3 - Alpha
        #   4 - Beta
        #   5 - Production/Stable
        'Development Status :: 4 - Beta',

        # Indicate who your project is intended for
        'Intended Audience :: Developers',

        # Pick your license as you wish
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3.6',
    ],

    keywords='service examples',
    packages=find_packages(exclude=['contrib', 'docs', 'test']),  # Required

    # For an analysis of "install_requires" vs pip's requirements files see:
    # https://packaging.python.org/en/latest/requirements.html
    install_requires=[
        'flask_marshmallow==0.14.0',
        'flask<1.2,>=1.0',
        'marshmallow==2.21.0',
        'psycopg2==2.9.5',
        'rse-api==1.0.9',
        'requests~=2.28.2',
        'numpy~=1.24.1',
        'flask_restful==0.3.9',
        'pandas~=1.5.3',
        'packaging~=23.0'
    ],

    extras_require={
        'documentation': ['sphinx_rtd_theme', 'sphinx'],
        'dev': ['check-manifest', 'nose'],
        'test': ['coverage'],
        'production': ['uwsgi']
    },
    project_urls={
        'Bug Reports': 'https://github.com/InstituteforDiseaseModeling/service/issues',
        'Source': 'https://github.com/InstituteforDiseaseModeling/service',
    }
)
