import React, {useState, useCallback, useRef} from "react";
import {View,Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity,Alert,Image} from "react-native";
import {Icon, Button} from "react-native-elements";
import {useFocusEffect} from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import firebaseApp from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Loading from "../components/Loading";

const db = firebase.firestore(firebaseApp);



export default function Favoritos(props){

    const {navigation}= props;

    const [restaurant, setRestaurant] = useState(null);
    const [userLogged, setUserLoggued] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reloadData, setReloadData] = useState(false);
    const toastRef = useRef();
    console.log(restaurant);

    firebase.auth().onAuthStateChanged((user)=>{

        (user) ? setUserLoggued(true) : setUserLoggued(false);

    })

    useFocusEffect(
        useCallback(() => {
          if (userLogged) {
            const idUser = firebase.auth().currentUser.uid;
            db.collection("favoritos")
              .where("idUser", "==", idUser)
              .get()
              .then((response) => {
                const idRestaurantsArray = [];
                response.forEach((doc) => {
                  idRestaurantsArray.push(doc.data().idRestaurant);
                });
                getDataRestaurant(idRestaurantsArray).then((response) => {
                  const restaurants = [];
                  response.forEach((doc) => {
                    const restaurant = doc.data();
                    restaurant.id = doc.id;
                    restaurants.push(restaurant);
                  });
                  setRestaurant(restaurants);
                });
              });
          }
          setReloadData(false);
        }, [userLogged, reloadData])
      );

      const getDataRestaurant = (idRestaurantsArray) => {
        const arrayRestaurants = [];
        idRestaurantsArray.forEach((idRestaurant) => {
          const result = db.collection("restaurants").doc(idRestaurant).get();
          arrayRestaurants.push(result);
        });
        return Promise.all(arrayRestaurants);
      };


      if (!userLogged) {
        return <UserNoLogged navigation={navigation} />;
      }


      if (restaurant?.length === 0) {
        return <NotFoundRestaurants />;
      }
     

    return(

        <View style={styles.viewBody}>
        {restaurant ? (
          <FlatList
            data={restaurant}
            renderItem={(res) => (
              <Restaurant
                restaurant={res}
                setIsLoading={setIsLoading}
                toastRef={toastRef}
                setReloadData={setReloadData}
                navigation={navigation}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={styles.loaderRestaurants}>
            <ActivityIndicator size="large" />
            <Text style={{ textAlign: "center" }}>Cargando restaurantes</Text>
          </View>
        )}

        <Toast ref={toastRef} position="center" opacity={0.9}/>
        <Loading  text="Eliminado restaurante"  isVisible={isLoading}/>
  
      </View>
    );
}


function NotFoundRestaurants() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Icon type="material-community" name="alert-outline" size={50} color="#E30000" />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          No tienes restaurantes en tu lista
        </Text>
      </View>
    );
  }

  function UserNoLogged(props) {
    const { navigation } = props;
  
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Icon type="material-community" name="alert-outline" size={50} color="#E30000"/>
        <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
          Necesitas estar logeado para ver esta sección
        </Text>
        <Button
          title="Ir al login"
          containerStyle={{ marginTop: 20, width: "80%" }}
          buttonStyle={{ backgroundColor: "#F97666" }}
          onPress={() => navigation.navigate("account", { screen: "login" })}
        />
      </View>
    );
  }


  function Restaurant(props) {
    const {
      restaurant,
      setIsLoading,
      toastRef,
      setReloadData,
      navigation,
    } = props;
    const { id, name, images } = restaurant.item;

    const confirmRemoveFavorite = () => {
        Alert.alert(
          "Eliminar Restaurante de Favoritos",
          "¿Estas seguro de que quieres eliminar el restaurante de favoritos?",
          [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Eliminar",
              onPress: removeFavorite,
            },
          ],
          { cancelable: false }
        );
      };
    
      const removeFavorite = () => {
        setIsLoading(true);
        db.collection("favoritos")
          .where("idRestaurant", "==", id)
          .where("idUser", "==", firebase.auth().currentUser.uid)
          .get()
          .then((response) => {
            response.forEach((doc) => {
              const idFavorite = doc.id;
              db.collection("favoritos")
                .doc(idFavorite)
                .delete()
                .then(() => {
                  setIsLoading(false);
                  setReloadData(true);
                  toastRef.current.show("Restaurante eliminado correctamente");
                })
                .catch(() => {
                  setIsLoading(false);
                  toastRef.current.show("Error al eliminar el restaurante");
                });
            });
          });
      };
    
  
    return (
        <View style={styles.restaurant}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("restaurants", {
                screen: "restaurant",
                params: { id,name},
              })
            }
          >
            <Image
              resizeMode="cover"
              style={styles.image}
              PlaceholderContent={<ActivityIndicator color="#fff" />}
              source={
                images[0]
                  ? { uri: images[0] }
                  : require("../../assets/img/no-image.png")
              }
            />
            <View style={styles.info}>
              <Text style={styles.name}>{name.substr(0, 28) }...</Text>
              <Icon
                type="material-community"
                name="heart"
                color="#f00"
                containerStyle={styles.favorite}
                onPress={confirmRemoveFavorite}
                underlayColor="transparent"
              />
            </View>
          </TouchableOpacity>
        </View>
      );
}



  const styles = StyleSheet.create({
    viewBody: {
      flex: 1,
      backgroundColor: "#f2f2f2",
    },
    loaderRestaurants: {
      marginTop: 10,
      marginBottom: 10,
    },
    restaurant: {
      margin: 10,
    },
    image: {
      width: "100%",
      height: 180,
    },
    info: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      paddingLeft: 20,
      paddingRight: 40,
      paddingTop: 10,
      paddingBottom: 10,
      marginTop: -30,
      backgroundColor: "#fff",
    },
    name: {
      fontWeight: "bold",
      fontSize: 15,
    },
    favorite: {
      marginTop: -35,
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 100,
    },
  });