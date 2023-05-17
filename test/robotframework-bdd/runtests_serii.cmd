if exist %temp%\sae_ui_test ( rmdir /q /s %temp%\sae_ui_test )
mkdir %temp%\sae_ui_test
virtualenv %temp%\sae_ui_test --python=3.8
call %temp%\sae_ui_test\Scripts\activate
pip install -r .\requirement.txt
webdrivermanager chrome
PATH=%PATH%;%temp%/sae_ui_test/Scripts
robot -d result/ -v ResearchLink:'subnational estimation of routine immunization indicators dashboard (SERII)' -v Indicator:'Dpt2' -v Subgroups:'Children' -v Country1:Niger -v Country2:Senegal -v Country3:Rwanda -x test.xml tests/
if errorlevel 1 exit(1)
deactivate
