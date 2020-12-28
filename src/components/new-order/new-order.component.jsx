import React, { useEffect, useState, useRef, useContext } from "react";

import CustomButton from "../custom-button/custom-button.component";
import FormInput from "../form-input/form-input.component";
import QrScanner from "../qr-scanner/qr-scanner.component";
import FormContainer from "../form-container/form-container.component";
import { Context } from "../intl-wrapper/intl-wrapper.component";

import { newOrder, getRate, getLimits } from "../../api/buy-bch.api";

import { useIntl } from "react-intl";

import qrCode from "../../assets/qrCode.png";

import "../form.styles.scss";
import "./new-order.styles.scss";

function NewOrder({ setOrder, setErrorMessage, setLoading }) {
  const [bgn, setBgn] = useState("");
  const [email, setEmail] = useState("");
  const [bchState, setBchState] = useState({
    bchAddress: "",
    showQr: false,
  });
  const [bch, setBch] = useState("");
  const [min, setMin] = useState(0.1);
  const [max, setMax] = useState(9999);

  const context = useContext(Context);

  const didMount = useRef(false);

  const intl = useIntl();

  useEffect(() => {
    if (didMount.current) {
      const timeOutId = setTimeout(async () => {
        const response = await getRate(bgn);
        if (response.errorId) {
          setErrorMessage(response.errorId);
        } else {
          setBch(response);
        }
      }, 1000);
      return () => clearTimeout(timeOutId);
    } else {
      didMount.current = true;
    }
  }, [bgn, setErrorMessage]);

  useEffect(() => {
    const retrieveLimitsFromBackend = async () => {
      const response = await getLimits();
      if (!response.errorId) {
        setMin(response["bgn_amount_min"]);
        setMax(response["bgn_amount_max"]);
      }
    };
    retrieveLimitsFromBackend();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await newOrder(
      bgn,
      bchState.bchAddress,
      email,
      context.locale
    );
    setLoading(false);
    if (response.order) {
      localStorage.setItem("orderId", response.order.id);
      setOrder(response.order);
    } else if (response.errorId) {
      setErrorMessage(response.errorId, response.errorMessage);
    }
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangeBchAddress = (event) => {
    setBchState({ ...bchState, bchAddress: event.target.value });
  };

  const handleChangeBgn = (event) => {
    setBgn(event.target.value);
  };

  if (bchState.showQr) {
    return <QrScanner setBchState={setBchState} />;
  }

  const checkbox = (name, textId, urlToRender) => {
    return (
      <div className="group checkbox">
        <input type="checkbox" required name={name} />
        <label>
          {intl.formatMessage(
            {
              id: textId,
            },
            {
              a: (url) => <a href={urlToRender}>{url}</a>,
            }
          )}
        </label>
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormInput
          name="email"
          type="email"
          handleChange={handleChangeEmail}
          value={email}
          label={intl.formatMessage({ id: "order.email" })}
          required
        />
        <FormInput
          name="bchAddress"
          type="text"
          handleChange={handleChangeBchAddress}
          value={bchState.bchAddress}
          label={intl.formatMessage({ id: "order.bchAddress" })}
          required
          containerClasses="qr-code-container"
          children={
            <img
              alt="Scan QR Code"
              src={qrCode}
              onClick={(e) => {
                e.preventDefault();
                setBchState({ ...bchState, showQr: true });
              }}
            ></img>
          }
        />

        <FormInput
          name="bgn"
          type="number"
          step="any"
          handleChange={handleChangeBgn}
          value={bgn}
          label={intl.formatMessage({ id: "order.bgnAmount" })}
          required
          max={max}
          min={min}
        />
        <FormInput
          name="bch"
          type="text"
          value={bch ? bch.toString() : ""}
          label={intl.formatMessage({ id: "order.bchAmount" })}
          readOnly
        />
        {checkbox(
          "termsConditions",
          "order.termAndConditions",
          process.env.REACT_APP_TERMS_AND_CONDITIONS_URL
        )}
        {checkbox(
          "exchangeRateTerms",
          "order.exchangeRateTerms",
          process.env.REACT_APP_EXCHANGE_RATE_TERMS_URL
        )}

        <div className="buttons">
          <CustomButton type="submit">
            {intl.formatMessage({ id: "order.buyButton" })}
          </CustomButton>
        </div>
      </form>
    </div>
  );
}

export default FormContainer(NewOrder);
