import { useEffect, useRef, useState } from "react";
import { FormValidator, formConfig } from "../utils/formValidator";
import closeIcon from "../images/close-icon.png";

function PopupWithForm({
  title,
  name,
  onSubmit,
  children,
  isOpen,
  onClose,
  button,
}) {
  const formRef = useRef();
  const overlayRef = useRef();

  useEffect(() => {
    if (isOpen) {
      new FormValidator({
        formElement: formRef.current,
        config: formConfig,
      }).enableValidation();
    }
  }, [isOpen]);

  const close = () => {
    onClose();
    formRef.current.reset();
    new FormValidator({
      formElement: formRef.current,
      config: formConfig,
    }).resetValidation();
  };

  const handleCloseClickOverlay = (e) => {
    if (e.target === overlayRef.current) {
      close();
    }
  };

  return (
    <section
      className={`popup ${isOpen ? "popup_opened" : ""} popup_${name}`}
      ref={overlayRef}
      onClick={handleCloseClickOverlay}
    >
      <div className="popup__container">
        <button type="button" className="popup__close-button" onClick={close}>
          <img
            className="popup__close-icon-img"
            src={closeIcon}
            alt="Ícone para fechar o popup"
          />
        </button>
        <h2 className="popup__title">{title}</h2>
        <form
          name={name}
          className={`popup__form popup__form_${name}`}
          ref={formRef}
          noValidate
          onSubmit={onSubmit}
        >
          {children}
          <button type="submit" className="popup__input-submit">
            {button}
          </button>
        </form>
      </div>
    </section>
  );
}

export default PopupWithForm;
