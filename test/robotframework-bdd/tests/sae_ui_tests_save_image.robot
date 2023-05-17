*** Settings ***
Documentation       Test Image Save for SAE Dashboard
Library             SeleniumLibrary
#Library             DataDriver  file=image_types.csv
Resource            ../resources.robot
Resource            ../pages/home_pages.robot
Test Setup          Open SAE Page Using Chrome Browser
Test Teardown       Close Browser
# Test Template       Save Left Images

*** Variables ***
@{formats} =    SVG     PNG     JPG     PDF
*** Test Cases ***
Save Images
  Site Opened
  Sleep             5s
  FOR    ${var}    IN    @{formats}
    Save Left Image Format=${var}
  END

*** Keywords ***
#Save Left Images
#    [Arguments]     ${image_format}
#    Site Opened
#    Sleep             5s
#    Save Left Image Format=${image_format}
