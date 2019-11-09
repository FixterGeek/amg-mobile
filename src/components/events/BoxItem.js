import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

function BoxItem({
  title, subtitle, footer, date, onPressBox,
  noCheck
}) {
  const handleBox = () => {
    if (onPressBox) onPressBox();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>{ date }</Text>
        {
          !noCheck && (
            <TouchableOpacity>
              <Icon name="check" />
            </TouchableOpacity>
          )
        }
      </View>
      <TouchableOpacity onPress={handleBox}>
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={styles.infoTitle}>{ title }</Text>
          <Text numberOfLines={1}>{ subtitle }</Text>
          <Text numberOfLines={1}>{ footer }</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default BoxItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: '#cfecff',
    padding: 8,
  },
  infoTitle: {
    fontWeight: 'bold',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  }
});
