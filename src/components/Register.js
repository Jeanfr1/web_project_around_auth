import React, { useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../utils/auth";
import { FormValidator, formConfigAuth } from "../utils/formValidator";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef();
  const history = useHistory();

  useEffect(() => {
    const formValidator = new FormValidator({
      formElement: formRef.current,
      config: formConfigAuth,
    });
    formValidator.enableValidation();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    auth
      .register(email, password)
      .then(() => {
        setShowModal(true);
        setIsSuccess(true);
        setMessage("Vitória! Você foi registrado com sucesso.");
        setTimeout(() => {
          history.push("/signin");
        }, 1500);
      })
      .catch(() => {
        setShowModal(true);
        setIsSuccess(false);
        setMessage("Ops, algo saiu deu errado! Por favor, tente novamente.");
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setIsSuccess(false);
    setMessage("");
  };

  return (
    <div className="register">
      <p className="register__welcome">Inscrever-se</p>
      <form
        onSubmit={handleSubmit}
        className="auth__form register__form"
        ref={formRef}
      >
        <input
          placeholder="E-mail"
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          className="auth__input register__input"
          required
        />
        <span className="popup__error"></span>
        <input
          name="password"
          type="password"
          value={password}
          id="password"
          onChange={handleChange}
          placeholder="Senha"
          minLength={6}
          className="auth__input register__input"
          required
        />
        <span className="popup__error"></span>
        <div className="register__button-container">
          <button type="submit" className="auth__button register__button">
            Inscrever-se
          </button>
        </div>
      </form>

      <p className="register__signin">
        Já é um membro?{" "}
        <Link className="link" to="/signin">
          Faça o Login aqui!
        </Link>
      </p>
      <InfoTooltip
        isOpen={showModal}
        onClose={closeModal}
        isSuccess={isSuccess}
        message={message}
      />
    </div>
  );
}

export default Register;
