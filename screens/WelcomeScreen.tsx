import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { MusicPlayerContext } from '../context/MusicPlayerContext';
import { commonStyles } from '../src/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Constants from 'expo-constants';
import { supabase } from '../lib/supabase';

const WelcomeScreen = () => {
  const { playTrack, pauseTrack, resumeTrack, isPlaying, currentTrack, playPreviousTrack, playRandomTrack, hasPreviousTrack } =
    useContext(MusicPlayerContext);

  const [tracks, setTracks] = useState<any[]>([]); // State to store fetched tracks from Jamendo API
  const [playlistTracks, setPlaylistTracks] = useState<any[]>([]); // State to store user's playlist tracks
  const [error, setError] = useState<string | null>(null); // State to handle errors

  const jamendoClientId = Constants.expoConfig?.extra?.jamendoClientId;

  if (!jamendoClientId) {
    throw new Error('Jamendo Client ID must be provided in the .env file');
  }

  // Fetch 50 tracks from Jamendo API
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(
          `https://api.jamendo.com/v3.0/tracks/?client_id=${jamendoClientId}&format=json&limit=50`
        );
        const data = await response.json();
        if (data.headers.status === 'success') {
          setTracks(data.results);
        } else {
          setError(data.headers.error_message || 'Failed to fetch tracks');
        }
      } catch (error) {
        setError('Error fetching tracks. Please try again later.');
      }
    };

    const fetchPlaylist = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          setPlaylistTracks([]);
          return;
        }

        const userId = userData.user.id;

        const { data, error } = await supabase
          .from('playlists')
          .select('tracks')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching playlist:', error.message);
          setPlaylistTracks([]);
        } else if (data && Array.isArray(data.tracks)) {
          const normalizedTracks = data.tracks.map((track: any) => ({
            id: track.track_id,
            name: track.track_name,
            audio: track.track_url,
          }));
          setPlaylistTracks(normalizedTracks);
        } else {
          setPlaylistTracks([]);
        }
      } catch (error) {
        console.error('Error fetching playlist:', error.message);
        setPlaylistTracks([]);
      }
    };

    fetchTracks();
    fetchPlaylist();
  }, []);

  // Handle loading and error states
  if (error) {
    return (
      <View style={commonStyles.screenContainer}>
        <Text style={commonStyles.title}>Error</Text>
        <Text style={commonStyles.cardText}>{error}</Text>
      </View>
    );
  }

  if (tracks.length === 0) {
    return (
      <View style={commonStyles.screenContainer}>
        <Text style={commonStyles.title}>Loading...</Text>
      </View>
    );
  }

  // Render each item in the FlatList
  const renderSongItem = ({ item }: { item: any }) => {
    const isCurrentlyPlaying = currentTrack?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          commonStyles.card,
          isCurrentlyPlaying && { backgroundColor: '#E0D7E9' },
        ]}
        onPress={() => {
          if (item.audio) {
            playTrack({ id: item.id, name: item.name, audio: item.audio });
          } else {
            alert('This track cannot be played due to a missing audio URL.');
          }
        }}
      >
        <Icon name="music" style={commonStyles.musicNoteIcon} />
        <View style={{ flex: 1 }}>
          <Text style={commonStyles.cardText} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text style={commonStyles.artistText} numberOfLines={1} ellipsizeMode="tail">
            {item.artist_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const playRandomTrackWithFeedback = (trackList: any[]) => {
    if (trackList.length === 0) {
      alert('No tracks in your playlist to play.');
      return;
    }
    playRandomTrack(trackList);
  };

  const playPreviousTrackWithFeedback = () => {
    if (!hasPreviousTrack()) {
      alert('No previous track in history.');
      return;
    }
    playPreviousTrack();
  };

  return (
    <View style={commonStyles.screenContainer}>
      {/* Title */}
      <Text style={commonStyles.title}>Welcome</Text>

      {/* Horizontal line */}
      <View style={commonStyles.lineContainer}>
        <View style={commonStyles.circle} />
        <View style={commonStyles.horizontalLine} />
        <View style={commonStyles.circle} />
      </View>

      {/* FlatList for all 50 songs */}
      <FlatList
        data={tracks}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Bottom Playback Bar */}
      <View style={commonStyles.bottomBar}>
        <Text
          style={commonStyles.bottomBarTrackName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {currentTrack ? currentTrack.name : 'No track playing'}
        </Text>

        <View style={commonStyles.bottomBarControls}>
          <TouchableOpacity onPress={playPreviousTrackWithFeedback}>
            <Icon name="backward" style={commonStyles.bottomBarIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={isPlaying ? pauseTrack : resumeTrack}>
            <Icon
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              style={commonStyles.bottomBarIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => playRandomTrackWithFeedback(playlistTracks)}>
            <Icon name="forward" style={commonStyles.bottomBarIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;