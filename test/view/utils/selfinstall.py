import sys
import subprocess


def install():
    try:
        from selenium import webdriver
    except:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'selenium'])

    try:
        from webdriver_manager.chrome import ChromeDriverManager
    except:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'webdriver-manager'])

    return True
