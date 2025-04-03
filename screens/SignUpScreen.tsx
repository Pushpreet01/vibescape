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
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={[s.container, s.p3, { backgroundColor: '#000', flex: 1 }]}>

        <Text style={[s.textCenter, { color: '#FF5E00', fontSize: 32, fontWeight: 'bold', marginBottom: 20 }]}>
          Sign Up
        </Text>


        <TextInput
          style={[commonStyles.input, { marginBottom: 16 }]}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        

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
        

        <TouchableOpacity
          style={[commonStyles.button, { backgroundColor: '#FF5E00' }]}
          onPress={handleSignUp}
        >
          <Text style={commonStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        
      
        <Text
          style={[s.textCenter, { marginTop: 16, color: '#FF5E00' }]}
          onPress={() => navigation.navigate('Login')}
        >
          Already have an account? Login
        </Text>
      </View>
    </View>
  );
};

export default SignUpScreen;
