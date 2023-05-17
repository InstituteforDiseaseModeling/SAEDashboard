from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
import random
import string


def set_chrome_options() -> None:
    """Sets chrome options for Selenium.
    Chrome options for headless browser is enabled.
    """
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument('ignore-certificate-errors')
    chrome_prefs = {}
    chrome_options.experimental_options["prefs"] = chrome_prefs
    chrome_prefs["profile.default_content_settings"] = {"images": 2}
    return chrome_options


def generate_random_name():
    letters = string.ascii_lowercase
    name = (''.join(random.choice(letters) for i in range(10)))
    print(f"saving to {name}.png")
    return f"{name}.png"


if __name__ == "__main__":
    print("test")

    driver = webdriver.Chrome(options=set_chrome_options())
    driver.get("https://sae-dev.20.69.119.9.nip.io/")
    driver.save_screenshot(generate_random_name())
    #driver.find_element_by_xpath("//button/span[text()='I Agree']").click()
    driver.implicitly_wait(10)
    driver.save_screenshot(generate_random_name())
    driver.close()
