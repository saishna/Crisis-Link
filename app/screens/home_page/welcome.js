import React, { useState } from "react";
import {View , Text, Image,Button, TouchableOpacity,StatusBar} from 'react-native';
import tw from 'twrnc';
import Animated,{  FlipInEasyX, FlipOutEasyX,BounceIn, BounceOut ,FadeIn, FadeInLeft, FadeInRight, FadeInUp, FadeOut } from 'react-native-reanimated';
 import background from 'D:/react-expo/crisislink/assets/background.png';

import { useRouter } from 'expo-router';


export default function WelcomeScreen(){
    const router = useRouter();
    
    const handlePress = () => {
       
        router.push("screens/dashboard/home");
      };
    return(
        
        <View style={tw` h-full w-full`}>
             <StatusBar 
        backgroundColor="#ffffff" 
        barStyle="dark-content" 
        translucent={true} 
      />
            <View style={tw`bg-white h-full w-full`} >
                <Animated.Image entering={FadeInRight.duration(100)} 
                style={tw`h-full w-full absolute`} 
                source={background} /> 
                <Animated.Image entering={FlipInEasyX.delay(200).duration(200)} 
                style={tw`h-65 w-3/4 absolute ml-9 `} 
                source={require("D:/react-expo/crisislink/assets/crisislink.png")} /> 
                <Animated.Text entering={BounceIn.delay(300).duration(100).springify().damping(5)} 
                style= {tw `ml-15 pt-85 text-white text-5xl font-bold `}>WELCOME!</Animated.Text>
                
                <Animated.View entering={FadeInLeft.delay(300).duration(100).springify().damping(9)} 
                 style={tw`flex-1 pt-15 items-center `}>
                    <TouchableOpacity style={tw`bg-teal-500 p-2 rounded-6 w-40`} 
                        onPress={handlePress}>
                        <Animated.Text entering={FadeInRight.delay(300).duration(100)}
                         style={tw` ml-4 text-white text-2xl font-bold`}>Dashboard</Animated.Text> 
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View entering={FadeInRight.delay(400).duration(100).springify().damping(9)}
                 style={tw`flex-3  items-center `}>
                    <TouchableOpacity style={tw`bg-teal-500 p-2 rounded-6 w-40`}
                        onPress={() => {router.push("screens/home_page/signup")}}>
                        <Animated.Text entering={FadeInLeft.delay(400).duration(100)}
                        style={tw` ml-6 text-white text-2xl font-bold`}>SIGN UP</Animated.Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
        
    )
}