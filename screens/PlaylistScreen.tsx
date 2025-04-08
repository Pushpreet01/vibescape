import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { MusicPlayerContext } from '../context/MusicPlayerContext';
import { supabase } from '../lib/supabase';
import { commonStyles } from '../src/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';

const PlaylistScreen = () => {
  const { playTrack, currentTrack, pauseTrack, resumeTrack, isPlaying, playPreviousTrack, playRandomTrack, hasPreviousTrack } =
    useContext(MusicPlayerContext);
  const [tracks, setTracks] = useState<any[]>([]); // Store the tracks array directly
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupPlaylist = async () => {
      try {
        // Fetch the current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          setError('You must be logged in to view your playlist.');
          setTracks([]);
          return;
        }

        const userId = userData.user.id;

        // Fetch the user's playlist
        const fetchPlaylist = async () => {
          try {
            const { data, error } = await supabase
              .from('playlists')
              .select('*')
              .eq('user_id', userId)
              .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
              setError('Error fetching playlist: ' + error.message);
              setTracks([]);
            } else if (data && Array.isArray(data.tracks)) {
              const normalizedTracks = data.tracks.map((track: any) => ({
                id: track.track_id,
                name: track.track_name,
                audio: track.track_url,
                artist_name: track.track_artist || 'Unknown Artist',
              }));
              setTracks(normalizedTracks);
              setError(null);
            } else {
              setTracks([]);
              setError(null);
            }
          } catch (error) {
            setError('Error fetching playlist: ' + error.message);
            setTracks([]);
          }
        };

        await fetchPlaylist();

        // Set up real-time subscription
        const subscription = supabase
          .channel('playlists-channel')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'playlists', filter: `user_id=eq.${userId}` },
            () => fetchPlaylist()
          )
          .subscribe();

        // Cleanup subscription
        return () => {
          supabase.removeChannel(subscription);
        };
      } catch (error) {
        setError('Error setting up playlist: ' + error.message);
        setTracks([]);
      }
    };

    setupPlaylist();
  }, []);

  const removeFromPlaylist = async (trackId: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        alert('You must be logged in to modify your playlist.');
        return;
      }

      // Filter out the track to remove
      const updatedTracks = tracks.filter((track) => track.id !== trackId);

      // Update the playlist with the new tracks array, preserving all fields
      const { error } = await supabase
        .from('playlists')
        .update({
          tracks: updatedTracks.map((track) => ({
            track_id: track.id,
            track_name: track.name,
            track_url: track.audio,
            track_artist: track.artist_name || 'Unknown Artist', // Preserve the artist name
          })),
        })
        .eq('user_id', userData.user.id);

      if (error) {
        alert('Error removing track from playlist: ' + error.message);
      } else {
        alert('Track removed from playlist successfully!');
        setTracks(updatedTracks); // Update the local state
      }
    } catch (error) {
      alert('Error removing track from playlist: ' + error.message);
    }
  };

  const renderPlaylistItem = ({ item }: { item: any }) => {
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
              playTrack(item); 
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
              backgroundColor: '#FF5E00', 
              borderRadius: 4,
              alignSelf: 'center',
            }}
            onPress={() => removeFromPlaylist(item.id)}
          >
            <Icon name="trash" size={10} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
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
      <Text style={commonStyles.title}>My Playlist</Text>

      {/* Horizontal line */}
      <View style={commonStyles.lineContainer}>
        <View style={commonStyles.circle} />
        <View style={commonStyles.horizontalLine} />
        <View style={commonStyles.circle} />
      </View>

      {/* Error Message */}
      {error && (
        <Text style={[commonStyles.cardText, { textAlign: 'center', color: 'red' }]}>
          {error}
        </Text>
      )}

      {/* FlatList for Playlist Tracks */}
      <FlatList
        data={tracks}
        renderItem={renderPlaylistItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={[commonStyles.cardText, { textAlign: 'center' }]}>
            No tracks in your playlist. Add some from the Search screen!
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

export default PlaylistScreen;