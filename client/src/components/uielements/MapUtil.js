/* eslint-disable max-len */
/* eslint-disable valid-jsdoc */
/* eslint-disable no-invalid-this */
/* eslint-disable comma-dangle */


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


/**
 * this function is used to create a map marker icon using the given color
 * @param {string} color - color of the icon
 * @return {*} - leafletJS icon
 */
export function colorMarker(color) {
  const _color = color ? color : '#3392d0';

  return window.L.divIcon({
    html: `
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0"
    y="0" viewBox="0 0 12 20" style="enable-background:new 0 0 12 20" xml:space="preserve"><style></style>
    <g id="Artwork_1_00000150076358107722187810000000374260142755965099_"><defs><path id="SVGID_1_" d="M0 0h12v20H0z"/></defs>
    <clipPath id="SVGID_00000165913072732037979660000000808436757911807901_"><use xlink:href="#SVGID_1_"
    style="overflow:visible"/></clipPath><g style="clip-path:url(#SVGID_00000165913072732037979660000000808436757911807901_)">
    <defs><path id="SVGID_00000082346768756813892310000003364813612560268974_" d="M0 0h12v20H0z"/></defs>
    <clipPath id="SVGID_00000133498962456502987770000005292578842797837211_">
    <use xlink:href="#SVGID_00000082346768756813892310000003364813612560268974_" style="overflow:visible"/></clipPath>
    <path style="clip-path:url(#SVGID_00000133498962456502987770000005292578842797837211_);fill:${_color}" 
    d="M11.94 6.16c0 3.37-4.78 13.78-5.94 13.78C4.95 19.94.06 9.53.06 6.16S2.72.06 6 .06s5.94 2.73 5.94 6.1"/><path style="clip-path:url(#SVGID_00000133498962456502987770000005292578842797837211_);fill:none;stroke:#231f20;stroke-width:.1147;stroke-miterlimit:10" d="M11.94 6.16c0 3.37-4.78 13.78-5.94 13.78C4.95 19.94.06 9.53.06 6.16S2.72.06 6 .06s5.94 2.73 5.94 6.1z"/><path style="clip-path:url(#SVGID_00000133498962456502987770000005292578842797837211_);fill:#fff" d="M7.95 5.83c0 1.11-.87 2-1.95 2s-1.95-.9-1.95-2 .87-2 1.95-2 1.95.89 1.95 2"/><ellipse style="clip-path:url(#SVGID_00000133498962456502987770000005292578842797837211_);fill:none;stroke:#231f20;stroke-width:.1147;stroke-miterlimit:10" cx="6" cy="5.83" rx="1.95" ry="2"/></g></g></svg>
    `,
    className: 'marker',
    iconSize: [24, 40],
    iconAnchor: [12, 40],
  });
};

/**
 * this function is used to create a map marker.
 * @param {*} clinic
 * @param {*} name
 * @param {*} formatMessage
 * @returns
 */
export function create2019SitePopup(clinic, name, formatMessage) {
  return '<div class="popupCustom">' +
  '<div class="row border"><div class="col">'+ formatMessage({id: 'site'}) +':</div><div>' + name + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'alternate'}) +':</div><div>' + clinic.ALT + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'code'}) +':</div><div>' + clinic.CODE + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'fraction_polygenomic'}) +':</div><div>' + clinic.Fraction_polygenomic + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'fraction_unique'}) +':</div><div>' + clinic.Fraction_unique + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'heterozygosity'}) +':</div><div>' + clinic.heterozygosity + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'repeat_multiple'}) +':</div><div>' + clinic.repeated_multiple + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'repeat_twice'}) +':</div><div>' + clinic.repeated_twice + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'type'}) +':</div><div>' + clinic.TYPE + '</div></div></div>' +
  '</div>';
};

/**
 * this function is used to create a map marker.
 * @param {*} clinic
 * @param {*} name
 * @param {*} formatMessage
 * @returns
 */
export function create2020SitePopup(clinic, name, formatMessage) {
  return '<div class="popupCustom">' +
  '<div class="row border"><div class="col">'+ formatMessage({id: 'site'}) +':</div><div>' + clinic.SITE + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'rh'}) +':</div><div>' + clinic.RH + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'code'}) +':</div><div>' + clinic.CODE + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'poly_fract'}) +':</div><div>' + clinic.poly_fract + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'poly_fract_ci'}) +':</div><div>' + clinic.poly_fract_ci + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'cotx'}) +':</div><div>' + clinic.cotx + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'mccoil_coi'}) +':</div><div>' + clinic.mccoil_coi + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'mccoil_coi_poly'}) +':</div><div>' + clinic.mccoil_coi_poly + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'monoclonality'}) +':</div><div>' + clinic.monoclonality + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'monoclonality_ci'}) +':</div><div>' + clinic.monoclonality_ci + '</div></div></div>' +
  '<div class="row"><div class="col">'+ formatMessage({id: 'n'}) +':</div><div>' + clinic.n + '</div></div></div>' +
  '</div>';
};


/**
 * To add 2019 barcode site markers
 * @param {*} siteData
 * @param {*} layerControl
 * @param {*} createSitePopup
 * @param {*} formatMessage
 */
export function add2019Barcode(siteData, layerControl, createSitePopup, formatMessage) {
  const L = require('leaflet');
  const sites = [];
  const blues = chroma.scale('Blues').domain([0, 1]).classes(5); // used for health clinic markers
  const blueColors = blues.colors(5);

  for (const site in siteData) {
    if (site) {
      const clinic = siteData[site];
      let colorIndex = Math.ceil(clinic.Fraction_polygenomic * 5) - 1;
      if (!clinic.Fraction_polygenomic) {
        colorIndex = -1;
      }
      const marker = L.marker([clinic.Lat_2, clinic.Long_2],
          {icon: colorMarker(colorIndex == -1 ? 'crimson' :
            blueColors[colorIndex])})
          .bindPopup(createSitePopup(clinic, site, formatMessage), {'className': 'popupCustom'})
          .on('mouseover', function(e) {
            this.openPopup();
          });
      sites.push(marker);
    }
  };

  const lg = L.layerGroup(sites);
  layerControl.addOverlay(lg, formatMessage({id: '2019_barcode_data'}));
};

/**
 * To add 2020 barcode site markers
 * @param {*} siteData
 * @param {*} layerControl
 * @param {*} createSitePopup
 * @param {*} formatMessage
 */
export function add2020Barcode(siteData, layerControl, createSitePopup, formatMessage) {
  const L = require('leaflet');
  const sites = [];
  const blues = chroma.scale('Blues').domain([0, 1]).classes(5); // used for health clinic markers
  const blueColors = blues.colors(5);

  for (const site in siteData) {
    if (site) {
      const clinic = siteData[site];
      let colorIndex = Math.ceil(clinic.poly_fract * 5) - 1;
      if (!clinic.poly_fract) {
        colorIndex = -1;
      }
      const marker = L.marker([clinic.Latitude, clinic.Longitude], {
        icon: colorMarker(colorIndex == -1 ? 'crimson' : blueColors[colorIndex])
      }).bindPopup(createSitePopup(clinic, site, formatMessage), {
        className: 'popupCustom'
      }).on('mouseover', function(e) {
        this.openPopup();
      });
      sites.push(marker);
    }
  };

  const lg = L.layerGroup(sites);
  layerControl.addOverlay(lg, formatMessage({id: '2020_barcode_data'}));
};

