import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SearchScreen from '../screens/SearchScreen';
import PlaylistScreen from '../screens/PlaylistScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#FF5E00', // Orange color for selected tab
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{
        tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
      }}
    />
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{
        tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
      }}
    />
    <Tab.Screen
      name="My Playlist"
      component={PlaylistScreen}
      options={{
        tabBarIcon: ({ color }) => <Ionicons name="musical-notes" size={24} color={color} />,
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="SignUp">
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
