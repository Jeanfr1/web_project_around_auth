import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { useState, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth.js";

function App() {
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({ name: "", about: "" });
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("loggedIn"))
  );
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then(() => {
          setLoggedIn(true);
          setUserEmail(localStorage.getItem("userEmail"));
        })
        .catch((error) => {
          console.error("Erro ao verificar token:", error);
          setLoggedIn(false);
        });
    } else {
      setLoggedIn(false);
    }

    api.getUserInfo().then(setCurrentUser).catch(console.log);

    api
      .getInitialCards()
      .then(setCards)
      .catch((error) => {
        console.error("Erro ao buscar dados dos cartões:", error);
      });
  }, []);

  const handleUpdateUser = (userData) => {
    api
      .editProfile(userData)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch(console.log);
  };

  const handleLogin = (email) => {
    setLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", email);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserEmail("");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userEmail");
  };

  const handleUpdateAvatar = (userData) => {
    api
      .editAvatar(userData)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch(console.log);
  };

  const handleCreateNewCard = (newCardData) => {
    api
      .createNewCard(newCardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(console.log);
  };

  const handleCardDelete = (card) => {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch(console.log);
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch(console.log);
  };

  const closeAllPopups = () => {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setSelectedCard(null);
  };

  return (
    <BrowserRouter>
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Header
            loggedIn={loggedIn}
            userEmail={userEmail}
            handleLogout={handleLogout}
          />
          <Switch>
            <Route path="/signup">
              <Register />
            </Route>
            <Route path="/signin">
              <Login handleLogin={handleLogin} />
            </Route>
            <ProtectedRoute
              path="/"
              loggedIn={loggedIn}
              component={() => (
                <Main
                  cards={cards}
                  onEditAvatarClick={() => setEditAvatarPopupOpen(true)}
                  onEditProfileClick={() => setEditProfilePopupOpen(true)}
                  onAddPlaceClick={() => setAddPlacePopupOpen(true)}
                  onCardClick={setSelectedCard}
                  onCardDelete={handleCardDelete}
                  onCardLike={handleCardLike}
                />
              )}
            />
            <Route path="*">
              <Redirect to="/login" />
            </Route>
          </Switch>
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleCreateNewCard}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <Footer />
        </CurrentUserContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
