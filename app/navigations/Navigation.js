import React from "react";
import {View,Text} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import TabBar from "./TabBar";




export default function Navigation(){
    return(
        <NavigationContainer>
        <TabBar/>
        </NavigationContainer>

    );
}