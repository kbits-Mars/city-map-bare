import React from "react";
import {View,Text,StyleSheet, SafeAreaView} from "react-native";
import Tab from "./Tab"

export default function MyTabBar(props){
    const {state:{routes,index:indexState},descriptors,navigation}= props;

    return(
        <SafeAreaView>
            <View style={styles.viewStyle}>
                {
                 routes.map((route,index)=>{
                    const isFocused = indexState === index;
                    const {options}= descriptors[route.key];
                     const onPress=()=>{
                        navigation.navigate(route.name);
                     }
                     return <Tab key={index} title={options.title} icon={options.icon} isFocused={isFocused} onPress={onPress}/>;
                 })
                }
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    viewStyle:{
        flexDirection:"row",
        backgroundColor:"#373A48",
        height: 60,
        justifyContent:"space-around"

    },

})

