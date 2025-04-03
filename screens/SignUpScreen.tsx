import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import { commonStyles } from '../src/styles';

const bootstrap = new BootstrapStyleSheet();
const { s } = bootstrap;

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
      <Text style={commonStyles.title}>Sign Up</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Email or Username"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={commonStyles.button} onPress={handleSignUp}>
        <Text style={commonStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text
        style={commonStyles.linkText}
        onPress={() => navigation.navigate('Login')}
      >
        Already have an account? Login
      </Text>
    </View>
  );
};

export default SignUpScreen;