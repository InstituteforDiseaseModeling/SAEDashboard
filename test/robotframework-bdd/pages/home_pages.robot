*** Settings ***
Library     SeleniumLibrary
Library     String

*** Variables ***
${POLICY_CONSENT}       //button/span[text()='I Agree']
${POLICY_COOKIES}       PrivacyPolicy
${MENU}                 //button[@aria-label='menu']
${ABOUT}                //li/p[text()='About']
${DASHBOARD}            //li/p[text()='Dashboard']
${TIMEOUT}              60
${SLIDER}               //input[@type='range']
${COUNTRY_SELECT}       //div[@id='country-select']
${INDICATORS_SELECT}    //label[text()='Indicators']/following-sibling::div
${SUBGROUPS_SELECT}     //label[text()='Subgroups']/following-sibling::div
${THEMES_SELECT}        //label[text()='Themes']/following-sibling::div
${LEGEND_MAX_SELECT}    //label[text()='Legend Max']/following-sibling::div/input
${MAINMAP_LABEL}        //div/h6[text()='Main Map']
${INTERACTIVE_MAP}      //*[name()='svg' and @role='group'][1]
${LEFT_DOWNLOAD_LINKS}  //a[text()='...'][1]
${IMAGE_LINK}           //a[text()='Image']
${ADMINLEVEL_TOGGLE}    //span[@class='MuiSwitch-root']


*** Keywords ***
Site Opened
  Delete Cookie                     ${POLICY_COOKIES}
  Wait Until Element Is Visible     ${TITLE}    ${TIMEOUT}
  Element Should Be Visible         ${TITLE}
  Wait Until Element Is Visible     ${COUNTRY_SELECT}    ${TIMEOUT}
  Wait Until Element Is Enabled     ${COUNTRY_SELECT}    ${TIMEOUT}
  Element Should Be Visible         ${COUNTRY_SELECT}
  Element Should Be Enabled         ${COUNTRY_SELECT}

Click Menu
  Click Element                     ${MENU}

Click About
  Click Menu
  Click Element                     ${ABOUT}
  Sleep             2s

Click Dashboard
  Click Menu
  Click Element                     ${DASHBOARD}
  Page Should Contain Element       ${SLIDER}

Change Country
  [Arguments]   ${country}
  Click Element     ${COUNTRY_SELECT}
  Sleep             2s
  Wait Until Element Is Visible         //ul/li[contains(text(),'${country}')][@role='option']      ${TIMEOUT}
  ${element} =      Get WebElement      //ul/li[contains(text(),'${country}')][@role='option']
  Double Click Element     ${element}

Select Indicator
  [Arguments]   ${indicator}
  Wait Until Element Is Visible     ${INDICATORS_SELECT}
  Click Element     ${INDICATORS_SELECT}
  Sleep             2s
  ${elements} =      Get WebElements  //ul/li[contains(text(),'${indicator}')][@role='option']
  Double Click Element     ${elements}[0]

Select Subgroups
  [Arguments]   ${subgroups}
  Wait Until Element Is Visible     ${SUBGROUPS_SELECT}
  Click Element     ${SUBGROUPS_SELECT}
  Sleep             2s
  ${element} =      Get WebElement  //ul/li[contains(text(),'${subgroups}')][@role='option']
  Double Click Element     ${element}

Select Themes
  [Arguments]   ${themes}
  Wait Until Element Is Visible     ${THEMES_SELECT}
  Click Element     ${THEMES_SELECT}
  Sleep             2s
  ${elements} =      Get WebElements  //ul/li[contains(text(),'${themes}')][@role='option']
  Double Click Element     ${elements}[0]

Select Legend_Max
  [Arguments]   ${legend_max}
  Wait Until Element Is Visible     ${LEGEND_MAX_SELECT}
  Click Element     ${LEGEND_MAX_SELECT}
  Sleep             2s
  Press Keys        ${LEGEND_MAX_SELECT}    CONTROL+A+BACKSPACE
  Input Text        ${LEGEND_MAX_SELECT}    ${legend_max}   True
  # workaround click other places for legend max to change
  Click Element     //h6[text()='Main Map']

Get Legend Max
  Wait Until Element Is Visible     ${LEGEND_MAX_SELECT}
  ${str_value} =       Get Value       ${LEGEND_MAX_SELECT}
  [return]  ${str_value}

Save Left Image Format=${format}
  ${elem} =     Get WebElement      ${LEFT_DOWNLOAD_LINKS}
  Wait Until Element Is Visible     ${elem}
  Wait Until Element Is Enabled     ${elem}
  Mouse Over    ${elem}
  Wait Until Element Is Visible     ${IMAGE_LINK}
  Wait Until Element Is Enabled     ${IMAGE_LINK}
  ${img_elem} =     Get WebElement      ${IMAGE_LINK}
  Mouse Over    ${img_elem}
  Wait Until Element Is Visible     //a[text()='${format}']
  Wait Until Element Is Enabled     //a[text()='${format}']
  Click Element                     //a[text()='${format}']
  Sleep             5s
  ${home_dir} =         Get Environment Variable    USERPROFILE
  ${download_dir} =     Join Path   ${home_dir}/Downloads
  File Should Exist     ${download_dir}/amCharts.${format}
  ${file_size} =        Get File Size   ${download_dir}/amCharts.${format}
  Should be True        ${file_size}>0
  Remove File           ${download_dir}/amCharts.${format}

Select Map At ( ${xoffset} , ${yoffset} ) From Interactive Map for ${method}
  ${element} =      Get WebElement  ${INTERACTIVE_MAP}
  Click Element At Coordinates  ${element}   ${xoffset}  ${yoffset}
  Wait Until Page Contains Element  //h6[text()='${method}']  10
  ${data_element} =      Get WebElement  //h6[text()='${method}']
  Scroll Element Into View  ${data_element}

Scroll Page To Location
    [Arguments]    ${x_location}    ${y_location}
    Execute JavaScript      window.scrollTo(${x_location},${y_location})

Scroll Page Down
    Execute JavaScript      window.scrollTo(0,document.body.scrollHeight)

Click Point ( ${x} , ${y} )
    Execute JavaScript      document.elementFromPoint(${x}, ${y}).click()

Scroll Slider to ${x_offset} px
    Mouse Down                      ${SLIDER}
    Drag And Drop By Offset         ${SLIDER}       ${x_offset}     0

Toggle AdminLevel
    Click Element   ${ADMINLEVEL_TOGGLE}

Check Selected ${dotname} ${level}
    ${element} =    Get Element Attribute  //h6[contains(text(),'${dotname}')]  innerHTML
    @{value} =      Split String    ${element},  separator=:
    ${length} =     Get Length  ${value}
    IF  ${level} == 1
    Should Be True	${length} == 3
    ELSE
    Should Be True	${length} == 4
    END
