*** Settings ***
Documentation       Test Basic Browsing for SAE Dashboard
Library             SeleniumLibrary
Resource            ../resources.robot
Resource            ../pages/home_pages.robot
Test Setup          Open SAE Page Using Chrome Browser
Test Teardown       Close Browser

*** Variables ***
${ResearchLink}     Family${SPACE}Planning${SPACE}IDM${SPACE}Wiki${SPACE}page
${Indicator}        Unmet${SPACE}Need
${Subgroups}         Women${SPACE}25+,${SPACE}Urban
*** Test Cases ***
Check Menu
  GIVEN Site Opened
  WHEN Click About
  THEN Page Should Contain  Family${SPACE}Planning${SPACE}IDM${SPACE}Wiki${SPACE}page
  THEN Click Dashboard

Switch Country
  GIVEN Site Opened
  WHEN Change Country   country=Senegal
  THEN Choose Unmet${SPACE}Need and Women${SPACE}25+,${SPACE}Urban
  THEN Sleep                2s
  THEN Capture Page Screenshot      senegal.png

Click on Map
  GIVEN Site Opened
  THEN Choose Traditional${SPACE}Method and Women${SPACE}25+,${SPACE}Urban
  AND Sleep                     2s
  THEN Select Map At ( 20 , 20 ) From Interactive Map for Traditional${SPACE}Method
  AND Capture Page Screenshot   testdata-1.png
  THEN Scroll Page Down
  AND Capture Page Screenshot   testdata-2.png

Change Theme
  GIVEN Site Opened
  WHEN Change Country   country=Nigeria
  THEN CHOOSE Dark2 AS THEME
  AND Sleep                     2s
  AND Capture Page Screenshot   test_theme.png

Change Legend Max
  GIVEN Site Opened
  WHEN Change Country   country=Mali
  ${default_value} =    Get Legend Max
  # Legend max shows 25 by default as 25%
  THEN Should be equal  ${default_value}    25
  THEN CHOOSE 50 AS LEGEND MAX
  AND Sleep                     2s
  AND Capture Page Screenshot   test_legend_max.png

Move Timeline
  GIVEN Site Opened
  WHEN Change Country   country=Malawi
  THEN SCROLL SLIDER TO -500 PX
  AND Sleep                     2s
  AND Capture Page Screenshot   test_scrolltime.png

Toggle AdminLevel
  GIVEN Site Opened
  WHEN Change Country   country=Sierra_leone
  # Toggle to Admin 2
  THEN Toggle AdminLevel
  AND Sleep                     2s
  AND Choose Modern${SPACE}Method and All${SPACE}Women
  AND Sleep                     2s
  AND Select Map At ( 25 , 25 ) From Interactive Map for Modern${SPACE}Method
  AND Scroll Page To Location   0   200
  AND Check Selected Africa:Sierra_Leone 2
  AND Capture Page Screenshot   test_admin2.png
  AND Scroll Page To Location   0   0
  # Toggle to Admin 1
  AND Toggle AdminLevel
  AND Sleep                     2s
  AND Select Map At ( 25 , 25 ) From Interactive Map for Modern${SPACE}Method
  AND Scroll Page To Location   0   200
  AND Check Selected Africa:Sierra_Leone 1
  AND Capture Page Screenshot   test_admin1.png

*** Keywords ***
Choose ${indicator} and ${subgroups}
    Select Indicator     indicator=${indicator}
    Select Subgroups     subgroups=${subgroups}

Choose ${themes} As Theme
    Select Themes       themes=${themes}

Choose ${legend_max} As Legend Max
    Select Legend_Max   legend_max=${legend_max}