import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';

const bootstrap = new BootstrapStyleSheet();
const { s } = bootstrap;

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
    <View style={[s.container, s.p3, { backgroundColor: '#E6F0FA' }]}>
      <Text style={[s.h3, s.textCenter]}>Login</Text>
      <TextInput
        style={[s.formControl, s.mb2]}
        placeholder="Email or Username"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[s.formControl, s.mb2]}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={[s.textCenter, s.mb2]}>Forgot Password?</Text>
      <Button title="Login" onPress={handleLogin} />
      <Text
        style={[s.textCenter, s.mt2]}
        onPress={() => navigation.navigate('SignUp')}
      >
        or Sign Up
      </Text>
    </View>
  );
};

export default LoginScreen;