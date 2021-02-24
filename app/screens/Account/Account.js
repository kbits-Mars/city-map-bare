import React, { useState, useEffect } from "react";
//import { View, Text } from "react-native";
import Loading from "../../components/Loading";

import * as firebase from "firebase";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";

export default function Cuenta() {
  const [login, setLogin] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      //console.log(user);

      !user ? setLogin(false) : setLogin(true); // NUll(vacio) lo toma como true y True(logeado,lleno)lo toma como False
    });
  }, []);

  if (login === null) return <Loading isVisible={true} text="Cargando.." />;

  return login ? <UserLogged /> : <UserGuest />;
}
