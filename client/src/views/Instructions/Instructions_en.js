/* eslint-disable max-len */

import React, {useEffect, useState} from 'react';
import withStyles from '@mui/styles/withStyles';
import {Typography} from '@mui/material';
import PropTypes from 'prop-types';
import OverviewImage from '../../image/instructions/overview.png';
import GlobalControlsImage from '../../image/instructions/global-controls.png';
import MainMapImage from '../../image/instructions/main-map.png';
import ComparisonMapImage from '../../image/instructions/comparison-map.png';
import ToolbarImage from '../../image/instructions/toolbar.png';
import MapHoverImage from '../../image/instructions/map-hover.png';
import MapClickImage from '../../image/instructions/map-click.png';
import AIButtonImage from '../../image/instructions/ai-button.png';
import AIPanelImage from '../../image/instructions/ai-panel.png';
import AIListTabImage from '../../image/instructions/ai-tab-list.png';
import AIAddTabImage from '../../image/instructions/ai-tab-add.png';
import AIAnalyzeTabImage from '../../image/instructions/ai-tab-analyze.png';
import SettingsMenuImage from '../../image/instructions/settings-menu.png';
import SettingsDialogImage from '../../image/instructions/settings-dialog.png';

const sections = [
  {id: 'overview', title: 'Overview'},
  {id: 'global-controls', title: '1. Global controls'},
  {id: 'map-controls', title: '2. Map controls'},
  {id: 'comparison-map', title: '3. Comparison map'},
  {id: 'ai-assistant', title: '4. AI assistant'},
  {id: 'ai-list-tab', title: '4.1 List tab', sub: true},
  {id: 'ai-add-tab', title: '4.2 Add tab', sub: true},
  {id: 'ai-analyze-tab', title: '4.3 Analyze tab', sub: true},
  {id: 'indicator-settings', title: '5. Settings'},
];

// Space to leave above a section title when jumping to it from the table of
// contents, so the fixed page header (72px, 56px when condensed) does not
// cover it.
const SCROLL_OFFSET = 75;

const styles = ({
  page: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '90%',
    margin: '5rem auto',
    gap: '3rem',
  },
  toc: {
    position: 'sticky',
    top: '2rem',
    flex: '0 0 240px',
    borderLeft: '2px solid rgba(49, 58, 68, 0.15)',
    paddingLeft: '1rem',
  },
  tocTitle: {
    fontFamily: '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#313A44',
    marginBottom: '0.75rem',
  },
  tocList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  tocLink: {
    'display': 'block',
    'fontFamily': '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    'fontSize': 14,
    'color': '#313A44',
    'textDecoration': 'none',
    'padding': '6px 0',
    '&:hover': {
      color: '#F1815E',
    },
  },
  // Indented, slightly smaller entries for subsections (e.g. 4.1, 4.2, 4.3)
  tocLinkSub: {
    paddingLeft: '1rem',
    fontSize: 13,
  },
  tocLinkActive: {
    color: '#F1815E',
    fontWeight: 600,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  contentText: {
    fontFamily: '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    fontSize: 16,
    textAlign: 'justify',
    textJustify: 'inter-word',
    marginBottom: '1rem',
  },
  titleText: {
    fontFamily: '"Noto Serif", Georgia, serif',
    margin: '20px 20px 10px 0px',
    color: '#F1815E',
  },
  link: {
    fontFamily: '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
  },
  row: {
    display: 'flex',
    width: '100%',
    // position: 'relative',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    border: '1px solid #ddd',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  figure: {
    margin: '0 0 1.5rem 0',
  },
  screenshot: {
    display: 'block',
    maxWidth: '100%',
    border: '1px solid rgba(49, 58, 68, 0.15)',
    borderRadius: 4,
    boxShadow: '0 2px 8px rgba(49, 58, 68, 0.12)',
  },
  // Tall, narrow captures of the AI assistant panel
  screenshotPanel: {
    width: 360,
  },
  // Steps on the left, panel screenshot on the right (AI assistant tabs). The screenshot
  // never wraps below the steps; the steps column narrows instead.
  sideBySide: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '2rem',
  },
  sideBySideText: {
    flex: '1 1 50%',
    minWidth: 0,
    marginTop: 0,
  },
  // Same width as screenshotPanel, so the caption wraps under the screenshot instead of
  // widening the column and pushing the screenshot away from the right edge
  sideBySideFigure: {
    flex: '0 0 360px',
  },
  // Small crop of the header showing the AI button
  screenshotHeader: {
    width: 600,
  },
  // Tall capture of the Settings dialog
  screenshotDialog: {
    width: 560,
  },
  caption: {
    fontFamily: '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    fontSize: 13,
    fontStyle: 'italic',
    color: '#5A6470',
    marginTop: '0.5rem',
  },
  ul: {
    'listStyleType': 'decimal',
    '& li': {
      marginBottom: '1rem',
    },
  },
  ul2: {
    'listStyleType': 'lower-alpha',
  },
  ul3: {
    'listStyleType': 'disc',
  },
  promptList: {
    'listStyleType': 'disc',
    '& li': {
      marginBottom: '0.5rem',
    },
    // Justified text stretches the spaces inside the highlighted prompts
    '& p': {
      textAlign: 'left',
    },
  },
  // Example prompt text for the Analyze tab
  prompt: {
    fontFamily: '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    backgroundColor: 'rgba(49, 58, 68, 0.06)',
    borderRadius: 4,
    padding: '1px 6px',
    margin: '0 2px',
    boxDecorationBreak: 'clone',
    WebkitBoxDecorationBreak: 'clone',
  },
  // A longer example prompt, shown as its own block instead of inline
  promptBlock: {
    fontFamily: '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    fontSize: 14,
    lineHeight: 1.6,
    textAlign: 'left',
    color: '#313A44',
    backgroundColor: 'rgba(49, 58, 68, 0.06)',
    borderLeft: '3px solid #F1815E',
    borderRadius: 4,
    padding: '0.75rem 1rem',
    margin: '0 0 1rem 0',
  },
});

