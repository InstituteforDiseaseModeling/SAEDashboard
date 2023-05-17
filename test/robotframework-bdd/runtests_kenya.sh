if [ -d "/tmp/sae_ui_test" ]; then rm -rf "/tmp/sae_ui_test"; fi
mkdir -p /tmp/sae_ui_test
python3 -m venv /tmp/sae_ui_test
source /tmp/sae_ui_test/bin/activate
pip install -r requirement.txt
webdrivermanager chrome
export PATH="$PATH:/tmp/sae_ui_test/bin"
robot -d result/ -v ResearchLink:'subnational estimation of vulnerable population in Kenya Dashboard (SEVPKenya)' -v Indicator:Rfk4 -v Subgroups:'All Women' -v Country1:Kenya -v Country2:Kenya -v Country3:Kenya -x test.xml tests/
deactivate