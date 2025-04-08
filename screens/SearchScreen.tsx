import React, { useState, useContext } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { MusicPlayerContext } from '../context/MusicPlayerContext';
import { commonStyles } from '../src/styles';
import Constants from 'expo-constants';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SearchScreen = () => {
  const { playTrack, pauseTrack, resumeTrack, isPlaying, currentTrack, playPreviousTrack, playRandomTrack, hasPreviousTrack } =
    useContext(MusicPlayerContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const jamendoClientId = Constants.expoConfig?.extra?.jamendoClientId;

  if (!jamendoClientId) {
    throw new Error('Jamendo Client ID must be provided in the .env file');
  }

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${jamendoClientId}&format=json&limit=20&search=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      console.log('Jamendo API Response:', data);
      if (data.headers.status === 'success') {
        setTracks(data.results);
        setError(null);
      } else {
        setError(data.headers.error_message || 'Failed to fetch tracks');
        setTracks([]);
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
      setError('Error fetching tracks. Please try again later.');
      setTracks([]);
    }
  };

  const addToPlaylist = async (track: any) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        alert('You must be logged in to add tracks to a playlist.');
        return;
      }

      const userId = userData.user.id;

      const { data: existingPlaylist, error: fetchError } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        alert('Error checking playlist: ' + fetchError.message);
        return;
      }

      const newTrack = {
        track_id: track.id,
        track_name: track.name,
        track_artist: track.artist_name,
        track_url: track.audio,
      };

      if (existingPlaylist) {
        const existingTracks = Array.isArray(existingPlaylist.tracks) ? existingPlaylist.tracks : [];
        if (existingTracks.some((t: any) => t.track_id === track.id)) {
          alert('This track is already in your playlist.');
          return;
        }

        const updatedTracks = [...existingTracks, newTrack];

        const { error: updateError } = await supabase
          .from('playlists')
          .update({ tracks: updatedTracks })
          .eq('user_id', userId);

        if (updateError) {
          alert('Error adding track to playlist: ' + updateError.message);
        } else {
          alert('Track added to playlist successfully!');
        }
      } else {
        const { error: insertError } = await supabase.from('playlists').insert({
          user_id: userId,
          name: 'My Playlist',
          tracks: [newTrack],
        });

        if (insertError) {
          alert('Error creating playlist: ' + insertError.message);
        } else {
          alert('Track added to playlist successfully!');
        }
      }
    } catch (error) {
      alert('Error adding track to playlist: ' + error.message);
    }
  };

  const renderSongItem = ({ item }: { item: any }) => {
    const isCurrentlyPlaying = currentTrack?.id === item.id;

    return (
      <View style={{ alignItems: 'center', width: '100%', maxWidth: 300, alignSelf: 'center' }}>
        <TouchableOpacity
          style={[
            commonStyles.card,
            { flex: 1 },
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
              {item.name || 'Unknown Track'}
            </Text>
            <Text style={commonStyles.artistText} numberOfLines={1} ellipsizeMode="tail">
              {item.artist_name || 'Unknown Artist'}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              padding: 8,
              marginLeft: 4,
              backgroundColor: '#AD85FD',
              borderRadius: 4,
              alignSelf: 'center',
            }}
            onPress={() => addToPlaylist(item)}
          >
            <Icon name="plus" size={10} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  const playRandomTrackWithFeedback = (trackList: any[]) => {
    if (trackList.length === 0) {
      alert('No tracks available to play.');
      return;
    }
    const normalizedTracks = trackList.map((track) => ({
      id: track.id,
      name: track.name,
      audio: track.audio,
    }));
    playRandomTrack(normalizedTracks);
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
      <Text style={commonStyles.title}>Search</Text>

      {/* Horizontal line */}
      <View style={commonStyles.lineContainer}>
        <View style={commonStyles.circle} />
        <View style={commonStyles.horizontalLine} />
        <View style={commonStyles.circle} />
      </View>

      {/* Search Input */}
      <TextInput
        style={[commonStyles.input, { height: 40, width: 350, marginBottom: 16, borderRadius: 30 }]}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        autoCapitalize="none"
      />

      {/* Error Message */}
      {error && (
        <Text style={[commonStyles.cardText, { textAlign: 'center', color: 'red' }]}>
          {error}
        </Text>
      )}

      {/* FlatList for Search Results */}
      <FlatList
        data={tracks}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={[commonStyles.cardText, { textAlign: 'center' }]}>
            No tracks found. Try searching for a song or artist.
          </Text>
        }
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
          <TouchableOpacity onPress={() => playRandomTrackWithFeedback(tracks)}>
            <Icon name="forward" style={commonStyles.bottomBarIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SearchScreen;