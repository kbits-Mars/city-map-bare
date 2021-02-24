import React, { useEffect, useState } from "react";
import { Icon, Button } from "react-native-elements";
import { StyleSheet, Alert } from "react-native";
import * as firebase from "firebase";
import * as Facebook from "expo-facebook";

// async function logIn() {
//   try {
//     await Facebook.initializeAsync("2110876572383200");

//     const { type, token } = await Facebook.logInWithReadPermissionsAsync({
//       permissions: ["public_profile"],
//     });
//     if (type === "success") {
//       // Get the user's name using Facebook's Graph API
//       const response = await fetch(
//         `https://graph.facebook.com/me?access_token=${token}`
//       );
//       Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);
//     } else {
//       // type === 'cancel'
//     }
//   } catch ({ message }) {
//     alert(`Facebook Login Error: ${message}`);
//   }
// }
export default function LoginFacebook() {
  return (
    <Button
      title="Iniciar sesión con Facebook"
      onPress={() => loginWithFacebook()}
      buttonStyle={styles.buttonFacebook}
      containerStyle={styles.btnContainerFacebook}
      icon={
        <Icon
          type="material-community"
          name="facebook"
          iconStyle={styles.Facebook}
        />
      }
    />
  );
}

async function loginWithFacebook() {
  //ENTER YOUR APP ID
  try {
    await Facebook.initializeAsync("2110876572383200");
    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ["public_profile"],
    });

    if (type == "success") {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      firebase
        .auth()
        .signInWithCredential(credential)
        .catch((error) => {
          console.log(error);
        });
    }
  } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
  }
}

const styles = StyleSheet.create({
  Facebook: {
    color: "white",
    marginRight: 10,
  },
  buttonFacebook: {
    backgroundColor: "#3b5998",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
  },
  btnContainerFacebook: {
    marginTop: -30,
  },
});
