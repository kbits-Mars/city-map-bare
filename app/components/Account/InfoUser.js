import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar } from "react-native-elements";
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

const avatarDefault= require('../../../assets/img/avatar-default.jpg');



export default function InfoUser(props) {
  const { userInfo:{photoURL,email,displayName,uid}, toastRef, setLoading,setLoadingText} = props;
    
  const changeImage= async ()=>{
     const resultPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);
     const resultPermissionCameraRoll= resultPermissions.permissions.cameraRoll.status;
     if(resultPermissionCameraRoll == 'denied'){

      toastRef.current.show('Es necesario aceptar los permisos');

     }else{
       const result= await ImagePicker.launchImageLibraryAsync({
         allowsEditing: true,
         aspect: [4,3]
       })

      if(result.cancelled){
         toastRef.current.show("Se ha cancelado la selección de imagenes",3000);
      }else{
         

        updateImage(result.uri).then(()=>
        {
          updatePhotoUrl();
        })
        .catch(()=>{
          toastRef.current.show(' error al actualizar la foto de perfil',3000);
        
        });
      }

     }

  }

  const updateImage= async (uri)=>{
    
    setLoadingText("Actualizando foto de perfil");
    setLoading(true);
  
    const response= await fetch(uri);
    const blob = await response.blob();

    const ref= firebase.storage().ref().child(`avatar/${uid}`);
    return ref.put(blob);
       
  }

  const updatePhotoUrl= ()=>{
   
   
    setLoading(true);
    setLoadingText("Actualizando foto de perfil");
    firebase.
    storage().
    ref(`avatar/${uid}`).
    getDownloadURL().
    then(async (response)=>{
       const update = {
         photoURL: response
       };
       await firebase.auth().currentUser.updateProfile(update);
       setLoading(false);
       toastRef.current.show("Se actualizo correctamente la foto de perfil");
    }).catch(()=>{
      toastRef.current.show(' error al actualizar la foto de perfil',3000);
      
    })
   
  }
  
  return (
    <View style={styles.viewUserInfo}>
      <Avatar
        rounded
        size="large"
        showEditButton
        onEditPress={changeImage}
        containerStyle={styles.userInfoAvatar}
        source={photoURL ? {uri: photoURL} :avatarDefault}
      />
      <View>
        <Text style={styles.displayName}> {displayName ? displayName : "Anónimo"}</Text>
        <Text>{email ? email : 'Social Login'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingTop: 30,
    paddingBottom: 30,
  },
  userInfoAvatar: {
    marginRight: 20,
  },
  displayName:{
      fontWeight: "bold",
      paddingBottom:5,
  }
});
