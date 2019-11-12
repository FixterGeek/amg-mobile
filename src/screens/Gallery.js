import React, { useState } from 'react';
import LB from 'react-native-image-view';

import { ScrollView, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';

function Gallery({
  navigation
}) {
  const imagesArray = navigation.getParam('imagesArray') || [];

  const [currentIndex, setCurrentIndex] = useState(null);

  console.log(currentIndex);

  return (
    <ScrollView contentContainerStyle={styles.imagesContainer}>
      <FlatList
        data={imagesArray}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => setCurrentIndex(index)}
            style={styles.imageWrapper} >
            <Image source={item} style={styles.image} />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `${index}-image`}
      />
      <LB
        isVisible={currentIndex !== null}
        imageIndex={currentIndex}
        images={imagesArray.map(i => ({ source: i }))}
        onClose={() => setCurrentIndex(null)}
      />
    </ScrollView>
  );
}

export default Gallery;

const styles = StyleSheet.create({
  imagesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  imageWrapper: {
    height: 210,
    width: "100%",
    marginBottom: 5,
    position: 'relative',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 210,
    width: "100%",
  },
});
