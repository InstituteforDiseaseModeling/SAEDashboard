# Dashboard UI Tests:
import unittest
from sys import platform
from test.view.Page.Actions import check_if_exists, click_policy_consent, hold, click_menu, click_menu_about, wait, \
    click_on_country_dropbox, click_on_country_option
from test.view.Page.Countries import countries
from test.view.Page.Elements import LINK_PRIVACY, POLICY_CONSENT, HEADER_TITLE, LINK_FOOT_BMCGH, LINK_FOOT_GATES, \
    LINK_FP_WIKIPAGE, LINK_FRAMEWORK, LINK_SURVEY, LINK_GITHUB
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from test.view.utils.read import url


class SAEDashboard(unittest.TestCase):

    def test_Review_Privacy_And_Cookies_Notice(self):
        d = self.driver
        self.assertTrue(check_if_exists(d, LINK_PRIVACY))
        self.assertTrue(check_if_exists(d, POLICY_CONSENT))
        self.assertIn('SAE', d.title, "<- Page Title")
        click_policy_consent(d)
        hold()

    def test_check_header_and_footer(self):
        d = self.driver
        click_policy_consent(d)
        click_menu(d)
        hold()
        self.assertTrue(check_if_exists(d, HEADER_TITLE))
        self.assertTrue(check_if_exists(d, LINK_FOOT_BMCGH))
        self.assertTrue(check_if_exists(d, LINK_FOOT_GATES))
        hold()

    def test_verify_about_page(self):
        d = self.driver
        click_policy_consent(d)
        click_menu(d)
        click_menu_about(d)
        source = d.page_source
        self.assertTrue("SFPET" in source)
        self.assertTrue("jproctor@idmod.org" in source)
        self.assertTrue("Research links" in source)
        self.assertTrue(check_if_exists(d, LINK_FP_WIKIPAGE))
        self.assertTrue(check_if_exists(d, LINK_FRAMEWORK))
        self.assertTrue(check_if_exists(d, LINK_SURVEY))
        self.assertTrue(check_if_exists(d, LINK_GITHUB))
        self.assertTrue(check_if_exists(d, LINK_FOOT_BMCGH))
        self.assertTrue(check_if_exists(d, LINK_FOOT_GATES))
        wait()

    def test_select_each_existent_country(self):
        d = self.driver
        click_policy_consent(d)
        hold()
        for country in countries:
            c = country["text"]
            print("\nTesting:", c)
            click_on_country_dropbox(d)
            hold()
            click_on_country_option(d, c)

    def setUp(self):
        op = webdriver.ChromeOptions()
        op.add_argument('--ignore-certificate-errors')
        op.add_argument("--test-type")
        op.add_argument("--incognito")

        if platform == "linux" or platform == "linux2":
            op.add_argument('--no-sandbox')
            op.add_argument('--disable-dev-shm-usage')
            op.add_argument('--headless')
        elif platform == "win32":
            print('Placeholder: Running on Windows')

        self.driver = webdriver.Chrome(ChromeDriverManager().install(), options=op)
        self.driver.get(url())
        print("SETUP: Page loaded...")

    def tearDown(self):
        print("Test tearDown")
        self.driver.quit()
        print("TEARDOWN: Test finished...")


if __name__ == '__main__':
    unittest.main(verbosity=2)
