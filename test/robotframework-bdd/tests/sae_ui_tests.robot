*** Settings ***
Documentation       Test Basic Browsing for SAE Dashboard
Library             SeleniumLibrary
Resource            ../resources.robot
Resource            ../pages/home_pages.robot
Test Setup          Open SAE Page Using Chrome Browser
Test Teardown       Close Browser

*** Variables ***
${ResearchLink}     subnational${SPACE}family${SPACE}planning${SPACE}estimation${SPACE}tool${SPACE}(SFPET)
${Indicator}        Unmet${SPACE}Need
${Subgroups}        Women${SPACE}25+,${SPACE}Urban
${Country1}         Senegal
${Country2}         Malawi
${Country3}         Sierra_leone
${Toggle}           True
*** Test Cases ***
Check Menu
  GIVEN Site Opened
  WHEN Click About
  THEN Page Should Contain  ${ResearchLink}
  THEN Click Dashboard

Check Zoom
    WHEN Change Country   country=${Country1}
    AND Choose ${Indicator} and ${Subgroups}
    THEN Sleep                     2s
    AND Select Map At ( 25 , 25 ) From Interactive Map for ${Indicator}
    THEN Check Selected Africa:${Country1} 1

Switch Country
  GIVEN Site Opened
  WHEN Change Country   country=${Country1}
  THEN Choose ${Indicator} and ${Subgroups}
  THEN Sleep                2s
  THEN Capture Page Screenshot      ${Country1}.png

Click on Map
  GIVEN Site Opened
  THEN Choose ${Indicator} and ${Subgroups}
  AND Sleep                     2s
  THEN Select Map At ( 20 , 20 ) From Interactive Map for ${Indicator} 
  AND Capture Page Screenshot   testdata-1.png
  THEN Scroll Page Down
  AND Capture Page Screenshot   testdata-2.png

Change Theme
  GIVEN Site Opened
  WHEN Change Country   country=${Country2}
  THEN CHOOSE Dark2 AS THEME
  AND Sleep                     2s
  AND Capture Page Screenshot   test_theme.png

Change Legend Max
  GIVEN Site Opened
  WHEN Change Country   country=${Country3}
  ${default_value} =    Get Legend Max
  # Legend max shows 25 by default as 25%
  THEN Should be equal  ${default_value}    27
  THEN CHOOSE 50 AS LEGEND MAX
  AND Sleep                     2s
  AND Capture Page Screenshot   test_legend_max.png

Move Timeline
  GIVEN Site Opened
  WHEN Change Country   country=${Country1}
  THEN SCROLL SLIDER TO -500 PX
  AND Sleep                     2s
  AND Capture Page Screenshot   test_scrolltime.png

Toggle AdminLevel
  [Tags]  exclude-toggle
  GIVEN Site Opened
  WHEN Change Country   country=${Country2}
  # Toggle to Admin 2
  THEN Toggle AdminLevel
  AND Sleep                     2s
  AND Choose ${Indicator} and ${Subgroups}
  AND Sleep                     2s
  AND Select Map At ( 25 , 25 ) From Interactive Map for ${Indicator}
  AND Scroll Page To Location   0   200
  AND Check Selected Africa:${Country2} 2
  AND Capture Page Screenshot   test_admin2.png
  AND Scroll Page To Location   0   0
  # Toggle to Admin 1
  AND Toggle AdminLevel
  AND Sleep                     2s
  AND Select Map At ( 25 , 25 ) From Interactive Map for ${Indicator}
  AND Scroll Page To Location   0   200
  AND Check Selected Africa:${Country2} 1
  AND Capture Page Screenshot   test_admin1.png

*** Keywords ***
Choose ${indicator} and ${subgroups}
    Select Indicator     indicator=${indicator}
    Select Subgroups     subgroups=${subgroups}

Choose ${themes} As Theme
    Select Themes       themes=${themes}

Choose ${legend_max} As Legend Max
    Select Legend_Max   legend_max=${legend_max}