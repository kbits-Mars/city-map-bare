import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MyTabBar from "./MyTabBar";
import { Icon } from "react-native-elements";




import RestaurantsStack from "./RestaurantsStack";
import FavoritesStack from "./FavoritesStack";
import SearchStack from "./SearchStack";
import TopStack from "./TopStack";
import AccountStack from "./AccountStack";

const Tab= createBottomTabNavigator();


export default function TabBar(props){
    return (
        <Tab.Navigator
        tabBar= {(props)=> <MyTabBar {...props}/>}
        tabBarOptions={{
            activeTintColor: "orange",
            inactiveTintColor: "black"
        }}
        // screenOptions={({ route }) => ({
        //     /* tabBarIcon: ({ color }) => screenOptions(route, color), */
        //     icon: screenOptions(route)
        //   })}
        >
        <Tab.Screen
         name= "restaurants"
         component= {RestaurantsStack}
         options={{title:"Restaurantes",   icon: <Icon type="material-community" name={"compass-outline"} size={22} /> }}
        />
        <Tab.Screen
         name= "top"
         component= {TopStack}
         options={{title:"Top 5",   icon: <Icon type="material-community" name={"seal"} size={22} /> }}
        />

       
        <Tab.Screen
         name= "search"
         component= {SearchStack}
         options={{title:"Buscar",  icon: <Icon type="material-community" name={"map-search"} size={22} /> }}
        />
        
        <Tab.Screen
         name= "favorites"
         component= {FavoritesStack}
         options={{title:"Favoritos", icon: <Icon type="material-community" name={"star-outline"} size={22} /> }}
        />

        <Tab.Screen
         name= "account"
         component= {AccountStack}
         options={{title:"Cuenta",  icon: <Icon type="material-community" name={"login"} size={22} /> }}
        />
        </Tab.Navigator>
    );
}

// function screenOptions(route) {
//     let iconName;
  
//     switch (route.name) {
//       case "restaurants":
//         iconName = "compass-outline";
//         break;
//       case "favorites":
//         iconName = "star-outline";
//         break;
  
//       case "search":
//         iconName="map-search";
//         break;
  
//       case "top":
//         iconName="google-classroom"
//       break;
//       case "home":
//         iconName="login";
//         break;
//       default:
//         break;
//     }
//     return (
//       <Icon type="material-community" name={iconName} size={22}  />
//     );
//   }