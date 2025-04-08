import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../lib/supabase';
import { commonStyles } from '../src/styles';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      navigation.navigate('Main');
    }
  };

  return (
    <View style={commonStyles.screenContainer}>
      {/* VibeScape Logo */}
      <Image
        source={require('../assets/vibescape-logo.png')} // Adjust the path to your image
        style={commonStyles.logo}
        resizeMode="contain"
      />

      {/* Horizontal line*/}
      <View style={commonStyles.lineContainer}>
        <View style={commonStyles.circle} />
        <View style={commonStyles.horizontalLine} />
        <View style={commonStyles.circle} />
      </View>
      
      {/* Email Input */}
      <TextInput
        style={[commonStyles.input, { marginBottom: 16 }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={[commonStyles.input, { marginBottom: 24 }]}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity
        style={commonStyles.button}
        onPress={handleLogin}
      >
        <Text style={commonStyles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* "or" Text */}
      <Text style={commonStyles.orText}>or</Text>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={commonStyles.button}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={commonStyles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;