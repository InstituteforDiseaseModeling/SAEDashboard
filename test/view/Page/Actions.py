import time
from selenium.common.exceptions import NoSuchElementException
from test.view.Page.Elements import SLIDER, ABOUT, COUNTRY_SELECT, POLICY_CONSENT, MENU, DASHBOARD


def click_policy_consent(_driver_):
    click(_driver_, POLICY_CONSENT)


def click_menu(_driver_):
    click(_driver_, MENU)


def click_menu_dashboard(_driver_):
    click(_driver_, DASHBOARD)


def click_menu_about(_driver_):
    click(_driver_, ABOUT)


def click_slider(_driver_):
    click(_driver_, SLIDER)


def click_on_country_dropbox(_driver_):
    click(_driver_, COUNTRY_SELECT)


def click_on_country_option(_driver_, country_name):
    click_with_text(_driver_, country_name)


def check_if_exists(_driver_, element):
    try:
        print("TEST: Verify if element", element, "exists...")
        _driver_.find_element_by_xpath(element)
        print("√ Ok")
    except NoSuchElementException:
        return False
    return True


def click_with_text(_driver_, text):
    click(_driver_, "//ul/li[contains(text(),'" + text + "')][@role='option']")


def click(_driver_, element):
    print("STEP: Click on", element)
    _driver_.find_element_by_xpath(element).click()


def hold():
    time.sleep(2)


def wait():
    time.sleep(4)

# TEMPLATES:
# LINK_ = "//a[@href=' ']"
