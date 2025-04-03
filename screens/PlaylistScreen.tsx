import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { commonStyles } from '../src/styles';

const PlaylistScreen = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      if (!error) setPlaylists(data);
    };
    fetchPlaylists();
  }, []);

  return (
    <View style={commonStyles.screenContainer}>
      <Text style={commonStyles.title}>My Playlist</Text>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={commonStyles.button}>
            <Text style={commonStyles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default PlaylistScreen;
