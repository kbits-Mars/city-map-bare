import React,{useState} from "react";
import {View,StyleSheet} from "react-native";
import { Input,Button } from "react-native-elements";
import * as firebase from "firebase";
import {validateEmail} from "../../utils/Validations"
import {reauthenticate} from "../../utils/api.js";

export default function ChangeEmailForm(props){
    const {email,setShowModal,toastRef,setReloadUserInfo}= props;
    // const [newEmail, setNewEmail] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);  
    const [formData, setFormData] = useState(defaultValue());  
    const [showPassword, setShowPassword] = useState(false)
   

    const onChange= (e, type)=>{
         setFormData({...formData, [type]: e.nativeEvent.text})
    }


    const onSubmit= ()=>{
         setErrors({});
        if(!formData.email || email === formData.email){
           
            setErrors({
                email: "El email no ha cambiado"
            });
        
        }else if(!validateEmail(formData.email)){
            setErrors({
                email: "Email Incorrecto",
            })
        }else if(!formData.password){
            setErrors({
                password: "debe poner su contraseña para cambiar el email"
            })
        }else{
            setIsLoading(true);
            reauthenticate(formData.password).then(()=>{
                 firebase.auth()
                 .currentUser.updateEmail(formData.email)
                 .then(()=>{
                     setIsLoading(false);
                     setReloadUserInfo(true);
                     toastRef.current.show("Email actualizado correctamente");
                     setShowModal(false);
                 }).catch(()=>{
                     setErrors({email:"Error al actualizar el email."})
                     setIsLoading(false);
                 })
            }).catch(()=>{
                setIsLoading(false);
                setErrors({password: " La constraseña no es correcta."});
            })
        }
        
    }

    return(
        <View style={styles.view}>
          <Input
          placeholder="email"
          rightIcon={{
              name: "at",
              type: "material-community",
              color: "#c2c2c2"
          }
          }
          containerStyle={styles.input}
          defaultValue={email || ""}
        //   onChange={(e)=> setNewEmail(e.nativeEvent.text)}
        onChange={(e)=>onChange(e,"email")}  
        errorMessage={errors.email}
          />
          <Input
          placeholder="Contraseña"
          containerStyle={styles.input}
          password={true}
          secureTextEntry={showPassword ? false: true}
          rightIcon={{
              type:"material-community",
              name: showPassword ? "eye-off-outline" : "eye-outline",
              color:"#c2c2c2",
              onPress: ()=> setShowPassword(!showPassword)
           }
          }
          onChange={(e)=>onChange(e,"password")}  
          errorMessage={errors.password}
          
          />

          <Button
          title= "Cambiar email"
          buttonStyle= {styles.btn}
          containerStyle={styles.btnContainer}
          onPress={onSubmit}
          loading={isLoading}
          
          
          />

        </View>
    );
}


function defaultValue(){
    return {
        email: "",
        password:"",
    }
}

const styles= StyleSheet.create({
    view:{
    alignItems: "center",
     paddingBottom:10,
     paddingTop:10,
     
    },
    input:{
        marginBottom:10,
    },
  
    btnContainer:{
        marginTop:20,
        width:"95%"

    },
    btn:{
        backgroundColor: "#F97666"
    }

})