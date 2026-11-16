# DATA Setup

## Linux:
1. Open a terminal and navigate to the root of the repository.
2. Change directory to 'service': cd service
3. Make the 'downloadGeoJson.sh' script executable: chmod a+x ./helpers/downloadGeoJson.sh
4. Run the 'downloadGeoJson.sh' script: ./helpers/downloadGeoJson.sh

## Windows:
Open a terminal and navigate to the root of the repository.
Change directory to 'service': cd service
Run the 'downloadGeoJson.cmd' script: ./helpers/downloadGeoJson.cmd

## Old format data migration
To migrate csv data from the old format to the new format use the script located in `helpers/indicator_data_converter.py`
Usage instructions are in the script header.


# Running the Service

## Development Environment Setup
1. Install Python 3.13 or above https://www.python.org/downloads
2. Open a terminal and navigate to the root of the repository (e.g., where the `service/` folder lives).
3. Create a new virtual environment named 'venv': `python -m venv venv`
4. Activate the virtual environment by running the following command in linux: `source venv/bin/activate`. In windows, the command is `venv\Scripts\activate`
5. Install the required dependencies:
```
cd service
pip install -r requirements.txt
```
6. Install the package:
```
pip install -e .
```

7. Set the following environment variable:
   - on Windows (Powershell):
        ```bash 
        $env:PYTHONPATH="C:\Your\Project\Root"
        $env:ENV="development"
        ```
   - on macOS/Linux:
     ```bash 
     export PYTHONPATH=$PYTHONPATH:$(pwd)
     export ENV=development
     ```

    For production build, please change value of ENV to 'production'

## Starting the Service
1. From a terminal, navigate to the root of the repository, then to the service directory: `cd service`
2. Run the application: `python app.py`  
   (or uvicorn service.app:app --host 0.0.0.0 --port 5000)  

