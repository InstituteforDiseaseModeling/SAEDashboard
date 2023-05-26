*** Settings ***
Library       SeleniumLibrary
Library       OperatingSystem
#Library       ChromeOptions

*** Variables ***

*** Keywords ***

Open SAE Page Using Chrome Browser
  #${options}=    Accept Insecure
  ${windows}=   Set Variable    Windows
  ${system}=    Evaluate    platform.system()    platform
  ${chrome_options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys
  Call Method    ${chrome_options}    add_argument    --ignore-certificate-errors
  Call Method    ${chrome_options}    add_argument    --no-sandbox
  Call Method    ${chrome_options}    add_argument    --disable-dev-shm-usage
  IF    "${system}" != "${windows}"
  Call Method    ${chrome_options}    add_argument    --headless
  ${home_dir} =         Get Environment Variable    USERPROFILE
  ${download_dir} =     Join Path   ${home_dir}/Downloads
  Create Directory  ${download_dir}
  ${prefs} =    Create Dictionary    download.default_directory=${download_dir}
  Call Method    ${chromeOptions}    add_experimental_option    prefs    ${prefs}
  END
  Create Webdriver    Chrome    chrome_options=${chrome_options}
  Go To     %{SAE_SITE}
  #Open Browser   %{SAE_SITE}   Chrome  options=${options}
  Maximize Browser Window

