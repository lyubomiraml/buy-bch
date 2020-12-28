import React from "react";

import { useIntl } from "react-intl";

import "./footer.styles.scss";

const Footer = () => {
  const intl = useIntl();

  return (
    <div className="footer">
      <p>
        {intl.formatMessage(
          { id: "footer.footer" },
          {
            a: () => <a href={"https://www.poype.io/"}>POYPE LTD</a>,
            number: "205728837",
            email: "office@poype.io",
            phone: "+359899837405",
          }
        )}
      </p>
    </div>
  );
};

export default Footer;
