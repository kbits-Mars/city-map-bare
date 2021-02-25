import React,{useState} from "react";
import {StyleSheet,View,Text} from "react-native";
import {Input, Button} from "react-native-elements";
import * as firebase from "firebase";
import {size} from "lodash";
import {reauthenticate} from "../../utils/api"



export default function ChangePasswordForm (props){
    const {setShowModal,toastRef}= props;
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordNew, setShowPasswordNew] = useState(false);
    const [showPasswordNewRepeat, setShowPasswordNewRepeat] = useState(false);
    const [formData, setFormData] = useState(defaultValue());
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);


      const onChange=(e, type)=>{
          
          setFormData({...formData, [type]: e.nativeEvent.text})
      }

      const  onSubmit= async ()=>{
          let isSetErrors= true;
          let errorsTemp={}
          setErrors({});
          if(!formData.password || !formData.newPassword || !formData.repeatNewPassword){
            errorsTemp= {
                password: !formData.password ? "La contraseña no puede estar vacia." :"",
                newPassword: !formData.newPassword ? "La contraseña no puede estar vacia.":"",
                repeatNewPassword: !formData.repeatNewPassword ? "La contraseña no puede estar vacia." : ""
            }
          }else if(formData.newPassword !== formData.repeatNewPassword){
                    errorsTemp={
                        newPassword: "Las contraseñas no son iguales",
                        repeatNewPassword: "Las contraseñas no son iguales"
                    }
            }else if( size(formData.newPassword) <6){
                    errorsTemp={
                        newPassword: "La contraseña tiene que ser mayor a 8 caracteres.",
                        repeatNewPassword: "La contraseña tiene que ser mayor a 8 caracteres."
                    }
             }else{
                setIsLoading(true);
                await reauthenticate(formData.password)
                .then(async ()=>{
                   await  firebase
                    .auth()
                    .currentUser
                    .updatePassword(formData.newPassword)
                    .then(()=>{
                        isSetErrors= false;
                        setIsLoading(false);
                        setShowModal(false);
                        firebase.auth().signOut();
                    })
                    .catch(()=> {
                        errorsTemp={
                            other:"La contraseña no se actualizo"
                        };

                        setIsLoading(false);
                        
                    })
                })
                .catch(()=> {
                    errorsTemp={
                        password: "La contraseña es incorrecta"
                    }
                    setIsLoading(false);
                })
             }

             isSetErrors && setErrors(errorsTemp);
      }

    return(
    <View style={styles.view}>
        <Input
        placeholder= {"Contraseña Actual"}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
            type:"material-community",
            name: showPassword ? "eye-off-outline" : "eye-outline",
            color:"#c2c2c2",
            onPress:()=> setShowPassword(!showPassword),
        }}
        containerStyle={styles.Input}
        onChange={e => onChange(e, "password")}
        errorMessage= {errors.password}
        />
        <Input
        placeholder= {"Nueva Contraseña"}
        password={true}
        secureTextEntry={showPasswordNew ? false : true}
        rightIcon={{
            type:"material-community",
            name:showPasswordNew ? "eye-off-outline" : "eye-outline",
            color:"#c2c2c2",
            onPress:()=> setShowPasswordNew(!showPasswordNew),
        }}
        containerStyle={styles.Input}
        onChange={e => onChange(e, "newPassword")}
        errorMessage= {errors.newPassword}
        />
        <Input
        placeholder= {"Repetir Nueva Contraseña"}
        password={true}
        secureTextEntry={showPasswordNewRepeat ? false : true}
        rightIcon={{
            type:"material-community",
            name:showPasswordNewRepeat ? "eye-off-outline" : "eye-outline",
            color:"#c2c2c2",
            onPress:()=> setShowPasswordNewRepeat(!showPasswordNewRepeat),
        }}
        containerStyle={styles.Input}
        onChange={e => onChange(e, "repeatNewPassword")}
        errorMessage= {errors.repeatNewPassword}
        />

        <Button
         title= {"Cambiar Contraseña"}
         containerStyle={styles.containerBtn}
         buttonStyle={styles.btn}
         onPress= {onSubmit}
         loading= {isLoading}
        />
        <Text>{errors.other}</Text>
    </View>
   ); 
}

function defaultValue(){
    return {
        password: "",
        newPassword:"",
        repeatNewPassword:""

    }

}

const styles = StyleSheet.create({
    view:{
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    Input:{
        marginBottom: 10
    },
    containerBtn:{
        marginTop: 20,
        width: "95%"

    },
    btn:{
        backgroundColor: "#F97666"
    }
})