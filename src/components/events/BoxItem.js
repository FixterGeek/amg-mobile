import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

function BoxItem({
  title, subtitle, footer, date, onPressBox,
  noCheck, _id, selected, onSelect, course
}) {
  const handleBox = () => {
    if (onPressBox) onPressBox();
  }

  return (
    <View style={{
      flex: 1,
      flexDirection: "row",
      alignItems: "center"
    }}>
      <TouchableOpacity
        onPress={() => {
          onSelect(_id, course)
        }}
      >
        <Icon style={{
          fontSize: 22,
          marginRight: 12,
          color: "#4ce2a7"
        }} name={selected === _id ? "check-circle" : "genderless"} />
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>{date}</Text>
        </View>
        <TouchableOpacity onPress={handleBox}>
          <View style={styles.infoContainer}>
            <Text numberOfLines={1} style={styles.infoTitle}>{title}</Text>
            <Text numberOfLines={1}>{subtitle}</Text>
            <Text numberOfLines={1}>{footer}</Text>
          </View>
        </TouchableOpacity>
      </View>
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
