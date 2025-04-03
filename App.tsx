import React from 'react';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <MusicPlayerProvider>
      <AppNavigator />
    </MusicPlayerProvider>
  );
};