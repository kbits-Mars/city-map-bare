import React, {useState,useEffect,useRef} from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import Toast from "react-native-easy-toast";
import { Button } from "react-native-elements";
import ListTopRestaurant from "../components/Rating/ListTopRestaurant"
// import {NavigationHelpersContext, useNavigation} from "@react-navigation/native";
import firebaseApp from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db= firebase.firestore(firebaseApp);

export default function Mejores(props){
    const {navigation}= props;
    const [restaurants, setRestaurants] = useState(null);
    const toastRef = useRef(null);
     
  

    useEffect(() => {

      db.collection("restaurants")
      .orderBy("rating", "desc")
      .limit(5)
      .get()
      .then((response)=>{

        arrayRestaurants=[];

        response.forEach((doc)=>{
            const data = doc.data();
            data.id= doc.id;
            arrayRestaurants.push(data);
        })

          setRestaurants(arrayRestaurants);

      })

    }, [])

    return(

            <ScrollView centerContent={true} style={styles.viewBody}>
             
             <ListTopRestaurant restaurants={restaurants} navigation={navigation}/>

              <Toast ref={toastRef}   position={"center"}   opacity={0.9}/>

            </ScrollView>
        
    );
}

const styles = StyleSheet.create({
    viewBody: {
      marginLeft: 30,
      marginRight: 30,
    },
  
   
  });
  