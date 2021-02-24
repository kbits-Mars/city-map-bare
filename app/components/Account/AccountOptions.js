import React, {useState} from "react";
import {StyleSheet, View, Text} from "react-native";
import {ListItem} from "react-native-elements";
import {map} from "lodash";
import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";


export default function AccountOptions(props){

    const {userInfo,toastRef,setReloadUserInfo}= props;
    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);
    

   const SelectedComponent= (key)=>{
       switch(key){
        case 'displayName':
            setRenderComponent(
                <ChangeDisplayNameForm 
                 DisplayName= {userInfo.displayName}
                 setShowModal={setShowModal}
                 toastRef={toastRef}
                 setReloadUserInfo={setReloadUserInfo}
                />
            )
            
            setShowModal(true);

        break;

        case 'email':
             
              setRenderComponent(
                <ChangeEmailForm
                  email={userInfo.email}
                  setShowModal={setShowModal}
                  toastRef={toastRef}
                  setReloadUserInfo={setReloadUserInfo}

                />

              )
              setShowModal(true);

        break;

        case 'password':
             
              setRenderComponent(
                <ChangePasswordForm
                 setShowModal={setShowModal}
                 toastRef={toastRef}
                  
                />
              )
            setShowModal(true);

        break;

        default: 
          setRenderComponent(null);
          setShowModal(false);
          break;

       }

   }

   const menuList= optionsList(SelectedComponent);
    
    return(
        <View>
            {map(menuList,(menu,index)=>(
                <ListItem
                key={index}
                title={menu.title}
                leftIcon={{
                     name: menu.iconNameLeft,
                     type: menu.iconType,
                     color: menu.iconColorLeft
                     
                }}

                rightIcon={{
                    name: menu.iconNameRight,
                    type: menu.iconType,
                    color: menu.iconColorRight
                }}

                containerStyle={styles.menuList}
                onPress={menu.onPress}
                />
            ))}
            {renderComponent && (
                    <Modal isVisible={showModal} setIsVisible={setShowModal}>
                        {renderComponent}
                    </Modal>
             )}
            
        </View>
        
    );


}

function optionsList(SelectedComponent){
    return[
        {
            title: "Cambiar Nombre y Apellidos",
            iconType: "material-community",
            iconNameLeft:"account-circle",
            iconColorLeft: "#cccc",
            iconNameRight: "chevron-right",
            iconColorRight:"#cccc",
            onPress: ()=> SelectedComponent("displayName")
        

        },
        {
            title: "Cambiar correo electronico",
            iconType: "material-community",
            iconNameLeft:"at",
            iconColorLeft: "#cccc",
            iconNameRight: "chevron-right",
            iconColorRight:"#cccc",
            onPress: ()=> SelectedComponent("email")
        },
        {
            title:"Cambiar Contraseña",
            iconType: "material-community",
            iconNameLeft:"lock",
            iconColorLeft: "#cccc",
            iconNameRight: "chevron-right",
            iconColorRight:"#cccc",
            onPress: ()=> SelectedComponent("password")
        }
    ]
}

const styles = StyleSheet.create({
    menuList:{
        borderBottomWidth: 2,
        borderBottomColor:"#e3e3e3",
       
         
    }
})