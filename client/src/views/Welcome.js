/* eslint-disable max-len */
import React from 'react';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import {Typography, Button, Box} from '@mui/material';

const styles = ({
  content: {
    minWidth: '48rem',
    maxWidth: '700px',
    width: '70%',
    margin: '5rem auto',
  },
  contentText: {
    fontFamily: '"Roboto condensed","Roboto", "Times", "Helvetica", "Arial", "sans-serif"',
    fontSize: 16,
    textAlign: 'justify',
    textJustify: 'inter-word',
    marginBottom: '1rem',
  },
  titleText: {
    fontFamily: '"Roboto Condensed","Roboto", "Helvetica", "Arial", "sans-serif"',
    margin: '20px 20px 10px 0px',
    fontSize: '1.25rem',
    // color: '#F1815E',
  },
  link: {
    fontFamily: '"Saira Condensed"',
  },
  buttonContainer: {
    marginTop: '2rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
});

const Welcome = ({classes}) => {
  const handleClick = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className={classes.content}>
      <Typography variant="h6" className={classes.titleText}>
        Welcome to the Senegal Malaria Epidemiology & Genomics Dashboard
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        Virtutibus agnoscerem ac substantia se istiusmodi to an. Vox fal dem ipsos cui nolim aliud. Aliquot finitus viamque vis res. Ponderibus imaginabor vix sap alloquendo mea agnoscerem sed. Hoc externis possumus scilicet mentibus hesterna mea jam. Adjuvetis differant conjectus si ei praeterea ex denegante posterius ii. Ima brevi cap sap autho sciam nulla cujus viris nul.
      </Typography>
      <Typography variant="body1" className={classes.contentText}>

        Ha et diligenter devenietur perspicuae indefinite de at scripturis. Otium rem pauca nobis fit quies. Utcunque ut ha universo falsitas et odoratum. Et eo naturalis remotiora ei re recurrunt distincte objectiva eversioni. Hauriantur si expergisci mutationum praemissae re at mo. Usu admovetur ego mem aggredior mentemque potestque.
      </Typography>
      <Typography variant="body1" className={classes.contentText}>

        Imponere tractatu advenire ad superest occurret se quicquam si ha. Nihil solus pappo mo ei. Tum iis rom innata gloria hos quales. Ac sequentium im sufficeret institutum ad permittere at. Aliquis aliarum quaenam at de totaque notitia ob exhibet. Simus tes sae sacra error. Neque nomen ac ad opera is reges gi nobis. Se in objectivae ab is offerendum videbuntur satyriscos. Uno sequor tritam mediam essent eae usu rea.
      </Typography>
      <Typography variant="body1" className={classes.contentText}>

        Non via nia sex praemissae spectentur contingere respondeam. Has scriptis usu corporis physicae. Existentia lor perspicuum sub mutationum agnoscerem vis advertatur. Multo in entis ad rebus tactu oculi ad. Ii in innatis viderer me hominem at ipsemet. Vitro errem im is anima famam se istas. Mea credendas ero persuasum sanguinem vox. Sequeretur uti aut frequenter vul commendare describere. Ex superare aeternum ob connivet ac earumque co. Physicae fenestra obturabo ii is se.
      </Typography>
      <Typography variant="body1" className={classes.contentText}>

        Judicio non ejusdem referam hoc. Audiam debeat per infixa durent ibi mentem. Si ut mali ei duce im esto fert apta. Ego age habet has docti tes cogor locis. Id concipio monendos vi de sentiens at. Ex plerosque in si inhaereat scriptura.
      </Typography>
      <Typography variant="body1" className={classes.contentText}>

        Quodcumque affirmarem secernitur facillimam gi at se. Aperire quatuor facilem nunquam an peccant mo. Conari re debent me ii clarae ob secius potius pileos. Actu more ac is sumi amen quia. Impetus legendo ac ab dicamne. Capacem dispari qua aliquid sic. Alicujus comparem in studiose rationum ad cohiberi deveniri ob. Falsa mem ope multa fieri vulgo porro. At sumi puto ergo duas fuse ha to ideo.
      </Typography>

      <Box className={classes.buttonContainer}>
        <Button variant="contained" onClick={handleClick}>GO</Button>
      </Box>

    </div>
  );
};

Welcome.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Welcome);
