import React, { useState, useEffect,useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import {useFocusEffect} from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListRestaurants from "../../components/Restaurants/ListRestaurants";



const db = firebase.firestore(firebaseApp);

export default function Restaurantes(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [totalRestaurant, setTotalRestauant] = useState(0);
  const [startRestaurants, setStartRestaurants] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const RestaurantLimit= 10;
 

  

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);


  useFocusEffect(
     useCallback(()=>{

      db.collection("restaurants").get().then((snap)=>{
        setTotalRestauant(snap.size);
       })
  
       const resultRestaurant= [];
  
       db.collection("restaurants").orderBy("createAT","desc").limit(RestaurantLimit).get()
       .then((response)=>{
        setStartRestaurants(response.docs[response.docs.length-1]);
           response.forEach((doc)=>{
            const restaurant= doc.data();
            restaurant.id= doc.id;
            resultRestaurant.push(restaurant);
           })
         setRestaurants(resultRestaurant);
  
      })
    },[])
  );

   


  const handleLoadMore= ()=>{
    const resultRestaurants=[];
    restaurants.length < totalRestaurant && setIsLoading(true);

    db.collection("restaurants")
    .orderBy("createAT", "desc")
    .startAfter(startRestaurants.data().createAT)
    .limit(RestaurantLimit)
    .get()
    .then(response => {
      if(response.docs.length > 0){
        setStartRestaurants(response.docs[response.docs.length-1]);

      }else{
        setIsLoading(false);
      }

      response.forEach((doc)=>{
        const restaurant= doc.data();
        restaurant.id= doc.id;
        resultRestaurants.push(restaurant);
      });

      setRestaurants([...restaurants, ...resultRestaurants]);
    })
  }
  

  return (
    <View style={styles.viewBody}>
      <ListRestaurants
      restaurants= {restaurants}
      handleLoadMore={handleLoadMore}
      isLoading={isLoading}
      />
      {user && (
        <Icon
          reverse
          type="material-community"
          name="plus"
          color="#F97666"
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("add-restaurants")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 }, // width: negativo para que se vaya a la izquierda, height: negativo para que se vaya hacia arriba
    shadowOpacity: 0.5,
  },
});
