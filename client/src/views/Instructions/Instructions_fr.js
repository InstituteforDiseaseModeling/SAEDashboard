/* eslint-disable max-len */

import React, {useEffect, useState} from 'react';
import withStyles from '@mui/styles/withStyles';
import {Typography} from '@mui/material';
import PropTypes from 'prop-types';
import OverviewImage from '../../image/instructions/fr/overview.png';
import GlobalControlsImage from '../../image/instructions/fr/global-controls.png';
import MainMapImage from '../../image/instructions/fr/main-map.png';
import ComparisonMapImage from '../../image/instructions/fr/comparison-map.png';
import ToolbarImage from '../../image/instructions/fr/toolbar.png';
import MapHoverImage from '../../image/instructions/fr/map-hover.png';
import MapClickImage from '../../image/instructions/fr/map-click.png';
import AIButtonImage from '../../image/instructions/fr/ai-button.png';
import AIPanelImage from '../../image/instructions/fr/ai-panel.png';
import AIListTabImage from '../../image/instructions/fr/ai-tab-list.png';
import AIAddTabImage from '../../image/instructions/fr/ai-tab-add.png';
import AIAnalyzeTabImage from '../../image/instructions/fr/ai-tab-analyze.png';
import SettingsMenuImage from '../../image/instructions/fr/settings-menu.png';
import SettingsDialogImage from '../../image/instructions/fr/settings-dialog.png';

