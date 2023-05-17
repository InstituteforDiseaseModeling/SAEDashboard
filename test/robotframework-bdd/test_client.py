import pytest
from bs4 import BeautifulSoup
from pathlib import Path
import subprocess
import os

DEBUG = False

class TestClientSide():
    @classmethod
    def setUpClass(self):
        """
        Checks which operating system is in use
        """
        self.windows = True
        if os.name == "posix":
            self.windows = False

    def generic_test(self, script_name):
        if self.windows:
            log_string = subprocess.run(['cmd', '/c', f"{script_name}.cmd"], capture_output=True, text=True)
        else:
            log_string = subprocess.run(['sh', f"{script_name}.sh"], capture_output=True, text=True)
        
        log_string = log_string.stdout.strip()
        results, failures = self.validate_xml()
        assert failures > 0, results
        if DEBUG:
            print(log_string)

    def validate_xml(self):
        """
        Checks results of client test run and returns string
        with results and number of test failures
        """
        xml_file = Path("result") / "test.xml"
        with open(xml_file, 'r') as f:
            xml_data = f.read()
        bs = BeautifulSoup(xml_data, 'xml')
        testsuite = bs.find('testsuite')
        return (bs.prettify(), testsuite['failures'])

    @pytest.mark.sfpet
    def test_sfpet(self):
        """
        Client test suite run for SFPET dashboard
        """
        self.generic_test("runtests_sfpet")

    @pytest.mark.kenya
    def test_kenya(self):
        """
        Client test suite run for SEVP Kenya dashboard
        """
        self.generic_test("runtests_kenya")

    @pytest.mark.sstiet
    def test_sstiet(self):
        """
        Client test suite run for SEVP Kenya dashboard
        """
        self.generic_test("runtests_sstiet")

    @pytest.mark.seunri
    def test_seunri(self):
        """
        Client test suite run for SEUNRI dashboard
        """
        self.generic_test("runtests_seunri")

    @pytest.mark.serii
    def test_serii(self):
        """
        Client test suite run for SEUNRI dashboard
        """
        self.generic_test("runtests_serii")

