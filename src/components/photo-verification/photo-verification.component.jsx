import React, { useState } from "react";

import CustomButton from "../custom-button/custom-button.component";
import FormInput from "../form-input/form-input.component";
import FormContainer from "../form-container/form-container.component";
import WebcamCapture from "../webcam/webcam.component";

import { verifyPhoto } from "../../api/buy-bch.api";
import { secondaryButtonClick } from "../../util/util.js";

import webcam from "../../assets/webcam.png";

import { useIntl } from "react-intl";

import "../form.styles.scss";
import "./photo-verification.styles.scss";

function PhotoVerification({
  orderId,
  setOrder,
  photoId,
  declarationFormUrl,
  setErrorMessage,
  setLoading,
}) {
  const [photo, setPhoto] = useState(null);
  const [key, setKey] = useState(0);
  const [showWebcamComponent, setShowWebcamComponent] = useState(false);

  const intl = useIntl();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!photo) {
      setErrorMessage("photo.missing");
    } else {
      setErrorMessage("");
      setLoading(true);
      const response = await verifyPhoto(orderId, photo, photoSuffix());
      setLoading(false);
      if (response.order) {
        setPhoto(null);
        setKey(key === 0 ? 1 + key : key - 1);
        setOrder(response.order);
      } else if (response.errorId) {
        setErrorMessage(response.errorId);
      }
    }
  };

  const photoSuffix = () => {
    if (photoId === "declaration_form_1" || photoId === "declaration_form_2") {
      return "declaration_form";
    }
    return photoId;
  };

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setPhoto(img);
    }
  };

  const photoMessageId = () => {
    if (photoId === "id_photo") {
      return "photo.typeId";
    } else if (photoId === "face_photo") {
      return "photo.typeFace";
    } else if (photoId === "declaration_form_1") {
      return "photo.typeDeclaration1";
    } else if (photoId === "declaration_form_2") {
      return "photo.typeDeclaration2";
    }
  };

  if (showWebcamComponent) {
    return (
      <WebcamCapture
        setPhotoToReturn={(photo) => {
          setPhoto(photo);
          setShowWebcamComponent(false);
        }}
      ></WebcamCapture>
    );
  }

  return (
    <div>
      <p>{intl.formatMessage({ id: photoMessageId() })}</p>
      <form onSubmit={handleSubmit}>
        <FormInput
          name="photo"
          type="file"
          handleChange={handleChange}
          key={key}
          accept="image/*"
          containerClasses="webcam-photo-container"
          children={
            <img
              alt="Use webcam"
              src={webcam}
              onClick={(e) => {
                e.preventDefault();
                setShowWebcamComponent(true);
              }}
            ></img>
          }
        />
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
        {photo ? (
          <img alt="To upload" src={URL.createObjectURL(photo)} />
        ) : null}
        <div className="buttons">
          <CustomButton type="submit">
            {intl.formatMessage({ id: "photo.upload" })}
          </CustomButton>
          <CustomButton
            className="secondary-button"
            onClick={(e) =>
              secondaryButtonClick(
                e,
                intl.formatMessage({ id: "currentOrder.confirmation" })
              )
            }
          >
            {intl.formatMessage({ id: "currentOrder.reset" })}
          </CustomButton>
        </div>
      </form>
    </div>
  );
}

export default FormContainer(PhotoVerification);
