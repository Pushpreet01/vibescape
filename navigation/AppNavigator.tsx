import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Fontisto, Ionicons } from '@expo/vector-icons';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SearchScreen from '../screens/SearchScreen';
import PlaylistScreen from '../screens/PlaylistScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="Welcome"
    screenOptions={{
      tabBarActiveTintColor: 'Black',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#DEFFD0',
        borderTopWidth: 1,
        borderTopColor: 'black',
      },
    }}
  >
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{
        tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
      }}
    />
    
    <Tab.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{
        tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
      }}
    />
    
    <Tab.Screen
      name="My Playlist"
      component={PlaylistScreen}
      options={{
        tabBarIcon: ({ color }) => <Fontisto name="play-list" size={21} color={color} />,
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;