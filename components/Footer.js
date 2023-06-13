import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

const Footer = () => {
  return (
    <Tab.Navigator>
    <Tab.Screen name="Home" component={ChatListScreen} />
    <Tab.Screen name="Settings" component={ChatSettingScreen} />
  </Tab.Navigator>
  )
}

export default Footer;

const styles = StyleSheet.create({})