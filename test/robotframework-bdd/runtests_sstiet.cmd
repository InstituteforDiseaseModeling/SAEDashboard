if exist %temp%\sae_ui_test ( rmdir /q /s %temp%\sae_ui_test )
mkdir %temp%\sae_ui_test
virtualenv %temp%\sae_ui_test --python=3.8
call %temp%\sae_ui_test\Scripts\activate
pip install -r .\requirement.txt
webdrivermanager chrome
PATH=%PATH%;%temp%/sae_ui_test/Scripts
robot -d result/ --exclude exclude-toggle -v ResearchLink:'The subnational sexual transmitted infection estimation tool (SSTIET)' -v Indicator:Discharge -v Subgroups:'Women 25+,Rural' -v Country1:$(shuf countries.txt | head) -v Country2:$(shuf countries.txt | head) -v Country3:Sierra_leone -x test.xml tests/
deactivate