const sections = [
  {id: 'overview', title: 'Présentation'},
  {id: 'global-controls', title: '1. Commandes générales'},
  {id: 'map-controls', title: '2. Commandes de la carte'},
  {id: 'comparison-map', title: '3. Carte comparative'},
  {id: 'ai-assistant', title: '4. Assistant IA'},
  {id: 'ai-list-tab', title: '4.1 Onglet Liste', sub: true},
  {id: 'ai-add-tab', title: '4.2 Onglet Ajouter', sub: true},
  {id: 'ai-analyze-tab', title: '4.3 Onglet Analyser', sub: true},
  {id: 'indicator-settings', title: '5. Paramètres'},
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

      <nav className={classes.toc} aria-label="Sommaire">
        <div className={classes.tocTitle}>Sommaire</div>
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
        Instructions d’utilisation du tableau de bord
        </Typography>

        <div>
          <Typography className={classes.contentText}>
          La page Tableau de bord est l’endroit où vous pouvez explorer les données. Elle affiche les
          valeurs des indicateurs sur une carte, au niveau administratif (admin) choisi. La vue par défaut
          comporte une carte principale, avec la possibilité d’afficher une carte comparative. Les
          commandes situées en haut de la page s’appliquent aux deux cartes ; chaque carte dispose
          aussi de sa propre barre d’outils pour choisir les données affichées. Les sections
          suivantes décrivent chaque outil plus en détail.
          </Typography>
        </div>
        {figure(OverviewImage, 'Vue d’ensemble du tableau de bord',
            'Le tableau de bord : les commandes générales en haut, la carte principale, et en dessous les graphiques de la zone sélectionnée.')}

        <Typography variant="h6" id="global-controls" className={sectionClass}>
        1. Commandes générales (en haut de la page)
        </Typography>
        {figure(GlobalControlsImage, 'Commandes générales',
            'Commandes générales : Country, Admin level, Year, Month et le bouton Show comparison map, avec les boutons de langue EN / FR et de l’assistant IA en haut à droite de l’en-tête.')}
        <ul className={classes.ul}>
          <li>
            <Typography className={classes.contentText}>
              <b>Menu</b> – le menu (les trois traits) en haut à gauche de la page ouvre les autres
              pages : Bienvenue, Tableau de bord, À propos, Instructions et Bibliothèques utilisées.
              Il ouvre aussi la fenêtre <b>Paramètres</b> (voir la section 5).
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Country</b> (pays) – le pays dont les unités administratives sont dessinées sur les
              deux cartes. Le Sénégal est pour l’instant le seul pays disposant de données.
              <i> Africa (all countries)</i> affiche sur une même carte tous les pays disposant de
              données.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Admin level</b> (niveau administratif) – les boutons <b>Admin 1</b> et <b>Admin 2</b>{' '}
              situés à côté du sélecteur de pays font passer la carte des limites des régions
              (Admin 1) à celles des districts (Admin 2), et inversement. Admin 1 est sélectionné par
              défaut. Certains indicateurs ne sont disponibles qu’à un seul niveau administratif. Si
              vous choisissez l’un d’eux sur la carte principale, le niveau passe automatiquement au
              niveau disponible. Sur la carte comparative, un indicateur disponible à un seul niveau
              est dessiné à ce niveau, quel que soit le bouton sélectionné.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Year</b> (année) – choisissez l’année affichée sur la carte. La liste ne
              contient que les années pour lesquelles l’indicateur sélectionné sur la carte principale
              a des données. L’année la plus récente est sélectionnée par défaut, et de nouveau chaque
              fois que vous choisissez un autre indicateur sur la carte principale. Changer l’année
              ici applique aussi la même année à la carte comparative.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Month</b> (mois) – choisissez un seul mois, ou <b>Tous</b> pour regrouper toute
              l’année en une seule valeur par zone. Selon l’indicateur, les valeurs mensuelles sont
              additionnées ou moyennées. Seuls les mois disposant de données pour l’année
              sélectionnée sont proposés. Le mois s’applique aux deux cartes.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Show / Hide comparison map</b> (afficher / masquer la carte comparative) – le bouton
              à droite affiche ou masque une seconde carte à côté de la carte principale (voir la
              section 3). Lorsqu’elle est masquée, la carte comparative conserve ses réglages pour la
              prochaine fois que vous l’affichez.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Langue (EN / FR)</b> – les deux boutons en haut à droite de l’en-tête font passer le
              tableau de bord de l’anglais au français, et inversement. Le bouton en surbrillance
              indique la langue actuelle. Le tableau de bord s’ouvre en anglais par défaut et
              mémorise votre choix jusqu’à la fermeture de l’onglet du navigateur.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Assistant IA</b> – le bouton à droite des boutons de langue (une bulle avec une
              étincelle) ouvre le panneau de l’assistant IA sur le côté droit de la page. Il permet
              d’ajouter vos propres indicateurs à partir d’un fichier de données, de les gérer et de
              poser des questions sur les données (voir la section 4).
            </Typography>
          </li>
        </ul>

        <Typography variant="h6" id="map-controls" className={sectionClass}>
        2. Commandes de la carte
        </Typography>
        <Typography className={classes.contentText}>
          La carte colore chaque unité administrative selon la valeur de l’indicateur sélectionné.
          Vous pouvez zoomer, survoler une zone pour voir ses valeurs et cliquer sur une zone pour
          afficher ses graphiques (voir les points d à f ci-dessous). Ces commandes fonctionnent de la
          même manière sur la carte principale et sur la carte comparative. La barre d’outils de la
          carte principale contient les commandes Thèmes, Indicateurs et Sous-groupes ; celle
          de la carte comparative est décrite à la section 3.
        </Typography>
        {figure(MainMapImage, 'Carte principale',
            'La carte principale avec sa barre d’outils (Thèmes, Indicateurs, Sous-groupes) et les graphiques de la zone sélectionnée.')}
        <ol className={classes.ul2}>
          <li>
            <Typography className={classes.contentText}>
              <b>Thèmes</b> – la palette de couleurs utilisée pour colorer la carte. Chaque indicateur a
              un thème par défaut, qui est réappliqué chaque fois que vous sélectionnez un autre
              indicateur sur cette carte. Vous pouvez choisir un autre thème à tout moment dans la
              liste, classée par ordre alphabétique. Il existe trois sortes de thèmes :
            </Typography>
            <ul className={classes.ul3}>
              <li>
                <Typography className={classes.contentText}>
                  Les thèmes <i>séquentiels</i> (par ex. Blues, Greens, Reds, YlOrRd, Viridis) vont
                  du clair au foncé. Ils conviennent aux valeurs qui vont du plus bas au plus haut,
                  comme des pourcentages ou des effectifs.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  Les thèmes <i>divergents</i> (par ex. RdBu, RdYlGn, Spectral, PiYG, BrBG) ont une
                  couleur neutre au milieu. Ils conviennent aux valeurs situées au-dessus et
                  au-dessous d’un point médian, comme les cartes de différence.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  Les thèmes <i>qualitatifs</i> (par ex. Set1, Set2, Paired, Accent) utilisent des
                  couleurs distinctes qui ne suggèrent pas d’ordre. Ils conviennent moins aux valeurs
                  continues.
                </Typography>
              </li>
            </ul>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Indicateurs</b> – la mesure affichée sur la carte. La liste est organisée en
              catégories avec un titre, comme <i>Family Planning</i> (planification familiale). Les
              indicateurs sans catégorie, y compris ceux que vous avez ajoutés vous-même sans en
              choisir une, apparaissent sous <i>Other</i> (autres) à la fin de la liste. La carte
              principale et la carte
              comparative ont chacune leur propre sélecteur d’indicateur. Les années et les mois
              proposés dans les sélecteurs généraux Year et Month dépendent de l’indicateur choisi sur
              la carte principale.
            </Typography>
            <Typography className={classes.contentText}>
              <b>Remarque :</b> vous pouvez aussi modifier la façon dont chaque indicateur est listé et
              affiché, par exemple son groupe, son thème de couleurs par défaut, son nombre de
              décimales ou son unité. Voir la section <i>Paramètres</i> (section 5).
            </Typography>
            {figure(ToolbarImage, 'Barre d’outils de la carte avec la liste des indicateurs ouverte',
                'La barre d’outils de la carte avec la liste Indicateurs ouverte : les indicateurs sont regroupés par catégorie.')}
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Sous-groupes</b> – le groupe de population auquel se réfère l’indicateur, par exemple
              une tranche d’âge (comme <i>15-24</i> ou <i>25plus</i>), la parité (<i>Parity-0</i>,
              <i> Parity-1plus</i>), le milieu de résidence (<i>rural</i>, <i>urban</i>) ou une
              combinaison de ceux-ci (comme <i>15-24_rural</i>). La liste ne montre que les
              sous-groupes disponibles pour l’indicateur sélectionné. Chaque carte a sa propre
              sélection de sous-groupe.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Zoom</b> – vous pouvez zoomer avec la molette de la souris ou avec les boutons + / −,
              et faire glisser la carte pour vous déplacer :
            </Typography>
            <ul className={classes.ul3}>
              <li>
                <Typography className={classes.contentText}>
                  <b>Zoomer avec la molette</b> – maintenez <b>Cmd</b> (macOS) ou <b>Ctrl</b>{' '}
                  (Windows/Linux) enfoncée et faites tourner la molette de la souris au-dessus de la
                  carte. Vers le haut pour zoomer, vers le bas pour dézoomer. La carte zoome autour du
                  pointeur : placez-le d’abord sur la zone qui vous intéresse. Sur un pavé tactile,
                  maintenez Cmd/Ctrl et faites glisser deux doigts vers le haut ou vers le bas. Si vous
                  faites défiler sans maintenir la touche, c’est la page qui défile et la carte ne
                  change pas.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <b>Zoomer avec les boutons + / −</b> – cliquez sur <b>+</b> pour zoomer et sur
                  <b> −</b> pour dézoomer. Les boutons se trouvent dans le coin supérieur gauche de
                  chaque carte, au-dessus de la légende.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <b>Déplacer</b> – cliquez sur la carte et faites-la glisser pour la déplacer. Lorsque
                  la carte comparative est affichée, zoomer sur une carte applique le même niveau de
                  zoom à l’autre, et déplacer une carte déplace l’autre au même endroit lorsque vous
                  relâchez le bouton de la souris.
                </Typography>
              </li>
            </ul>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Survol</b> – passez la souris sur une zone pour la mettre en évidence et ouvrir une
              fenêtre avec son nom et sa valeur. Les zones sans données n’ont pas de fenêtre. Pour
              certains indicateurs, la fenêtre détaille la valeur. Lorsque la carte comparative est
              affichée, la fenêtre de la même zone s’ouvre aussi sur l’autre carte.
            </Typography>
            {figure(MapHoverImage, 'Survol d’une zone sur une carte agrandie',
                'Une carte agrandie. Survoler une zone ouvre une fenêtre avec ses valeurs ; les boutons + / − se trouvent dans le coin supérieur gauche.')}
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Clic</b> – cliquez sur une zone pour afficher ses graphiques sous la carte. La barre
              au-dessus des graphiques indique le nom complet de la zone et l’indicateur. Il y a un
              graphique par sous-groupe (un sous-groupe sans données pour la zone affiche <i>No data
              available</i>), et chaque interrupteur sous <b>Sous-groupes</b> affiche ou
              masque l’un d’eux. Utilisez <b>Afficher tout</b> et <b>Cacher tout</b> à droite de la
              barre pour afficher ou masquer tous les graphiques à la fois. Tous les graphiques d’une
              zone utilisent le même axe Y, ce qui permet de comparer directement leurs valeurs. Le
              cadre <b>Options d’affichage</b>, à côté des interrupteurs, propose deux réglages :
            </Typography>
            <ul className={classes.ul3}>
              <li>
                <Typography className={classes.contentText}>
                  <b>combiner les sous-groupes</b> – lorsqu’il est activé, les sous-groupes affichés
                  sont réunis dans un seul graphique, avec une courbe ou une barre chacun.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <b>type de graphique</b> – <i>par défaut</i> (le type de graphique propre à
                  l’indicateur), <i>ligne</i>, <i>barres</i> ou <i>barres empilées</i>.
                </Typography>
              </li>
            </ul>
            <Typography className={classes.contentText}>
              Sur les courbes, survolez le graphique pour lire les valeurs, et cliquez sur un point
              pour garder son étiquette de valeur sur le graphique. Cliquez sur un élément de la
              légende du graphique pour masquer ou afficher cette courbe. Les boutons en haut à droite
              du graphique permettent de zoomer, de se déplacer, de revenir à la vue initiale et de
              télécharger le graphique en image.
            </Typography>
            {figure(MapClickImage, 'Graphiques affichés après un clic sur une zone',
                'Après un clic sur une zone, ses graphiques apparaissent sous la carte.')}
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Autres outils de la carte</b> :
            </Typography>
            <ul className={classes.ul3}>
              <li>
                <Typography className={classes.contentText}>
                  <b>Couches</b> – le bouton en haut à droite de chaque carte affiche ou masque le fond
                  <i> Street map</i> (frontières, noms de lieux et routes).
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <b>Télécharger la carte</b> – le bouton sous le bouton des couches enregistre une
                  image (PNG) de la carte avec son titre et sa légende.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <b>Titre et source des données</b> – l’indicateur est affiché en haut de la carte.
                  Lorsqu’une source de données a été définie pour l’indicateur (voir la section 5), elle
                  est affichée dans le coin inférieur gauche de la carte.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <b>Hauteur de la carte</b> – faites glisser vers le bas la petite poignée au milieu du
                  bord inférieur de la carte pour agrandir les cartes en hauteur.
                </Typography>
              </li>
            </ul>
          </li>
        </ol>
        <Typography variant="h6" id="comparison-map" className={sectionClass}>
        3. Carte comparative
        </Typography>
        <Typography className={classes.contentText}>
          Cliquez sur <b>Show comparison map</b> pour afficher une seconde carte à côté de la carte
          principale. Elle permet de voir un autre indicateur, un autre sous-groupe ou une autre année,
          ou le même indicateur pour une autre année. Sa barre d’outils a ses propres commandes
          Thèmes, Indicateurs et Sous-groupes (voir la section 2). Elle a aussi les commandes
          suivantes :
        </Typography>
        {figure(ComparisonMapImage, 'Carte principale et carte comparative côte à côte',
            'La carte principale (à gauche) et la carte comparative (à droite), dont la barre d’outils ajoute Legend Sync, Différence et Année/mois.')}
        <ul className={classes.ul}>
          <li>
            <Typography className={classes.contentText}>
              <b>Legend Sync</b> (synchroniser la légende) – lorsqu’il est activé, la carte
              comparative utilise les mêmes valeurs minimale et maximale que la carte principale : une
              même couleur correspond donc à une même valeur sur les deux cartes. Lorsqu’il est
              désactivé, chaque carte adapte ses couleurs à ses propres données. Il est désactivé par
              défaut.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Différence</b> – lorsqu’il est activé, la carte comparative affiche, pour chaque zone,
              la valeur de la carte comparative moins celle de la carte principale. Chaque valeur
              utilise l’indicateur, le sous-groupe et l’année de sa propre carte, et les deux utilisent
              le mois général. Une note dans le coin inférieur gauche de la carte indique le calcul.
              L’échelle de couleurs est centrée sur zéro pour faire ressortir les hausses et les
              baisses. Un thème divergent comme <i>RdBu</i> ou <i>RdYlGn</i> convient le mieux à cet
              affichage.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Année/mois</b> – choisissez l’année affichée sur la carte comparative,
              indépendamment de la carte principale. Le mois est toujours celui choisi dans la
              commande générale Month. Par exemple, choisissez le même indicateur sur les deux cartes
              et une année antérieure ici, puis activez Différence pour voir son évolution dans le
              temps. Changer l’année générale, ou l’indicateur de la carte principale, redéfinit
              cette année. Si l’indicateur comparé n’a pas de données pour l’année choisie, son année
              la plus récente est affichée à la place.
            </Typography>
          </li>
        </ul>
        <Typography className={classes.contentText}>
        Un clic sur une zone de la carte comparative affiche les graphiques de cette zone sous la carte
        comparative. Vous pouvez ainsi comparer côte à côte les tendances de deux zones différentes.
        </Typography>
        <Typography className={classes.contentText}>
        Utilisez l’interrupteur <b>synchroniser l’axe Y</b>, dans le cadre <b>Options
        d’affichage</b> à côté des graphiques de la carte comparative, pour donner le même axe Y aux graphiques des deux cartes. Lorsqu’il est
        activé, tous les graphiques sous les deux cartes utilisent les mêmes valeurs minimale et
        maximale : une même hauteur correspond donc à une même valeur des deux côtés. Lorsqu’il est
        désactivé, les graphiques de chaque carte utilisent leur propre axe Y. Il est désactivé par
        défaut, car les deux cartes peuvent afficher des indicateurs aux valeurs très différentes.
        </Typography>

        <Typography variant="h6" id="ai-assistant" className={sectionClass}>
        4. Assistant IA
        </Typography>
        <Typography className={classes.contentText}>
        L’assistant IA permet d’ajouter vos propres indicateurs au tableau de bord à partir d’un
        fichier de données, de gérer les indicateurs que vous avez ajoutés et de poser des questions
        sur les données en langage courant. Les onglets du panneau sont en français, mais la plupart
        des boutons sont pour l’instant en anglais ; leurs noms sont donc indiqués ci-dessous tels
        qu’ils apparaissent à l’écran.
        </Typography>
        {figure(AIButtonImage, 'Le bouton de l’assistant IA en haut à droite de la page',
            'Le bouton de l’assistant IA (entouré) se trouve en haut à droite de la page, à côté des boutons EN / FR.',
            classes.screenshotHeader)}
        <ul className={classes.ul}>
          <li>
            <Typography className={classes.contentText}>
              <b>Ouvrir le panneau</b> – cliquez sur le <b>bouton de l’assistant IA</b> (la bulle
              avec une étincelle) en haut à droite de la page, à côté des boutons de langue
              <b> EN / FR</b>. Le panneau s’ouvre sur le côté droit de la page et le tableau de bord se
              réduit pour lui faire de la place : vous pouvez continuer à utiliser les cartes pendant
              que le panneau est ouvert.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Redimensionner le panneau</b> – faites glisser le bord gauche du panneau pour
              l’élargir ou le rétrécir.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Fermer le panneau</b> – cliquez sur la flèche (<b>&gt;</b>) dans le coin supérieur
              gauche du panneau. Vos conversations sont conservées et vous les retrouvez quand vous
              rouvrez le panneau. Si la page est rechargée, la conversation de l’onglet
              <b> Ajouter</b> est perdue, mais votre dernière conversation de l’onglet
              <b> Analyser</b> est rouverte.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Clé API</b> – si votre installation en exige une, ouvrez l’onglet <b>Ajouter</b> ou
              <b> Analyser</b>, cliquez sur l’icône de clé en haut à droite du panneau et saisissez
              la clé API du fournisseur de modèle d’IA (LLM) utilisé par votre installation. L’icône
              devient verte lorsqu’une clé est saisie. La clé n’est
              pas conservée : il faut la saisir de nouveau après un rechargement de la page.
            </Typography>
          </li>
        </ul>
        {figure(AIPanelImage, 'Tableau de bord avec le panneau de l’assistant IA ouvert',
            'Le panneau de l’assistant IA ouvert à droite du tableau de bord, avec les onglets Liste, Ajouter et Analyser.')}
        <Typography className={classes.contentText}>
          Le panneau comporte trois onglets : <b>Liste</b>, <b>Ajouter</b> et <b>Analyser</b>. Vous
          pouvez passer de l’un à l’autre à tout moment sans perdre ce que vous avez fait dans les
          autres onglets.
        </Typography>

        <Typography variant="subtitle1" id="ai-list-tab" className={sectionClass}>
        4.1 Onglet Liste – gérer les indicateurs
        </Typography>
        <Typography className={classes.contentText}>
          L’onglet <b>Liste</b> affiche les indicateurs gérés par l’assistant. Chaque indicateur porte
          l’étiquette <i>Custom</i> (ajouté par un utilisateur) ou <i>Default</i> (par défaut), et les
          indicateurs masqués du tableau de bord portent l’étiquette <i>Not Listed</i> (non listé).
          Cliquez sur un indicateur pour le déplier et voir sa description, ses sous-groupes, sa
          version, son thème de couleurs, sa date de création et ses notes d’intégration. La vue
          dépliée propose les boutons suivants :
        </Typography>
        <div className={classes.sideBySide}>
          <ul className={`${classes.ul} ${classes.sideBySideText}`}>
            <li>
              <Typography className={classes.contentText}>
                <b>Analyze</b> (analyser) – commence une nouvelle conversation dans l’onglet
                <b> Analyser</b> avec une question sur cet indicateur déjà commencée : il ne vous reste
                qu’à la compléter. Votre conversation précédente reste dans la liste des sessions
                précédentes.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Chat History</b> (historique) – affiche la conversation qui a servi à créer
                l’indicateur.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Download</b> (télécharger) – télécharge un fichier zip contenant les paramètres et les
                données de l’indicateur.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Remove from Dashboard / Add to Dashboard</b> (retirer du / ajouter au tableau de bord)
                – masque l’indicateur dans la liste Indicateurs du tableau de bord, ou l’y affiche de
                nouveau. L’indicateur et ses données sont conservés. La page se recharge pour appliquer
                le changement.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Delete</b> (supprimer) – supprime définitivement l’indicateur et toutes ses données.
                Pour confirmer, saisissez l’identifiant de l’indicateur indiqué dans la fenêtre et
                cliquez sur <b>Delete</b>. Cette action est irréversible.
              </Typography>
            </li>
          </ul>
          <div className={classes.sideBySideFigure}>
            {figure(AIListTabImage, 'Onglet Liste avec un indicateur déplié',
                'L’onglet Liste avec un indicateur déplié : ses détails et ses boutons.',
                classes.screenshotPanel)}
          </div>
        </div>
        <Typography className={classes.contentText}>
          Les boutons <b>Chat History</b>, <b>Download</b>, <b>Remove from Dashboard</b> et
          <b> Delete</b> ne sont disponibles que pour les indicateurs <i>Custom</i>. Utilisez
          <b> Backup All</b> (tout sauvegarder) en haut de l’onglet pour télécharger un fichier zip
          contenant les paramètres, les fichiers de données et l’historique des conversations de tous
          les indicateurs.
        </Typography>

        <Typography variant="subtitle1" id="ai-add-tab" className={sectionClass}>
        4.2 Onglet Ajouter – ajouter un nouvel indicateur
        </Typography>
        <Typography className={classes.contentText}>
          L’onglet <b>Ajouter</b> vous guide pour transformer un fichier de données en un nouvel indicateur
          du tableau de bord.
        </Typography>
        <div className={classes.sideBySide}>
          <ul className={`${classes.ul} ${classes.sideBySideText}`}>
            <li>
              <Typography className={classes.contentText}>
                <b>Envoyer un fichier</b> – glissez-déposez un fichier CSV ou Excel (<i>.csv</i>,
                <i> .xlsx</i> ou <i>.xls</i>) sur la zone d’envoi, ou cliquez sur la zone pour choisir un
                fichier. L’assistant répond avec le nombre de lignes et de colonnes, le nom des
                colonnes, le nom des feuilles (pour les fichiers Excel), les problèmes éventuels et un
                aperçu des premières lignes.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Lancer l’intégration</b> – cliquez sur <b>Start Onboarding</b>. Si le fichier
                nécessite un traitement particulier, vous pouvez d’abord saisir des instructions dans la
                zone de texte (par exemple la colonne qui contient les valeurs ou la feuille à utiliser)
                puis cliquer sur envoyer.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Répondre à l’assistant</b> – l’assistant vérifie le fichier et affiche des
                formulaires pour les paramètres de l’indicateur, comme son nom, ses sous-groupes et son
                thème de couleurs. Remplissez chaque formulaire et validez-le ; le bouton de validation
                devient actif une fois les champs obligatoires remplis. Vous pouvez aussi saisir des
                réponses ou des corrections dans la zone de texte. Appuyez sur <b>Enter</b> pour
                envoyer un message et sur <b>Shift+Enter</b> pour aller à la ligne. Une barre de
                progression indique ce que fait l’assistant pendant qu’il travaille.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Envoyer un autre fichier</b> – cliquez sur le bouton en forme de nuage à côté du
                bouton d’envoi pour afficher de nouveau la zone d’envoi.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Ajouter au tableau de bord</b> – une fois l’indicateur créé, cliquez sur <b>Add to
                Dashboard</b>. La page se recharge, et le nouvel indicateur apparaît dans la liste
                Indicateurs de la barre d’outils de la carte ainsi que dans l’onglet <b>Liste</b>. Le
                rechargement ferme le panneau et efface la conversation de l’onglet <b>Ajouter</b>.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Recommencer</b> – cliquez sur le bouton <b>New session</b> (nouvelle session : la
                bulle avec un signe plus) à côté du bouton d’envoi pour effacer la conversation et
                envoyer un autre fichier.
              </Typography>
            </li>
          </ul>
          <div className={classes.sideBySideFigure}>
            {figure(AIAddTabImage, 'Onglet Ajouter après l’envoi d’un fichier CSV',
                'L’onglet Ajouter après l’envoi d’un fichier CSV : le résumé du fichier, un aperçu des premières lignes et le bouton Start Onboarding.',
                classes.screenshotPanel)}
          </div>
        </div>

        <Typography variant="subtitle1" id="ai-analyze-tab" className={sectionClass}>
        4.3 Onglet Analyser – poser des questions sur les données
        </Typography>
        <Typography className={classes.contentText}>
          L’onglet <b>Analyser</b> est une conversation dans laquelle vous pouvez poser des questions
          sur les indicateurs en langage courant, par exemple quelles zones ont les valeurs les plus
          élevées, comment un indicateur a évolué entre deux années ou comment deux indicateurs se
          comparent. Les réponses peuvent contenir des tableaux et des graphiques. Vous pouvez poser
          vos questions en français.
        </Typography>
        <div className={classes.sideBySide}>
          <ul className={`${classes.ul} ${classes.sideBySideText}`}>
            <li>
              <Typography className={classes.contentText}>
                <b>Poser une question</b> – saisissez votre question dans la zone en bas de l’onglet et
                appuyez sur <b>Enter</b> ou cliquez sur le bouton d’envoi. Appuyez sur
                <b> Shift+Enter</b> pour aller à la ligne. Vous pouvez poser des questions de suivi dans
                la même conversation.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Sessions précédentes</b> – cliquez sur l’icône d’horloge à droite, juste sous les
                onglets, pour voir vos conversations précédentes, avec leur nombre de messages et leur
                date de dernière mise à jour. Cliquez sur une conversation pour la reprendre, ou sur son
                icône de corbeille puis confirmez pour la supprimer. La dernière conversation que vous
                avez utilisée est rouverte automatiquement lorsque vous revenez sur le tableau de bord.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Resources</b> (ressources) – sous une réponse, cliquez sur <b>Resources</b> pour voir
                les outils utilisés par l’assistant, les scripts qu’il a exécutés, les fichiers qu’il a
                créés et les documents auxquels il s’est référé. Cliquez sur un script ou un document
                pour l’afficher dans un panneau à côté de l’assistant. Les liens vers des fichiers de
                données dans une réponse téléchargent le fichier.
              </Typography>
            </li>
            <li>
              <Typography className={classes.contentText}>
                <b>Nouvelle session</b> – cliquez sur la bulle avec un signe plus à côté du bouton
                d’envoi pour commencer une nouvelle conversation.
              </Typography>
            </li>
          </ul>
          <div className={classes.sideBySideFigure}>
            {figure(AIAnalyzeTabImage, 'Onglet Analyser avec la liste des sessions ouverte et une conversation',
                'L’onglet Analyser : la liste des sessions précédentes (ouverte avec l’icône d’horloge) au-dessus d’une question et de sa réponse.',
                classes.screenshotPanel)}
          </div>
        </div>
        <Typography className={classes.contentText}>
          <b>Exemples de questions</b> – voici quelques questions que vous pouvez copier dans l’onglet
          Analyser et adapter. Précisez l’indicateur, l’année et la zone qui vous intéressent : plus la
          question est précise, meilleure est la réponse.
        </Typography>
        <ul className={classes.promptList}>
          <li>
            <Typography className={classes.contentText}>
              <i>Connaître les données disponibles</i> –{' '}
              <span className={classes.prompt}>Liste tous les indicateurs avec leurs sous-groupes,
              leurs années, leurs mois et leurs niveaux administratifs.</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Classer des zones</i> –{' '}
              <span className={classes.prompt}>Quels sont les 10 districts où les besoins non
              satisfaits en planification familiale étaient les plus élevés en 2020&nbsp;?
              Présente-les dans un tableau avec leur région.</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Étudier une zone</i> –{' '}
              <span className={classes.prompt}>Résume tous les indicateurs pour le district de
              Tambacounda en 2020.</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Évolution dans le temps</i> –{' '}
              <span className={classes.prompt}>Trace l’utilisation des méthodes modernes dans la région
              de Kédougou de 2000 à 2020 sous forme de courbe. Quand a-t-elle le plus
              progressé&nbsp;?</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Comparer des années</i> –{' '}
              <span className={classes.prompt}>Quelles régions ont connu la plus forte variation de
              l’utilisation des méthodes modernes entre 2010 et 2020&nbsp;?</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Comparer des sous-groupes</i> –{' '}
              <span className={classes.prompt}>Compare l’utilisation des méthodes modernes en milieu
              rural et urbain chez les femmes de 15 à 24 ans en 2020 dans un histogramme.</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Comparer des indicateurs</i> –{' '}
              <span className={classes.prompt}>Y a-t-il un lien entre l’utilisation des méthodes
              modernes et les besoins non satisfaits par district en 2020&nbsp;? Montre un nuage de
              points avec une droite de tendance.</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Carte de chaleur</i> –{' '}
              <span className={classes.prompt}>Fais une carte de chaleur des besoins non satisfaits par
              région et par année de 2010 à 2020.</span>
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <i>Vos propres indicateurs</i> –{' '}
              <span className={classes.prompt}>Quels districts ont la plus grande population de
              district sanitaire&nbsp;? Montre les 10 premiers dans un histogramme.</span>
            </Typography>
          </li>
        </ul>
        <Typography className={classes.contentText}>
          <b>Remarque :</b> l’assistant IA ne donne pas toujours la réponse attendue. Vérifiez les
          résultats, et ajoutez du contexte ou des précisions si nécessaire.
        </Typography>
        <Typography className={classes.contentText}>
          Si une réponse ne correspond pas à ce que vous attendiez, posez une question de suivi dans la
          même conversation, par exemple{' '}<span className={classes.prompt}>Garde uniquement la
          région de Tambacounda</span>{' '}ou{' '}<span className={classes.prompt}>Affiche-le plutôt
          sous forme d’histogramme</span>.
        </Typography>
        <Typography className={classes.contentText}>
          <b>Réutiliser une question</b> – lorsqu’une réponse vous convient après plusieurs questions
          de suivi, vous pouvez demander à l’assistant IA de regrouper vos questions en une seule
          question finale, que vous pourrez réutiliser la prochaine fois. Une telle question peut être
          très détaillée, par exemple :
        </Typography>
        <Typography component="div" className={classes.promptBlock}>
          Crée une carte de chaleur des indicateurs de planification familiale par district
          (Admin 2) pour 2020, avec le sous-groupe <i>all</i>. Inclus l’utilisation des méthodes
          modernes, l’utilisation des méthodes traditionnelles et les besoins non satisfaits. Avant de
          tracer la carte, vérifie si les valeurs pred de chaque indicateur sont sur une échelle de
          pourcentage de 0 à 100 (max &gt; 1) ou sur une échelle de proportion de 0 à 1. Si les valeurs
          dépassent 1, divise-les par 100 pour ramener tous les indicateurs sur une échelle de 0 à 1.
          Trie les districts selon leur utilisation des méthodes modernes (la plus faible en haut).
          Utilise une palette rouge-jaune-vert (RdYlGn), inversée pour les besoins non satisfaits afin
          que le vert corresponde toujours à la meilleure valeur, avec le pourcentage indiqué dans
          chaque cellule. Affiche les données manquantes (cellules grises) lorsqu’un indicateur n’est
          pas disponible pour un district.
        </Typography>

        <Typography variant="h6" id="indicator-settings" className={sectionClass}>
        5. Paramètres
        </Typography>
        <Typography className={classes.contentText}>
          La fenêtre <b>Paramètres</b> comporte un onglet <b>Indicateurs</b>, qui permet de modifier
          la façon dont chaque indicateur est listé et affiché, par exemple son thème de couleurs, son nombre de
          décimales, son unité ou son type de graphique.
        </Typography>
        <Typography className={classes.contentText}>
          <b>Remarque :</b> les modifications faites dans l’onglet <b>Indicateurs</b> sont enregistrées
          sur le serveur. Elles sont conservées après un rechargement de la page et s’appliquent à
          toutes les personnes qui utilisent ce tableau de bord.
        </Typography>
        {figure(SettingsMenuImage, 'Le menu avec l’option Paramètres',
            'Ouvrez le menu en haut à gauche de la page et choisissez Paramètres.',
            classes.screenshotHeader)}
        <ul className={classes.ul}>
          <li>
            <Typography className={classes.contentText}>
              <b>Ouvrir les paramètres</b> – cliquez sur le <b>menu</b> (les trois traits) en haut à
              gauche de la page, puis choisissez <b>Paramètres</b>. La fenêtre Paramètres s’ouvre sur
              l’onglet <b>Indicateurs</b>.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Choisir un indicateur</b> – sélectionnez un indicateur dans la liste
              <b> Indicator</b> en haut. La liste affiche l’identifiant de chaque indicateur, avec à
              droite son unité. Les paramètres actuels de l’indicateur
              s’affichent ensuite en dessous. Les noms des paramètres sont pour l’instant en anglais.
            </Typography>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Modifier les paramètres</b> – changez les valeurs voulues. Survolez l’icône
              <b> i</b> à côté d’un paramètre pour voir à quoi il sert. Les paramètres comprennent :
            </Typography>
            <ul className={classes.ul2}>
              <li>
                <Typography className={classes.contentText}>
                  <i>Place dans la liste</i> – <b>Indicator group</b> est la catégorie sous laquelle
                  l’indicateur apparaît dans la liste Indicateurs de la barre d’outils de la carte, et
                  <b> Group order</b> sa position dans cette catégorie. Un indicateur dont le groupe
                  est <i>(none)</i> apparaît sous <i>Other</i>.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <i>Affichage des valeurs</i> – <b>Map theme</b> (l’échelle de couleurs par défaut,
                  voir la section 2), <b>Multiplier</b> (par exemple 100 pour afficher des proportions
                  en pourcentages), <b>Decimal places</b> (nombre de décimales), <b>Unit suffix</b>{' '}
                  (suffixe d’unité, par exemple <i>%</i>) et <b>Use average</b> (calculer la moyenne
                  des valeurs mensuelles au lieu de les additionner lorsque Month est réglé sur
                  Tous).
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <i>Libellés</i> – <b>Unit label</b>, <b>Map label</b>, <b>Legend label</b> et
                  <b> Y-axis label</b> définissent le texte utilisé dans les fenêtres de survol, la
                  légende et les graphiques. Ils prennent des identifiants de messages issus des
                  fichiers de traduction du tableau de bord : le texte suit donc la langue
                  sélectionnée. <b>Data source (English)</b> et <b>Data source (French)</b> définissent
                  la source des données affichée dans le coin inférieur gauche de la carte.
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <i>Graphiques</i> – <b>Chart type</b> (<i>line</i>, <i>bar</i> ou <i>stackBar</i>),
                  <b> Main series name</b> (nom de la série principale, aussi affiché dans les fenêtres
                  de survol) et <b>Ignore others series</b> (ignorer les autres séries dans les
                  courbes).
                </Typography>
              </li>
              <li>
                <Typography className={classes.contentText}>
                  <i>Options de carte</i> – <b>Shapefile version</b> (le jeu de limites de zones à
                  utiliser), <b>Raster overlay file</b> (une image superposée à la carte) et <b>Show
                  extra info</b> (une icône d’information sur la carte), dont le texte se saisit dans
                  <b> Extra info (English)</b> et <b>Extra info (French)</b>.
                </Typography>
              </li>
            </ul>
          </li>
          <li>
            <Typography className={classes.contentText}>
              <b>Enregistrer</b> – cliquez sur <b>Save</b> pour appliquer vos modifications. Le bouton
              n’est actif que si vous avez modifié quelque chose. Les modifications sont enregistrées
              sur le serveur, un message <i>Saved.</i> s’affiche à côté du bouton, et le tableau de
              bord utilise immédiatement les nouveaux paramètres. Pour revenir à la valeur par défaut
              d’un paramètre, videz le champ (ou choisissez <i>(default)</i>) et cliquez sur
              <b> Save</b>. Fermez la fenêtre avec le <b>X</b> en haut à droite.
            </Typography>
          </li>
        </ul>
        {figure(SettingsDialogImage, 'La fenêtre Paramètres avec un indicateur sélectionné',
            'La fenêtre Paramètres : choisissez un indicateur en haut, modifiez ses paramètres et cliquez sur Save.',
            classes.screenshotDialog)}

      </div>
    </div>);
};

Instructions.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Instructions);
