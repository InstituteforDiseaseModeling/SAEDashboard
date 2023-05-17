if [ -d "/tmp/sae_ui_test" ]; then rm -rf "/tmp/sae_ui_test"; fi
mkdir -p /tmp/sae_ui_test
python3 -m venv /tmp/sae_ui_test
source /tmp/sae_ui_test/bin/activate
pip install -r requirement.txt
webdrivermanager chrome
export PATH="$PATH:/tmp/sae_ui_test/bin"
robot -d result/ -v ResearchLink:'subnational estimation of routine immunization indicators dashboard (SERII)' -v Indicator:'Dpt2' -v Subgroups:'Children' -v Country1:Niger -v Country2:Senegal -v Country3:Rwanda -x test.xml tests/
deactivate