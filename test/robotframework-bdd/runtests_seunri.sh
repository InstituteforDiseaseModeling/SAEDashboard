if [ -d "/tmp/sae_ui_test" ]; then rm -rf "/tmp/sae_ui_test"; fi
mkdir -p /tmp/sae_ui_test
python3 -m venv /tmp/sae_ui_test
source /tmp/sae_ui_test/bin/activate
pip install -r requirement.txt
webdrivermanager chrome
export PATH="$PATH:/tmp/sae_ui_test/bin"
robot -d result/ -v ResearchLink:'subnational estimation of unmet need and routine immunization dashboard (SEUNRI)' -v Indicator:'Unmet need for limiting' -v Subgroups:'Rural' -v Country1:Niger -v Country2:Tanzania -v Country3:Togo -x test.xml tests/
deactivate