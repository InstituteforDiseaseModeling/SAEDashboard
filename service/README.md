
### DATA Setup

#### Linux:
1. Open a terminal and navigate to the root of the repository.
2. Change directory to 'service': cd service
3. Make the 'downloadGeoJson.sh' script executable: chmod a+x ./helpers/downloadGeoJson.sh
4. Run the 'downloadGeoJson.sh' script: ./helpers/downloadGeoJson.sh

#### Windows:
Open a terminal and navigate to the root of the repository.
Change directory to 'service': cd service
Run the 'downloadGeoJson.cmd' script: ./helpers/downloadGeoJson.cmd

### Development Environment Setup
1. Open a terminal and navigate to the root of the repository.

2. Create a new virtual environment named 'venv': `python -m venv venv`

3. Activate the virtual environment by running the following command in linux `source venv/bin/activate`. 
In windows, the command is `venv\Scripts\activate`

4. Install the required dependencies:
```
cd service
pip install -r requirements_dev.txt
```

5. Install the package:
```
pip install -e .
```

8. Set the following environment variables:
- `FLASK_ENV=development`
- `PYTHONPATH=%PYTHONPATH%;C:\Your\Project\Root`

>For production build, please change value of FLASK_ENV to 'production'

#### Service Start
1. Open a terminal and navigate to the root of the repository.
2. Change directory to 'service': cd service
3. Run the application: `python app.py manage run`

