import React from 'react';

import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function DocumentItem({ link, fileName }) {
  const openLink = () => {
    if (link) Linking.openURL(link);
  };

  return (
    <TouchableOpacity style={styles.item} onPress={() => openLink()}>
      <Icon style={{ color: 'white', fontSize: 32, textAlign: 'center', marginBottom: 10 }} name="file" />
      <Text style={{ color: 'white', fontSize: 16 }} numberOfLines={1}>{fileName}</Text>
    </TouchableOpacity>
  );
}

export default DocumentItem;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#1f2536',
    padding: 10,
    width: '49%',
    marginBottom: 5,
    height: 90,
  }
})
