import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import { commonStyles } from '../src/styles';

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
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={[s.container, s.p3, { backgroundColor: '#000', flex: 1 }]}>
        <Text style={[s.textCenter, { color: '#FF5E00', fontSize: 32, fontWeight: 'bold', marginBottom: 20 }]}>
          Login
        </Text>
        <TextInput
          style={[commonStyles.input, { marginBottom: 16 }]}
          placeholder="Email or Username"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[commonStyles.input, { marginBottom: 16 }]}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={[s.textCenter, s.mb2, { color: '#FF5E00' }]}>Forgot Password?</Text>
        <TouchableOpacity
          style={[commonStyles.button, { backgroundColor: '#FF5E00' }]}
          onPress={handleLogin}
        >
          <Text style={commonStyles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text
          style={[s.textCenter, { marginTop: 16, color: '#FF5E00' }]}
          onPress={() => navigation.navigate('SignUp')}
        >
          or Sign Up
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
