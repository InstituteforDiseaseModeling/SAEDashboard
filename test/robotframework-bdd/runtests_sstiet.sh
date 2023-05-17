if [ -d "/tmp/sae_ui_test" ]; then rm -rf "/tmp/sae_ui_test"; fi
mkdir -p /tmp/sae_ui_test
python3 -m venv /tmp/sae_ui_test
source /tmp/sae_ui_test/bin/activate
pip install -r requirement.txt
webdrivermanager chrome
export PATH="$PATH:/tmp/sae_ui_test/bin"
robot -d result/ --exclude exclude-toggle -v ResearchLink:'The subnational sexual transmitted infection estimation tool (SSTIET)' -v Indicator:Discharge -v Subgroups:'Women 25+,Rural' -v Country1:$(shuf countries.txt | head) -v Country2:$(shuf countries.txt | head) -v Country3:Sierra_leone -x test.xml tests/
deactivate