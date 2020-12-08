import React, { useState } from "react";
import CustomButton from "../custom-button/custom-button.component";
import FormInput from "../form-input/form-input.component";
import { verifyPhoto } from "../../api/buy-bch.api";
import { useIntl } from "react-intl";

import "../form.styles.scss";
import "./photo-verification.styles.scss";

function PhotoVerification({
  orderId,
  setOrder,
  photoSuffix,
  declarationFormUrl,
}) {
  const [photo, setPhoto] = useState(null);
  const [key, setKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const intl = useIntl();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    const response = await verifyPhoto(orderId, photo, photoSuffix);
    if (response.order) {
      setPhoto(null);
      setKey(key === 0 ? 1 + key : key - 1);
      setOrder(response.order);
    } else if (response.errorId) {
      setErrorMessage(intl.formatMessage({ id: response.errorId }));
    }
  };

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setPhoto(img);
    }
  };

  const photoMessageId = () => {
    if (photoSuffix === "id_photo") {
      return "photo.typeId";
    } else if (photoSuffix === "face_photo") {
      return "photo.typeFace";
    } else if (photoSuffix === "declaration_form") {
      return "photo.typeDeclaration";
    }
  };

  return (
    <div className="form-container">
      <p>{intl.formatMessage({ id: photoMessageId() })}</p>
      <form onSubmit={handleSubmit}>
        <FormInput
          name="photo"
          type="file"
          handleChange={handleChange}
          required
          key={key}
        />
        {photo ? (
          <img alt="To upload" src={URL.createObjectURL(photo)} />
        ) : null}
        {declarationFormUrl ? (
          <p>
            {intl.formatMessage(
              {
                id: "photo.declarationUrl",
              },
              {
                a: (url) => <a href={declarationFormUrl}>{url}</a>,
              }
            )}
          </p>
        ) : null}
        <div className="buttons">
          <CustomButton type="submit">
            {intl.formatMessage({ id: "photo.upload" })}
          </CustomButton>
        </div>
      </form>
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
    </div>
  );
}

export default PhotoVerification;