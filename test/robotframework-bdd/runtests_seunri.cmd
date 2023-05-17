if exist %temp%\sae_ui_test ( rmdir /q /s %temp%\sae_ui_test )
mkdir %temp%\sae_ui_test
virtualenv %temp%\sae_ui_test --python=3.8
call %temp%\sae_ui_test\Scripts\activate
pip install -r .\requirement.txt
webdrivermanager chrome
PATH=%PATH%;%temp%/sae_ui_test/Scripts
robot -d result/ -v ResearchLink:'subnational estimation of unmet need and routine immunization dashboard (SEUNRI)' -v Indicator:'Unmet need for limiting' -v Subgroups:'Rural' -v Country1:Niger -v Country2:Tanzania -v Country3:Togo -x test.xml tests/
if errorlevel 1 exit(1)
deactivate
