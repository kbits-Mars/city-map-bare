import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { YellowBox } from 'react-native'
import Navigation from "./app/navigations/Navigation";
import {decode, encode} from "base-64";

import {firebaseApp} from "./app/utils/firebase";
//import * as firebase from "firebase";





YellowBox.ignoreWarnings([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
  'Setting a timer'
])
// ------- END OF WARNING SUPPRESSION

if(!global.btoa) global.btoa=encode;
if(!global.atob) global.atob=decode;

export default function App() {

  /*useEffect(() => {
    firebase.auth().onAuthStateChanged((user)=>{
      console.log(user);
    });
    
  }, []);*/
  return <Navigation/>;
}



