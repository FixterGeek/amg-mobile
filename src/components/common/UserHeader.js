import React from 'react';
import moment from 'moment';

import {
  View, Image, Text,
  StyleSheet,
} from 'react-native';

const userImg = require('../../../assets/user-img.png')

function UserHeader({
  userPhoto,
  userName,
  date,
  noDate
}) {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={userPhoto ? { uri: userPhoto } : userImg}
        style={styles.userPhoto}
        resizeMode="cover"
      />
      <View>
        <Text style={styles.userNameText}>{userName}</Text>
        {!noDate && <Text>{moment(date).fromNow()}</Text>}
      </View>
    </View>
  )
}

export default UserHeader;

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  userPhoto: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
