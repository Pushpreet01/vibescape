import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';

const bootstrap = new BootstrapStyleSheet();
const { s } = bootstrap;

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
    <View style={[s.container, s.p3, { backgroundColor: '#E6F0FA' }]}>
      <Text style={[s.h3, s.textCenter]}>My Playlist</Text>
      <FlatList
        data={playlists}
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

export default PlaylistScreen;