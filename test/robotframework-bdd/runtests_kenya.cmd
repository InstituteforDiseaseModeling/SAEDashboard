if exist %temp%\sae_ui_test ( rmdir /q /s %temp%\sae_ui_test )
mkdir %temp%\sae_ui_test
virtualenv %temp%\sae_ui_test --python=3.8
call %temp%\sae_ui_test\Scripts\activate
pip install -r .\requirement.txt
webdrivermanager chrome
PATH=%PATH%;%temp%/sae_ui_test/Scripts
robot -d result/ -v ResearchLink:'subnational estimation of vulnerable population in Kenya Dashboard (SEVPKenya)' -v Indicator:Rfk4 -v Subgroups:'All Women' -v Country1:Kenya -v Country2:Kenya -v Country3:Kenya -x test.xml tests/
if errorlevel 1 exit(1)
deactivate
