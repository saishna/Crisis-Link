import React, { useState } from "react";
import {View , Text,Image,StatusBar } from 'react-native';

export default function LoginScreen(){
    return(
        <View >
          <StatusBar 
        backgroundColor="#ffffff" // Set background to white
        barStyle="dark-content" // Dark icons for visibility
        translucent={true} // Let the background image show through the status bar
      />
            <Text>signupScreen</Text>

        </View>
    )
}