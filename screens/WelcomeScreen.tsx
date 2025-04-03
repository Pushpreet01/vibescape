import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import { MusicPlayerContext } from '../context/MusicPlayerContext';

const bootstrap = new BootstrapStyleSheet();
const { s } = bootstrap;

const WelcomeScreen = () => {
  const { playTrack, pauseTrack, resumeTrack, isPlaying, currentTrack } =
    useContext(MusicPlayerContext);

  const sampleTrack = {
    id: '123',
    name: 'Sample Song',
    audio: 'https://www.jamendo.com/track/123/sample.mp3', // Replace with actual track URL
  };

  return (
    <View style={[s.container, s.p3, { backgroundColor: '#E6F0FA' }]}>
      <Text style={[s.h3, s.textCenter]}>Welcome!</Text>
      <View style={[s.row, s.mt3]}>
        <TouchableOpacity
          style={[s.btn, s.btnLight, s.m1]}
          onPress={() => playTrack(sampleTrack)}
        >
          <Text>Song 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btn, s.btnLight, s.m1]}>
          <Text>Song 2</Text>
        </TouchableOpacity>
      </View>
      <View style={[s.row, s.positionAbsolute, s.bottom0, s.w100, s.p2]}>
        <TouchableOpacity onPress={pauseTrack}>
          <Text>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resumeTrack}>
          <Text>{isPlaying ? 'Playing' : 'Play'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;