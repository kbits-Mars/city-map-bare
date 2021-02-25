import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurantes from "../screens/Restaurants/Restaurants";
import AddRestaurants from "../screens/Restaurants/AddRestaurants";
import Restaurant from "../screens/Restaurants/Restaurant";
import RealidadAumentada from "../screens/Restaurants/AR/RealidadAumentada";
import AddReviewRestaurant from "../screens/Restaurants/AddReviewRestaurant";

const Stack = createStackNavigator();

export default function RestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="restaurants"
        component={Restaurantes}
        options={{ title: "Restaurantes" }}
      />
      <Stack.Screen
        name="add-restaurants"
        component={AddRestaurants}
        options={{ title: "Añadir nuevo restaurante" }}
      />
      <Stack.Screen name="restaurant" component={Restaurant} />
      <Stack.Screen
        name="realidad-aumentada"
        component={RealidadAumentada}
        options={{ title: "Realidad Aumentada" }}
      />
      <Stack.Screen
        name="add-review-restaurant"
        component={AddReviewRestaurant}
        options={{ title: "Nuevo comentario" }}
      />
    </Stack.Navigator>
  );
}
