
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

3. Change to the new virtual environment directory: `cd venv`

4. Create a new file named 'pip.conf' on UNIX or 'pip.ini' on Windows.

5. Edit the created file and add the following lines:
```ini
[global]
index-url = https://packages.idmod.org/api/pypi/pypi-production/simple
```

6. Saved the file.

>Alternatively you can add `--index-url=https://packages.idmod.org/api/pypi/pypi-production/simple` to your pip install statements


7. Install the required dependencies:
```
cd service
pip install -r requirements_dev.txt --use-deprecated=legacy-resolver
```

7. Install the package:
```bash
pip install -e . --use-deprecated=legacy-resolver
```

8. Set the following environment variables:
- `FLASK_ENV=development`
- `PYTHONPATH=%PYTHONPATH%;C:\Your\Project\Root`

>For production build, please change value of FLASK_ENV to 'production'

#### Service Start
1. Open a terminal and navigate to the root of the repository.
2. Change directory to 'service': cd service
3. Run the application: `python app.py manage run`

