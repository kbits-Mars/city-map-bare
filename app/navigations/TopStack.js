import React from "react";
import {createStackNavigator}  from "@react-navigation/stack";
import Mejores from "../screens/Top";

const Stack = createStackNavigator();

export default function TopStack(){
    return(
       <Stack.Navigator>
           <Stack.Screen
           name="top"
           component={Mejores}
           options={{title:"Top 5"}}
           />
       </Stack.Navigator>
    );
}