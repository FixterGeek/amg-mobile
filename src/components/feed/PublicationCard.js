import React, { useState } from 'react';
import PropTypes from 'prop-types'
import moment from 'moment';
import LB from 'react-native-image-view';

import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

import UserHeader from '../common/UserHeader';
import DocumentItem from '../common/DocumentItem';

function PublicationCard({
  userName, userPhoto, date, publicationText,
  publicationImages = [], navigation,
  publicationDocs = [],
}) {
  const [currentImage, setCurrentImage] = useState(null);

  return (
    <View style={styles.container}>
      <UserHeader userPhoto={userPhoto} userName={userName} date={date} />
      {
        publicationText && (
          <View style={styles.publicationText}>
            <Text>
              { publicationText }
            </Text>
          </View>
        )
      }
      <View style={styles.imagesContainer}>
        {
          publicationImages.slice(0, 4).map((i, index) => {
            if (publicationImages.length > 4 && index === 3) return (
              <TouchableOpacity
                key={`img-${index}`}
                onPress={() => navigation.navigate('Gallery', { imagesArray: publicationImages })}
                style={styles.imageWrapper} >
                <Text style={styles.moreImageText}>{`+ ${publicationImages.length - 4}`}</Text>
                <Image
                  source={i}
                  style={styles.image}
                  resizeMode="cover"
                  blurRadius={5}
                />
              </TouchableOpacity>
            )
            return (
              <TouchableOpacity
                key={`img-${index}`}
                onPress={() => setCurrentImage(i)} style={styles.imageWrapper} >
                <Image
                  source={i}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )
          })
        }
      </View>
      <View style={styles.imagesContainer}>
        {
          publicationDocs.map((d, index) => (
            <DocumentItem
              key={`doc-${index}`}
              fileName={d.split('/').pop()}
              link={d}
            />
          ))
        }
      </View>
      <LB
        isVisible={currentImage !== null}
        imageIndex={0}
        images={[{ source: currentImage }]}
        onClose={() => setCurrentImage(null)}
      />
    </View>
  );
}

export default PublicationCard;

PublicationCard.propTypes = {
  date: PropTypes.string,
};

PublicationCard.defaultProps = {
  date: null,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f8f9',
    padding: 10,
    marginBottom: 10,
  },
  publicationText: {
    paddingVertical: 10,
  },
  imagesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    height: 110,
    width: "49%",
    marginBottom: 5,
    position: 'relative',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 110,
    width: "100%",
  },
  moreImageText: {
    position: 'absolute',
    color: 'white',
    fontWeight: 'bold',
    zIndex: 10,
    fontSize: 24,
  }
});
