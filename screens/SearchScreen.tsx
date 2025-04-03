import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import Constants from 'expo-constants';

const bootstrap = new BootstrapStyleSheet();
const { s } = bootstrap;

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<any[]>([]);

  const jamendoClientId = Constants.expoConfig?.extra?.jamendoClientId;

  if (!jamendoClientId) {
    throw new Error('Jamendo Client ID must be provided in the .env file');
  }

  const handleSearch = async () => {
    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${jamendoClientId}&format=json&limit=20&search=${searchQuery}`
    );
    const data = await response.json();
    setTracks(data.results);
  };

  return (
    <View style={[s.container, s.p3, { backgroundColor: '#E6F0FA' }]}>
      <TextInput
        style={[s.formControl, s.mb2]}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={[s.btn, s.btnLight, s.mb2]}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchScreen;