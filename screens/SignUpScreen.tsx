import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../lib/supabase';
import { commonStyles } from '../src/styles';

const SignUpScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      alert(error.message);
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={commonStyles.screenContainer}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 30, 
          left: 1,
          zIndex: 1, // Ensure it appears above other elements
          padding: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require('../assets/back-arrow.png')} // Adjust the path to your image
          style={commonStyles.backArrow}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* VibeScape Logo */}
      <Image
        source={require('../assets/vibescape-logo.png')} // Adjust the path to your image
        style={commonStyles.logo}
        resizeMode="contain"
      />

      {/* Horizontal line */}
      <View style={commonStyles.lineContainer}>
        <View style={commonStyles.circle} />
        <View style={commonStyles.horizontalLine} />
        <View style={commonStyles.circle} />
      </View>

      {/* Full Name Input */}
      <TextInput
        style={[commonStyles.input, { marginBottom: 16 }]}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

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

      {/* Sign Up Button */}
      <TouchableOpacity
        style={commonStyles.button}
        onPress={handleSignUp}
      >
        <Text style={commonStyles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;