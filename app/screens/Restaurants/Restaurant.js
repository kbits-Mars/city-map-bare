import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { map } from "lodash";
import { Rating, ListItem, Icon } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import Carousel from "../../components/Carousel";
import { useFocusEffect } from "@react-navigation/native";
import Map from "../../components/Map";

import ListReviews from "../../components/Restaurants/ListReviews";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
  const { navigation, route } = props;
  const { name, id } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();
  navigation.setOptions({ title: name.substr(0, 28) + "..." });
  //console.log(restaurant);

  useFocusEffect(
    useCallback(() => {
      db.collection("restaurants")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data(); // datos del restaurante
          data.id = response.id;
          setRestaurant(data);
          setRating(data.rating);
        });
    }, [])
  );

  useEffect(() => {
    if(userLogged && restaurant){

      db.collection("favoritos")
      .where("idRestaurant","==",restaurant.id)
      .where("idUser","==",firebase.auth().currentUser.uid)
      .get()
      .then((response)=>{
        if(response.docs.length===1){
          setIsFavorite(true);
        }
      }).catch(()=>{
        toastRef.current.show("error al actualizar");
      })

    }
    
  }, [userLogged,restaurant])

  if (!restaurant) return <Loading isVisible={true} text="Cargando..." />;

  firebase.auth().onAuthStateChanged((user)=>{
     
    (user) ? setUserLogged(true) : setUserLogged(false);

  });

  const addFavorites=()=>{
    if(!userLogged){
      toastRef.current.show("Para añadir un restaurante en favoritos debe estar logueado",3000);
    }else{

      const paylodad={
        idUser: firebase.auth().currentUser.uid,
        idRestaurant: restaurant.id
      }

        db.collection("favoritos").
        add(paylodad).
        then(()=>{
          setIsFavorite(true);
          toastRef.current.show("restaurante añadido a favoritos",3000);
        }).catch(()=>{
          toastRef.current.show("error al añadir al restaurante a favoritos",3000);
        })

     
    }

   
  }

  const removeFavorites=()=>{
    db.collection("favoritos")
    .where("idRestaurant","==",restaurant.id)
    .where("idUser","==",firebase.auth().currentUser.uid)
    .get()
    .then((response)=>{
       response.forEach((doc)=>{
              const idFavoritos= doc.id;


              db.collection("favoritos")
              .doc(idFavoritos)
              .delete()
              .then(()=>{
                setIsFavorite(false);
                toastRef.current.show("Se elimino el restaurante en favoritos");
              }).catch(()=>{
       
               toastRef.current.show("error al eliminar el restaurante en favoritos");
              })
       });
     
    })
  }

  return (
    <ScrollView vertical style={styles.viewBody}>
      <View style={styles.viewFavorito}>
        <Icon
         type="material-community"
         name= {(isFavorite) ? "heart" :"heart-outline"}
         color={(isFavorite) ? "#FF0000" : "#000"}
         underlayColor="transparent"
         size= {35}
         onPress= {(isFavorite) ? removeFavorites: addFavorites}
         
        />
      </View>
      <Carousel
        arrayImages={restaurant.images}
        height={250}
        width={screenWidth}
      />
      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={rating}
      />
      <RestaurantInfo
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
        phone={restaurant.phone}
        horario={restaurant.horario}
      />
      <ListReviews navigation={navigation} idRestaurant={restaurant.id} />

      <Toast ref={toastRef} position="center" opacity={0.9}/> 
      
    </ScrollView>
  );
}

function TitleRestaurant(props) {
  const { name, description, rating } = props;

  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameRestaurant}> {name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>

      <Text style={styles.descriptionRestaurant}> {description}</Text>
    </View>
  );
}

function RestaurantInfo(props) {
  const { location, name, address, phone, horario } = props;

  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null,
    },
    {
      text: horario,
      iconName: "clock-outline",
      iconType: "material-community",
      action: null,
    },
    {
      text: phone,
      iconName: "phone",
      iconType: "material-community",
      action: null,
    },
  ];

  return (
    <View style={styles.viewRestauranInfo}>
      <Text style={styles.restaurantInfoTitle}>
        Información sobre el restaurante
      </Text>
      <Map location={location} name={name} height={100} />
      {map(listInfo, (item, index) => (
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#F97666",
          }}
          containerStyle={styles.containerListItem}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewRestaurantTitle: {
    padding: 15,
  },
  nameRestaurant: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionRestaurant: {
    marginTop: 5,
    color: "grey",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  viewRestauranInfo: {
    margin: 15,
    marginTop: 25,
  },
  restaurantInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
  viewFavorito:{
    position:"absolute",
    backgroundColor:"#fff",
    zIndex: 5,
    top: 0,
    right: 0,
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingLeft: 15

  }
});
