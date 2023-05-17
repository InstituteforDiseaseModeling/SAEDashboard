from selenium import webdriver
from robot.api.deco import keyword


@keyword("Accept Insecure")
def accept_insecure():
    options = webdriver.ChromeOptions()
    # options.add_experimental_option("excludeSwitches", ["enable-logging"])
    options.add_argument('ignore-certificate-errors')
    return options


if __name__ == "__main__":
    options = accept_insecure()
    driver = webdriver.Chrome(chrome_options=options)
    driver.get('https://sae-master.20.69.119.9.nip.io/')
    driver.save_screenshot("screenshot.png")
    driver.close()
