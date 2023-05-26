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
  // const step = (mapLegendMax - minValue) / numberOfSteps;
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
  // label.text = Math.round(minValue + step * (numberOfSteps), 0) + ' cases/1000';
  label.text = '> 15 cases/1000';
  label.fontSize = 11;
  label.x = 28;
  label.paddingTop = 16;
  label.paddingLeft = 20;
  label.fontWeight = 'bold';
  label.dy = 7;

  const colors = scale.colors(10);
  // container for color box + label


  const itemContainer2 = legendContainer.createChild(am4core.Container);
  itemContainer2.layout = 'horizontal';
  itemContainer2.x = 20;
  itemContainer2.fill = am4core.color(colors[9]);
  itemContainer2.height = 25;

  const rect2 = itemContainer2.createChild(am4core.Rectangle);
  rect2.text = 'test';
  rect2.width = 23;
  rect2.height = 28;

  const label2 = itemContainer2.createChild(am4core.Label);
  label2.text = '15';
  label2.fontSize = 10;
  label2.paddingLeft = 5;
  label2.y = 19;
  label2.fontWeight = 'bold';

  const itemContainer1 = legendContainer.createChild(am4core.Container);
  itemContainer1.layout = 'horizontal';
  itemContainer1.x = 20;
  itemContainer1.fill = am4core.color(colors[4]);
  itemContainer1.height = 25;

  const rect1 = itemContainer1.createChild(am4core.Rectangle);
  rect1.text = 'test';
  rect1.width = 23;
  rect1.height = 28;

  const label1 = itemContainer1.createChild(am4core.Label);
  label1.text = '5';
  label1.fontSize = 10;
  label1.paddingLeft = 5;
  label1.y = 19;
  label1.fontWeight = 'bold';

  const itemContainer0 = legendContainer.createChild(am4core.Container);
  itemContainer0.layout = 'horizontal';
  itemContainer0.x = 20;
  itemContainer0.fill = am4core.color(colors[0]);
  itemContainer0.height = 25;

  const rect0 = itemContainer0.createChild(am4core.Rectangle);
  rect0.text = 'test';
  rect0.width = 23;
  rect0.height = 28;

  const label0 = itemContainer0.createChild(am4core.Label);
  label0.text = '0';
  label0.fontSize = 10;
  label0.paddingLeft = 5;
  label0.y = 19;
  label0.fontWeight = 'bold';
}
