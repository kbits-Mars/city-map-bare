import React,{useEffect,useState} from "react";
import {StyleSheet, View, Text, FlatList, Image } from "react-native";
import{SearchBar, ListItem, Icon} from "react-native-elements";
import{ FireSQL} from "firesql";
import firebase from "firebase/app";

const fireSQL= new FireSQL( firebase.firestore(),{includeId: "id"})

export default function Busqueda(props) {
  const{navigation}= props;
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
console.log(restaurants);

  useEffect(() => {
    if(search){
      fireSQL
      .query(`SELECT * FROM restaurants WHERE name Like '${search}%'`)
      .then((response)=>{
        setRestaurants(response);
      })
    }
   
  }, [search])
  return (
    <View>
      <SearchBar
      placeholder= "Busca tu Aula"
      onChangeText={(e)=>setSearch(e)}
      containerStyle={styles.searchBar}
      value= {search}
      />

      {(restaurants.length===0) ? (<NotFoundRestaurants/>) : (
        <FlatList
          data={restaurants}
          renderItem={(restaurant) => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

function Restaurant(props) {
  const { restaurant, navigation } = props;
  const { id, name, images } = restaurant.item;

  return (
    <ListItem
      title={name}
      leftAvatar={{
        source: images[0]
          ? { uri: images[0] }
          : require("../../assets/img/no-image.png"),
      }}
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() =>
        navigation.navigate("restaurants", {
          screen: "restaurant",
          params: { id, name },
        })
      }
    />
  );
}

function NotFoundRestaurants(){
  return(

    <View   style={{ flex: 1 , alignItems: "center"}}>
    <Image

    source= {require("../../assets/img/no-result-found.png")}
    resizeMode="cover"
    style={{width: 250 , height: 250}}
    />

    </View>

  )
}
const styles= StyleSheet.create({
  searchBar:{
    marginBottom: 20,
  }

})