const Instructions = (props) => {
  const {classes} = props;
  const [activeId, setActiveId] = useState(sections[0].id);

  // Highlight the last section whose heading has scrolled past the top of the viewport.
  useEffect(() => {
    const onScroll = () => {
      let current = sections[0].id;
      sections.forEach(({id}) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          current = id;
        }
      });
      setActiveId(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({top, behavior: 'smooth'});
      setActiveId(id);
    }
  };

  const sectionClass = classes.titleText;

  const figure = (src, alt, caption, imgClass = '') => (
    <figure className={classes.figure}>
      <img src={src} alt={alt} className={`${classes.screenshot} ${imgClass}`}/>
      <figcaption className={classes.caption}>{caption}</figcaption>
    </figure>
  );

  return (
    <div className={classes.page}>

      <nav className={classes.toc} aria-label="Table of contents">
        <div className={classes.tocTitle}>Contents</div>
        <ul className={classes.tocList}>
          {sections.map(({id, title, sub}) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => scrollTo(e, id)}
                className={`${classes.tocLink} ` +
                  (sub ? `${classes.tocLinkSub} ` : '') +
                  (activeId === id ? classes.tocLinkActive : '')}>
                {title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={classes.content}>

        <Typography variant="h5" id="overview" className={sectionClass}>
        Dashboard usage instructions
        </Typography>

        <div>
          <Typography className={classes.contentText}>
          The dashboard page is where you can interact with the data. It shows indicator values on a map, scaled to the admin level.
          The default view has a main map, with an option to show a comparison map. The controls at the top of the page apply to both maps;
          each map also has its own toolbar to control what data is displayed. The following sections describe each tool&apos;s functionality
          in more detail.
          </Typography>
        </div>
        {figure(OverviewImage, 'Dashboard overview',
            'The dashboard: global controls at the top, the main map, and the charts for the selected area below.')}

        <Typography variant="h6" id="global-controls" className={sectionClass}>
        1. Global controls (top of the page)
        </Typography>
        {figure(GlobalControlsImage, 'Global controls',
            'Global controls: Country, Admin level, Year, Month and the Show comparison map button, with the EN / FR language and AI Assistant buttons in the top right corner of the header.')}
        <ul className={classes.ul}>
          <li>
            <Typography className={classes.contentText}>
              <b>Menu</b> – the burger menu (the three lines) in the top left corner of the page opens
              the other pages: Welcome, Dashboard, About, Instructions and Libraries used. It also
              opens the <b>Settings</b> window (see section 5).
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Country</b> – the country whose administrative areas are drawn on both maps.
              Senegal is currently the only country with data. <i>Africa (all countries)</i> shows
              every country with data on one map.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Admin level</b> – the <b>Admin 1</b> and <b>Admin 2</b> buttons next to the country
              selector change the map between region (Admin 1) and district (Admin 2) boundaries.
              Admin 1 is selected by default. Some indicators are only available at one admin level.
              When you pick one of those on the main map, the admin level changes to the available
              level automatically. On the comparison map, an indicator that is only available at one
              level is drawn at that level, whatever the buttons show.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Year</b> – choose the year shown on the map. The list only contains years with
              data for the indicator selected on the main map. The most recent year is selected by
              default, and again each time you choose a different indicator on the main map. Changing
              the year here also sets the comparison map to the same year.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Month</b> – choose a single month, or <b>All</b> to combine the whole year into one
              value per area. Depending on the indicator, the monthly values are either summed or
              averaged. Only months with data for the selected year are listed. The month applies to
              both maps.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Show / Hide comparison map</b> – the button on the right shows or hides a second map
              next to the main map (see section 3). When you hide it, the comparison map keeps its
              settings for the next time you show it.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Language (EN / FR)</b> – the two buttons in the top right corner of the page header
              switch the dashboard between English and French. The highlighted button shows the
              current language. The dashboard opens in English by default, and it remembers your
              choice until you close the browser tab.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>AI Assistant</b> – the button to the right of the language buttons (a speech bubble
              with a sparkle) opens the AI assistant panel on the right side of the page. Use it to add
              your own indicators from a data file, manage them, and ask questions about the data (see
              section 4).
            </Typography>
          </li>
        </ul>

        <Typography variant="h6" id="map-controls" className={sectionClass}>
        2. Map controls
        </Typography>
        <Typography className={classes.contentText}>
        The map colors each administrative area by the value of the selected indicator. You can
        zoom, hover over an area to see its values, and click an area to see its charts (see d–f
        below). These controls work the same way on the main map and the comparison map. The main
        map&apos;s toolbar contains the Themes, Indicators, and Subgroups controls; the
        comparison map&apos;s toolbar is described in section 3.
        </Typography>
        {figure(MainMapImage, 'Main map',
            'The main map with its toolbar (Themes, Indicators, Subgroups) and the charts for the selected area.')}
        <ol className={classes.ul2}>
          <li>
            <Typography className={classes.contentText}>
              <b>Themes</b> – the color scale used to shade the map. Each indicator has a default
              theme, which is applied again whenever you select a different indicator on that map.
              You can pick another theme at any time from the list, which is in alphabetical order.
              Themes are of three kinds:
            </Typography>
            <ul className={classes.ul3}>
              <li>
                <Typography className={classes.contentText}>
                  <i>Sequential</i> themes (e.g. Blues, Greens, Reds, YlOrRd, Viridis) go from light
                  to dark. They work well for values that go from low to high, such as percentages
                  or counts.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <i>Diverging</i> themes (e.g. RdBu, RdYlGn, Spectral, PiYG, BrBG) have a neutral
                  middle color. They work well for values above and below a midpoint, such as
                  Difference maps.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <i>Qualitative</i> themes (e.g. Set1, Set2, Paired, Accent) use distinct colors that
                  do not suggest an order. They are less suited to continuous values.
                </Typography>
              </li>
            </ul>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Indicators</b> – the measure displayed on the map. The list is grouped into headed
              categories, such as <i>Family Planning</i>. Indicators without a category, including
              ones you have added yourself without choosing one, appear under <i>Other</i> at the end
              of the list.
              The main map and the comparison map each have their own indicator selector. The years
              and months available in the global Year and Month selectors depend on the indicator
              selected on the main map.
            </Typography>
            <Typography className={classes.contentText}>
              <b>Note:</b> you can also change how each indicator is listed and displayed, for example
              its group, default color theme, decimal places, or unit. See the <i>Settings</i>
              section (section 5).
            </Typography>
            {figure(ToolbarImage, 'Map toolbar with the Indicators list open',
                'The map toolbar with the Indicators list open, showing indicators grouped by category.')}
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Subgroups</b> – the group of the population the indicator refers to, such as an age
              group (for example <i>15-24</i> or <i>25plus</i>), parity (<i>Parity-0</i>,
              <i> Parity-1plus</i>), place of residence (<i>rural</i>, <i>urban</i>), or a combination
              of these (for example <i>15-24_rural</i>). The list only shows subgroups available for the
              selected indicator. Each map has its own subgroup selection.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Zooming</b> – you can zoom with the mouse wheel or the + / − buttons, and drag the
              map to move around it:
            </Typography>
            <ul className={classes.ul3}>
              <li>
                <Typography className={classes.contentText}>
                  <b>Zoom with the mouse wheel</b> – hold <b>Cmd</b> (macOS) or <b>Ctrl</b> (Windows/Linux)
                  and scroll the mouse wheel over the map. Scroll up to zoom in and down to zoom out. The
                  map zooms around the mouse pointer, so point at the area you want to look at first. On a
                  trackpad, hold Cmd/Ctrl and swipe up or down with two fingers. If you scroll without
                  holding the key, the page scrolls and the map stays the same.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <b>Zoom with the + / − buttons</b> – click <b>+</b> to zoom in and <b>−</b> to zoom out.
                  The buttons are in the top-left corner of each map, above the legend.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <b>Pan</b> – click and drag the map to move it. When the comparison map is shown,
                  zooming one map zooms the other to the same level, and dragging one map moves the
                  other to the same place when you release the mouse button.
                </Typography>
              </li>
            </ul>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Hovering</b> – move the mouse over an area to outline it and open a popup with its name
              and value. Areas without data have no popup. For some indicators the popup shows a
              breakdown of the value. When the comparison map is shown, the same area&apos;s popup also
              opens on the other map.
            </Typography>
            {figure(MapHoverImage, 'Hovering over an area on a zoomed-in map',
                'A zoomed-in map. Hovering over an area opens a popup with its values; the + / − buttons are in the top-left corner.')}
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Clicking</b> – click an area to show its charts below the map. The bar above the charts
              shows the area&apos;s full name and the indicator. There is one chart per subgroup (a
              subgroup without data for the area shows <i>No data available</i>), and
              each switch under <b>Subgroups</b> shows or hides one of them. Use <b>show all</b> and
              <b> hide all</b> on the right of the bar to show or hide all charts at once. All the
              charts for an area use the same y-axis, so their values can be compared directly. The
              <b> Display options</b> box next to the switches has two settings:
            </Typography>
            <ul className={classes.ul3}>
              <li>
                <Typography className={classes.contentText}>
                  <b>combine subgroups</b> – when on, the subgroups that are switched on are drawn in a
                  single chart, one line or bar each.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <b>chart type</b> – <i>default</i> (the indicator&apos;s own chart type),
                  <i> line</i>, <i>bar</i> or <i>stacked bar</i>.
                </Typography>
              </li>
            </ul>
            <Typography className={classes.contentText}>
              On line charts, hover over the chart to read the values, and click a point to keep its
              value label on the chart. Click an item in the chart&apos;s legend to hide or show that
              line. The buttons in the top right corner of the chart zoom, pan, reset the view and
              download the chart as an image.
            </Typography>
            {figure(MapClickImage, 'Charts shown after clicking an area',
                'After clicking an area, its charts appear below the map.')}
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Other map tools</b>:
            </Typography>
            <ul className={classes.ul3}>
              <li>
                <Typography className={classes.contentText}>
                  <b>Layers</b> – the button in the top-right corner of each map shows or hides the
                  <i> Street map</i> background (country borders, place names and roads).
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <b>Download map</b> – the button below the layers button saves an image (PNG) of the
                  map with its title and legend.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <b>Title and data source</b> – the indicator is shown at the top of the map. When a
                  data source has been set for the indicator (see section 5), it is shown in the
                  map&apos;s bottom-left corner.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <b>Map height</b> – drag the small handle in the middle of the bottom edge of the
                  map down to make the maps taller.
                </Typography>
              </li>
            </ul>
          </li>
        </ol>
        <Typography variant="h6" id="comparison-map" className={sectionClass}>
        3. Comparison map
        </Typography>
        <Typography className={classes.contentText}>
        Click <b>Show comparison map</b> to display a second map next to the main map. You can use it
        to view a different indicator, subgroup or year, or the same indicator in another year. Its
        toolbar has its own Themes, Indicators, and Subgroups controls (see section 2). It also has
        these controls:
        </Typography>
        {figure(ComparisonMapImage, 'Main map and comparison map side by side',
            'The main map (left) and the comparison map (right), whose toolbar adds Legend Sync, Difference and Year/month.')}
        <ul className={classes.ul}>
          <li>
            <Typography className={classes.contentText}>
              <b>Legend Sync</b> – when on, the comparison map uses the same minimum and maximum values
              as the main map, so the same color means the same value on both maps. When off, each map
              scales its colors to its own data. It is off by default.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Difference</b> – when on, the comparison map shows, for each area, the comparison
              map&apos;s value minus the main map&apos;s value. Each value uses its own map&apos;s
              indicator, subgroup and year, and both use the global Month. A note in the bottom-left
              corner of the map shows the calculation. The color scale is centered on zero so that
              increases and decreases stand out. A diverging theme such as <i>RdBu</i> or
              <i> RdYlGn</i> works best for this view.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Year/month</b> – choose the year shown on the comparison map, separately from the main
              map. The month is always the one selected in the global Month control. For example, set
              the same indicator on both maps and pick an earlier year here, then switch Difference on
              to see how it has changed over time. Changing the global Year, or the indicator on the
              main map, sets this year again. If the comparison indicator has no data for the chosen
              year, its most recent year is shown instead.
            </Typography>
          </li>
        </ul>
        <Typography className={classes.contentText}>
        Clicking an area on the comparison map shows that area&apos;s charts below the comparison map.
        This lets you compare the trends of two different areas side by side.
        </Typography>
        <Typography className={classes.contentText}>
        Use the <b>sync y-axis</b> switch in the <b>Display options</b> box next to the comparison
        map&apos;s charts to give the charts of both maps the same y-axis. When it is on, every chart below both maps uses the same
        minimum and maximum, so the same height means the same value on both sides. When it is off,
        the charts of each map use their own y-axis. It is off by default, because the two maps can
        show indicators with very different values.
        </Typography>

        <Typography variant="h6" id="ai-assistant" className={sectionClass}>
        4. AI assistant
        </Typography>
        <Typography className={classes.contentText}>
        The AI assistant lets you add your own indicators to the dashboard from a data file, manage
        the indicators you have added, and ask questions about the data in plain language.
        </Typography>
        {figure(AIButtonImage, 'The AI button in the top right corner of the page',
            'The AI button (circled) is in the top right corner of the page, next to the EN / FR buttons.',
            classes.screenshotHeader)}
        <ul className={classes.ul}>
          <li>
            <Typography className={classes.contentText}>
              <b>Open the panel</b> – click the <b>AI button</b> (the speech bubble with a sparkle) in
              the top right corner of the page, next to the <b>EN / FR</b> language buttons. The panel
              opens on the right side of the page and the dashboard shrinks to make room for it, so you
              can keep using the maps while the panel is open.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Resize the panel</b> – drag the left edge of the panel to make it wider or narrower.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Close the panel</b> – click the arrow (<b>&gt;</b>) in the top-left corner of the
              panel. Your conversations are kept, so they are still there when you open the panel
              again. If the page is reloaded, the <b>Add</b> conversation is lost, but your last
              <b> Analyze</b> conversation is opened again.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>API key</b> – if your deployment requires one, open the <b>Add</b> or <b>Analyze</b>
              &nbsp;tab, click the key icon in the top-right corner of the panel and enter the API key for the
              AI model provider (LLM) your deployment uses. The icon turns green when a key is set. The key is not stored, so you need to enter
              it again after the page is reloaded.
            </Typography>
          </li>
        </ul>
        {figure(AIPanelImage, 'Dashboard with the AI assistant panel open',
            'The AI assistant panel open on the right of the dashboard, showing the List, Add and Analyze tabs.')}
        <Typography className={classes.contentText}>
        The panel has three tabs: <b>List</b>, <b>Add</b>, and <b>Analyze</b>. You can switch between
        them at any time without losing your work in the other tabs.
        </Typography>

        <Typography variant="subtitle1" id="ai-list-tab" className={sectionClass}>
        4.1 List tab – manage indicators
        </Typography>
        <Typography className={classes.contentText}>
          The <b>List</b> tab shows the indicators managed by the assistant. Each indicator is labeled
          <i> Custom</i> (added by a user) or <i>Default</i>, and indicators that are hidden from the
          dashboard are labeled <i>Not Listed</i>. Click an indicator to expand it and see its
          description, subgroups, version, color theme, creation date, and onboarding notes. The expanded
          view has these buttons:
        </Typography>
        <div className={classes.sideBySide}>
          <ul className={`${classes.ul} ${classes.sideBySideText}`}>
            <li>
              <Typography className={classes.contentText}>
                <b>Analyze</b> – starts a new conversation in the <b>Analyze</b> tab with a question
                about this indicator already started, so you only need to finish typing it. Your
                previous conversation is still in the list of previous sessions.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Chat History</b> – shows the conversation that was used to create the indicator.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Download</b> – downloads a zip file with the indicator&apos;s settings and data.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Remove from Dashboard / Add to Dashboard</b> – hides the indicator from the
                dashboard&apos;s Indicators list, or shows it again. The indicator and its data are kept.
                The page reloads to apply the change.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Delete</b> – permanently deletes the indicator and all its data. To confirm, type the
                indicator&apos;s ID shown in the dialog and click <b>Delete</b>. This cannot be undone.
              </Typography>
            </li>
          </ul>
          <div className={classes.sideBySideFigure}>
            {figure(AIListTabImage, 'List tab with an indicator expanded',
                'The List tab with an indicator expanded, showing its details and buttons.',
                classes.screenshotPanel)}
          </div>
        </div>
        <Typography className={classes.contentText}>
          <b>Chat History</b>, <b>Download</b>, <b>Remove from Dashboard</b>, and <b>Delete</b> are only
          available for <i>Custom</i> indicators. Use <b>Backup All</b> at the top of the tab to download a
          zip file with the settings, data files, and chat history of every indicator.
        </Typography>

        <Typography variant="subtitle1" id="ai-add-tab" className={sectionClass}>
        4.2 Add tab – add a new indicator
        </Typography>
        <Typography className={classes.contentText}>
        The <b>Add</b> tab guides you through turning a data file into a new dashboard indicator.
        </Typography>
        <div className={classes.sideBySide}>
          <ul className={`${classes.ul} ${classes.sideBySideText}`}>
            <li>
              <Typography className={classes.contentText}>
                <b>Upload a file</b> – drag and drop a CSV or Excel file (<i>.csv</i>, <i>.xlsx</i> or
                <i> .xls</i>) onto the upload area, or click the area to choose a file. The assistant
                replies with the number of rows and columns, the column names, the sheet names (for
                Excel files), any problems it found, and a preview of the first rows.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Start onboarding</b> – click <b>Start Onboarding</b>. If the file needs special
                handling, you can instead type instructions in the text box first (for example, which
                column holds the values or which sheet to use) and press send.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Answer the assistant</b> – the assistant checks the file and shows forms for the
                indicator&apos;s settings, such as its name, subgroups and color theme. Fill in each form
                and click submit; the button is enabled once the required fields are filled in. You can
                also type answers or corrections in the text box. Press <b>Enter</b> to send a message
                and <b>Shift+Enter</b> to start a new line. A progress bar shows what the assistant is
                doing while it works.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Upload another file</b> – click the cloud button next to the send button to show the
                upload area again.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Add to Dashboard</b> – when the indicator has been created, click <b>Add to
                Dashboard</b>. The page reloads, and the new indicator appears in the map toolbar&apos;s
                Indicators list and in the <b>List</b> tab. The reload closes the panel and clears the
                <b> Add</b> conversation.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Start over</b> – click the <b>New session</b> button (the speech bubble with a plus
                sign) next to the send button to clear the conversation and upload a different file.
              </Typography>
            </li>
          </ul>
          <div className={classes.sideBySideFigure}>
            {figure(AIAddTabImage, 'Add tab after uploading a CSV file',
                'The Add tab after uploading a CSV file: the file summary, a preview of the first rows and the Start Onboarding button.',
                classes.screenshotPanel)}
          </div>
        </div>

        <Typography variant="subtitle1" id="ai-analyze-tab" className={sectionClass}>
        4.3 Analyze tab – ask questions about the data
        </Typography>
        <Typography className={classes.contentText}>
        The <b>Analyze</b> tab is a chat where you can ask questions about the indicators in plain
        language, for example which areas have the highest values, how an indicator changed between
        two years, or how two indicators compare. Answers can include tables and charts.
        </Typography>
        <div className={classes.sideBySide}>
          <ul className={`${classes.ul} ${classes.sideBySideText}`}>
            <li>
              <Typography className={classes.contentText}>
                <b>Ask a question</b> – type your question in the box at the bottom of the tab and press
                <b> Enter</b> or click the send button. Press <b>Shift+Enter</b> to start a new line.
                You can ask follow-up questions in the same conversation.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Previous sessions</b> – click the clock icon on the right, just below the tabs, to see
                your earlier conversations with their number of messages and when they were last
                updated. Click a conversation to continue it, or click its trash icon and confirm to
                delete it. The conversation you last used is opened automatically when you come back to
                the dashboard.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Resources</b> – under an answer, click <b>Resources</b> to see the tools the
                assistant used, the scripts it ran, the files it created and the documents it referred
                to. Click a script or document to preview it in a panel next to the assistant. Links to
                data files in an answer download the file.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>New session</b> – click the speech bubble with a plus sign next to the send button to
                start a new conversation.
              </Typography>
            </li>
          </ul>
          <div className={classes.sideBySideFigure}>
            {figure(AIAnalyzeTabImage, 'Analyze tab with the session list open and a conversation',
                'The Analyze tab: the list of previous sessions (opened with the clock icon) above a question and its answer.',
                classes.screenshotPanel)}
          </div>
        </div>
        <Typography className={classes.contentText}>
          <b>Example questions</b> – here are some questions you can copy into the Analyze tab and
          adapt. Name the indicator, the year, and the area you are interested in; the more specific
          the question, the better the answer.
        </Typography>
        <ul className={classes.promptList}>
          <li>
            <Typography className={classes.contentText}>
              <i>Find out what data is available</i> –{' '}
              <span className={classes.prompt}>List all indicators with their subgroups, years,
              months, and admin levels.</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Rank areas</i> –{' '}
              <span className={classes.prompt}>Which 10 districts had the highest unmet need for
              family planning in 2020? Show them in a table with their region.</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Look at one area</i> –{' '}
              <span className={classes.prompt}>Summarize all indicators for Tambacounda district in
              2020.</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Trends over time</i> –{' '}
              <span className={classes.prompt}>Plot modern method use for the Kédougou region from
              2000 to 2020 as a line chart. When did it grow fastest?</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Compare years</i> –{' '}
              <span className={classes.prompt}>Which regions had the largest change in modern method
              use between 2010 and 2020?</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Compare subgroups</i> –{' '}
              <span className={classes.prompt}>Compare modern method use in rural and urban areas for
              women aged 15-24 in 2020 as a bar chart.</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Compare indicators</i> –{' '}
              <span className={classes.prompt}>Is there a relationship between modern method use and
              unmet need by district in 2020? Show a scatter plot with a trend line.</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Heatmap</i> –{' '}
              <span className={classes.prompt}>Make a heatmap of unmet need by region and year from
              2010 to 2020.</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Your own indicators</i> –{' '}
              <span className={classes.prompt}>Which districts have the largest health district
              population? Show the top 10 as a bar chart.</span>
            </Typography>
          </li>
        </ul>
        <Typography className={classes.contentText}>
          <b>Note:</b> the AI assistant may not always give the answer you expect. Check the results,
          and add more context or clarification if needed.
        </Typography>
        <Typography className={classes.contentText}>
          If an answer is not what you expected, ask a follow-up in the same conversation, for
          example{' '}<span className={classes.prompt}>Only include the Tambacounda region</span>{' '}
          or{' '}<span className={classes.prompt}>Show it as a bar chart instead</span>.
        </Typography>
        <Typography className={classes.contentText}>
          <b>Reuse a prompt</b> – when an answer looks right after several follow-ups, you can ask
          the AI assistant to combine your questions into a single, final prompt that you can reuse
          next time. Such a prompt can be quite detailed, for example:
        </Typography>
        <Typography component="div" className={classes.promptBlock}>
          Create a heatmap of family planning indicators by district (Admin 2) for 2020, using the
          <i> all</i> subgroup. Include modern method use, traditional method use, and unmet need.
          Before plotting, check whether each indicator&apos;s pred values are on a 0–100 percentage
          scale (max &gt; 1) or a 0–1 proportion scale. If values exceed 1, divide by 100 to normalize
          all indicators to a 0–1 scale. Sort districts by their modern method use (lowest at top). Use
          a red-yellow-green (RdYlGn) colormap, reversed for unmet need so that green is always the
          better value, with percentage annotations in each cell. Show missing data (grey cells) where
          an indicator is not available for a district.
        </Typography>

        <Typography variant="h6" id="indicator-settings" className={sectionClass}>
        5. Settings
        </Typography>
        <Typography className={classes.contentText}>
        The <b>Settings</b> window has an <b>Indicators</b> tab, which lets you change how each
        indicator is listed and displayed, for example its map color theme, number of decimal places,
        unit, or chart type.
        </Typography>
        <Typography className={classes.contentText}>
          <b>Note:</b> changes made in the <b>Indicators</b> tab are saved on the server. They are kept
          when the page is reloaded and apply to everyone who uses this dashboard.
        </Typography>
        {figure(SettingsMenuImage, 'The burger menu with the Settings option',
            'Open the burger menu in the top left corner of the page and choose Settings.',
            classes.screenshotHeader)}
        <ul className={classes.ul}>
          <li>
            <Typography className={classes.contentText}>
              <b>Open Settings</b> – click the <b>burger menu</b> (the three lines) in the top left
              corner of the page, then choose <b>Settings</b>. The Settings window opens on the
              <b> Indicators</b> tab.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Choose an indicator</b> – pick an indicator from the <b>Indicator</b> list at the top.
              The list shows each indicator&apos;s ID, with its unit on the right. The indicator&apos;s
              current settings then appear below.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Edit the settings</b> – change the values you want. Hover over the <b>i</b> icon next
              to a setting to see what it does. The settings include:
            </Typography>
            <ul className={classes.ul2}>
              <li>
                <Typography className={classes.contentText}>
                  <i>Where the indicator is listed</i> – <b>Indicator group</b> is the category the
                  indicator appears under in the map toolbar&apos;s Indicators list, and <b>Group
                  order</b> is its position in that category. An indicator with the group set to
                  <i> (none)</i> is listed under <i>Other</i>.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <i>How values are shown</i> – <b>Map theme</b> (the default color scale, see
                  section 2), <b>Multiplier</b> (for example 100 to show ratios as percentages),
                  <b> Decimal places</b>, <b>Unit suffix</b> (for example <i>%</i>), and <b>Use
                  average</b> (average the monthly values instead of adding them up when Month is set
                  to All).
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <i>Labels</i> – <b>Unit label</b>, <b>Map label</b>, <b>Legend label</b>, and
                  <b> Y-axis label</b> set the text used in popups, the legend and charts. They take
                  message IDs from the dashboard&apos;s translation files, so the text follows the
                  selected language. <b>Data source (English)</b> and <b>Data source (French)</b> set
                  the data source shown in the bottom-left corner of the map.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <i>Charts</i> – <b>Chart type</b> (<i>line</i>, <i>bar</i> or <i>stackBar</i>),
                  <b> Main series name</b> (also shown in map popups), and <b>Ignore others series</b>
                  (line charts).
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <i>Map extras</i> – <b>Shapefile version</b> (which set of area boundaries to use),
                  <b> Raster overlay file</b> (an image laid over the map), and <b>Show extra info</b>{' '}
                  (an info icon on the map), with its text in <b>Extra info (English)</b> and <b>Extra
                  info (French)</b>.
                </Typography>
              </li>
            </ul>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Save</b> – click <b>Save</b> to apply your changes. The button is only enabled when
              you have changed something. The changes are saved on the server, a <i>Saved.</i> message
              appears next to the button, and the dashboard uses the new settings straight away. To go
              back to an indicator&apos;s default for a setting, clear the field (or choose
              <i> (default)</i>) and click <b>Save</b>. Close the window with the <b>X</b> in its top
              right corner.
            </Typography>
          </li>
        </ul>
        {figure(SettingsDialogImage, 'The Settings window with an indicator selected',
            'The Settings window: choose an indicator at the top, edit its settings and click Save.',
            classes.screenshotDialog)}
      </div>
    </div>);
};

Instructions.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Instructions);
