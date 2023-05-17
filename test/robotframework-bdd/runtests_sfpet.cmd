if exist %temp%\sae_ui_test ( rmdir /q /s %temp%\sae_ui_test )
mkdir %temp%\sae_ui_test
virtualenv %temp%\sae_ui_test --python=3.8
call %temp%\sae_ui_test\Scripts\activate
pip install -r .\requirement.txt
webdrivermanager chrome
PATH=%PATH%;%temp%/sae_ui_test/Scripts
robot -d result/ -v ResearchLink:'subnational family planning estimation tool (SFPET)' -v Indicator:'Modern Method' -v Subgroups:'Women 25+' -v Country1:Niger -v Country2:Tanzania -v Country3:Togo -x test.xml tests/
deactivate