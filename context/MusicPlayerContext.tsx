import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';

interface Track {
  id: string;
  name: string;
  audio: string;
}

interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  playPreviousTrack: () => void;
  playRandomTrack: (trackList: Track[]) => void;
  hasPreviousTrack: () => boolean;
}

export const MusicPlayerContext = createContext<MusicPlayerContextType>({
  currentTrack: null,
  isPlaying: false,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  playPreviousTrack: () => {},
  playRandomTrack: () => {},
  hasPreviousTrack: () => false,
});

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackHistory, setPlaybackHistory] = useState<Track[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const playTrack = useCallback(async (track: Track) => {
    // Validate the track's audio URL
    if (!track.audio) {
      console.error('Cannot play track: audio URL is null or undefined', track);
      return;
    }

    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      // Load and play the new track
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.audio },
        { shouldPlay: true }
      );
      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);

      // Update playback history
      const newHistory = [...playbackHistory.slice(0, historyIndex + 1), track];
      setPlaybackHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } catch (error) {
      console.error('Error playing track:', error);
      // Reset state on error to prevent invalid sound state
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  }, [sound, playbackHistory, historyIndex]);

  const pauseTrack = useCallback(async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }, [sound]);

  const resumeTrack = useCallback(async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    } else if (currentTrack) {
      // If sound is null but we have a current track, try to replay it
      await playTrack(currentTrack);
    }
  }, [sound, currentTrack, playTrack]);

  const playPreviousTrack = useCallback(async () => {
    if (historyIndex > 0) {
      const previousTrack = playbackHistory[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      await playTrack(previousTrack);
    }
  }, [historyIndex, playbackHistory, playTrack]);

  const playRandomTrack = useCallback(async (trackList: Track[]) => {
    if (trackList.length === 0) {
      console.warn('No tracks available to play');
      return;
    }

    // Filter out tracks with invalid audio URLs
    const validTracks = trackList.filter((track) => track.audio);
    if (validTracks.length === 0) {
      console.warn('No valid tracks with audio URLs available to play');
      return;
    }

    // Pick a random track from the valid tracks
    const randomIndex = Math.floor(Math.random() * validTracks.length);
    const randomTrack = validTracks[randomIndex];
    await playTrack(randomTrack);
  }, [playTrack]);

  const hasPreviousTrack = useCallback(() => {
    return historyIndex > 0;
  }, [historyIndex]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        pauseTrack,
        resumeTrack,
        playPreviousTrack,
        playRandomTrack,
        hasPreviousTrack,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};