import React, { createContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export const MusicPlayerContext = createContext<any>(null);

export const MusicPlayerProvider = ({ children }: any) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  const playTrack = async (track: any) => {
    const fileUri = `${FileSystem.documentDirectory}${track.id}.mp3`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const uri = fileInfo.exists ? fileUri : track.audio;

    if (sound) await sound.unloadAsync();
    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    setCurrentTrack(track);
    setIsPlaying(true);
    await newSound.playAsync();
  };

  const pauseTrack = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeTrack = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <MusicPlayerContext.Provider
      value={{ playTrack, pauseTrack, resumeTrack, isPlaying, currentTrack }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};
