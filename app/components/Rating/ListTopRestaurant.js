
import React, {useState, useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Card,Image,Rating, Icon} from "react-native-elements";

export default function ListTopRestaurant(props) {
    const {navigation, restaurants} = props;

    return (
        <View>
            <FlatList
             
             data={restaurants}
             renderItem={(restaurant)=>(

                <RestaurantRender  restaurant={restaurant} navigation={navigation}/>
             )}
             keyExtractor={(item, index)=> index.toString()}
            />
        </View>
    )
}


function RestaurantRender(props){

    const {restaurant,navigation}= props;
    const {name, images,rating,description,id}= restaurant.item;
    const [colorChange, setColorChange] = useState("#000");

    useEffect(() => {
       
        if(restaurant.index=== 0){
            setColorChange("#efb819");
        }else if(restaurant.index===1){

            setColorChange("#e3e4e5");
        }else if(restaurant.index===2){
            setColorChange("#cd7f32");
        }else if(restaurant.index===3){
            setColorChange("#F97666");
        }

    }, [])


    return(
        <View>

            <TouchableOpacity 
            onPress={()=>{
                navigation.navigate("restaurants",{screen: "restaurant", params: {id,name}})
            }}
            >
              <Card containerStyle={styles.containerCard}>
               <Icon
               type="material-community"
               name= "chess-queen"
               color={colorChange}
               size={40}
               containerStyle={styles.containerIcon}
               />

               <Image
                 style={styles.image}
                 
                 source={
                    images[0] ? {uri:images[0] } : require("../../../assets/img/no-image.png")
                 }
            
               />

            <View style={styles.titleRating}>
          <Text style={styles.title}>{name.substr(0, 15)}..</Text>
          <Rating imageSize={20} startingValue={rating} readonly />
        </View>
        <Text style={styles.description}>{description}</Text>

              </Card>
            </TouchableOpacity>
        </View>
    );
}



const styles = StyleSheet.create({
    containerCard:{
        marginBottom:30,
        borderWidth: 0,

    },
    containerIcon:{
        position: "absolute",
        top: -30,
        left:-30,
        zIndex: 1

    },
    image:{
        width:"100%",
        height: 200,
    },
    titleRating: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
      },
      title: {
        fontSize: 20,
        fontWeight: "bold",
      },
      description: {
        color: "grey",
        marginTop: 0,
        textAlign: "justify",
      },

}) 