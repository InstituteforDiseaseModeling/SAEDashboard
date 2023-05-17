import * as am4core from '@amcharts/amcharts4/core';
import customTheme from '../../customTheme.json';
import chroma from 'chroma-js';


/**
 * this function is to create a custom legend inside the chart
 * @param {*} container - chart container
 * @param {*} mapLegendMax - max percentage valuie
 * @param {*} minValue - min percentage value
 * @param {*} numberOfSteps - number of legend boxes
 * @param {*} selectedMapTheme  - color theme
 */
export function createLegend(container, mapLegendMax, minValue, numberOfSteps, selectedMapTheme) {
  // const legendMax = (mapLegendMax + ((5-((mapLegendMax*100).toFixed(0) % 5)) / 100))
  //    .toFixed(2) //round up to next 5 or 10.
  const step = (mapLegendMax - minValue) / numberOfSteps;
  const themeStr = _.find(customTheme, {color: selectedMapTheme} );

  // To get a continuous color scheme, remove the .classes()
  const scale = chroma.scale(themeStr ? themeStr.values : selectedMapTheme)
      .domain([minValue, mapLegendMax]).classes(numberOfSteps);

  const legendContainer = container.createChild(am4core.Container);
  legendContainer.layout = 'vertical';
  legendContainer.fill = am4core.color('black');
  legendContainer.paddingTop = 10;

  // home button
  const homeButton = legendContainer.createChild(am4core.Button);
  homeButton.label.text = '🏠';
  homeButton.backgroundColor = '#ffffff';
  homeButton.padding(5, 5, 5, 5);
  homeButton.width = 45;
  homeButton.align = 'left';
  homeButton.marginLeft = 15;
  homeButton.events.on('hit', function() {
    container.goHome();
  });

  // the first percentage (highest value) doesn't need a color box.
  const label = legendContainer.createChild(am4core.Label);
  label.text = (minValue + step * (numberOfSteps) * 100).toFixed(0) + '%';
  label.fontSize = 11;
  label.x = 28;
  label.paddingTop = 16;
  label.paddingLeft = 20;
  label.fontWeight = 'bold';
  label.dy = 7;

  const colors = scale.colors(numberOfSteps);
  for (let i = 0; i < numberOfSteps; ++i) {
    // container for color box + label
    const itemContainer = legendContainer.createChild(am4core.Container);
    itemContainer.layout = 'horizontal';
    itemContainer.x = 20;
    itemContainer.fill = am4core.color(colors[numberOfSteps-i-1]);
    itemContainer.height = 25;

    const rect = itemContainer.createChild(am4core.Rectangle);
    rect.text = 'test';
    rect.width = 23;
    rect.height = 28;

    const label = itemContainer.createChild(am4core.Label);
    label.text = (minValue + step * (numberOfSteps-i-1) * 100).toFixed(0) + '%';
    label.fontSize = 10;
    label.paddingLeft = 5;
    label.y = 19;
    label.fontWeight = 'bold';
  }
}
