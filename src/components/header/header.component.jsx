import React, { useContext } from "react";

import logo from "../../assets/assets_images_poype-logo-light.png";
import { Context } from "../intl-wrapper/intl-wrapper.component";

import { useIntl } from "react-intl";

import "./header.styles.scss";

const languages = {
  bg: "БГ",
  en: "EN",
};

const Header = () => {
  const context = useContext(Context);
  const intl = useIntl();

  const toggleLanguage = () => {
    const language = context.locale === "bg" ? "en" : "bg";
    setLanguage(language);
  };

  const setLanguage = (language) => {
    context.selectLanguage(language);
  };

  const getLanguageClasses = (language) => {
    return context.locale === language ? "option active" : "option";
  };

  return (
    <div className="header-container">
      <a href="https://www.poype.io/">
        <img alt="Poype Logo" className="brand-logo" src={logo} />
      </a>
      <div className="powered-text">
        {intl.formatMessage({ id: "header.heading" })}
      </div>
      <div className="language-phone" onClick={() => toggleLanguage()}>
        {languages[context.locale]}
      </div>
      <div className="language-desktop">
        <div
          className={getLanguageClasses("en")}
          onClick={() => setLanguage("en")}
        >
          {languages.en}
        </div>
        <div
          className={getLanguageClasses("bg")}
          onClick={() => setLanguage("bg")}
        >
          {languages.bg}
        </div>
      </div>
    </div>
  );
};

export default Header;
