import React from 'react';
import './gf-footer.css';
import gfMonogram from '../../image/gf-monogram-light.png';
import idmLogo from '../../image/idmlogo-light.png';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="gf-footer">
      <div className="gf-fcol gf-fbrand">
        <div className="gf-lockup">
          <img className="gf-gfmono" src={gfMonogram} alt="Gates Foundation" />
          <span className="gf-divider" />
          <img className="gf-idmlogo" src={idmLogo} alt="Institute for Disease Modeling" />
        </div>
        <span className="gf-copy">
          &copy; {year} Gates Foundation. All rights reserved.
        </span>
      </div>

      <nav className="gf-fcol gf-flegal" aria-label="Legal">
        <a href="https://www.gatesfoundation.org/Terms-of-Use"
          target="_blank" rel="noopener noreferrer">Terms of use</a>
        <a href="https://www.gatesfoundation.org/Privacy-and-Cookies-Notice"
          target="_blank" rel="noopener noreferrer">Privacy &amp; Cookies</a>
        <a href="mailto:david.kong@gatesfoundation.org">Contact Us</a>
      </nav>
    </footer>
  );
};

export default Footer;
