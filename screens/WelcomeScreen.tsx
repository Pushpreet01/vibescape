import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MusicPlayerContext } from '../context/MusicPlayerContext';
import { commonStyles } from '../src/styles';

const WelcomeScreen = () => {
  const { playTrack, pauseTrack, resumeTrack, isPlaying, currentTrack } =
    useContext(MusicPlayerContext);

  const sampleTrack = {
    id: '123',
    name: 'Sample Song',
    audio: 'https://www.jamendo.com/track/123/sample.mp3', // Replace with actual track URL
  };

  return (
    <View style={commonStyles.screenContainer}>
      <Text style={commonStyles.title}>Welcome!</Text>
      <View style={commonStyles.row}>
        <TouchableOpacity style={commonStyles.button} onPress={() => playTrack(sampleTrack)}>
          <Text style={commonStyles.buttonText}>Song 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.button}>
          <Text style={commonStyles.buttonText}>Song 2</Text>
        </TouchableOpacity>
      </View>
      <View style={commonStyles.row}>
        <TouchableOpacity onPress={pauseTrack}>
          <Text style={commonStyles.buttonText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resumeTrack}>
          <Text style={commonStyles.buttonText}>{isPlaying ? 'Playing' : 'Play'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;
