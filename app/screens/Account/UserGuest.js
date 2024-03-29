import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Button } from "react-native-elements";
import {
  NavigationHelpersContext,
  useNavigation,
} from "@react-navigation/native";

export default function UserGuest() {
  const navigation = useNavigation();

  return (
    <ScrollView centerContent={true} style={styles.viewBody}>
      <Image
        source={require("../../../assets/img/logo2.jpg")}
        resizeMode="contain"
        style={styles.image}
      />

      <Text style={styles.title}>Consulta tu perfil</Text>
      <Text style={styles.description}>
        ¿Estas buscando nuevos restaurantes? Busca nuevas opciones de alimentos
        para que puedas disfrutar, obten la ruta para que puedas llegar y
        comenta tu experiencia.
      </Text>

      <View style={styles.viewBtn}>
        <Button
          title="Ver tu perfil"
          buttonStyle={styles.btnStyle}
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("login")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    marginLeft: 30,
    marginRight: 30,
  },

  image: {
    marginTop: 50,
    height: 225,
    width: "100%",
    marginBottom: 40,
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
  },
  viewBtn: {
    flex: 1,
    alignItems: "center",
  },
  btnStyle: {
    backgroundColor: "#F97666",
  },
  btnContainer: {
    width: "70%",
  },
});
