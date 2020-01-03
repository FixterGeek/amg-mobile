import React, { useState } from 'react';
import PropTypes from 'prop-types'
// import moment from 'moment';
import LB from 'react-native-image-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import { likedislikeAction, deletePublicationAction } from '../../redux/publicationDuck'
import { connect } from 'react-redux'
import GastroModal from '../common/GastroModal'


import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

import UserHeader from '../common/UserHeader';
import DocumentItem from '../common/DocumentItem';

function PublicationCard({
  userName, userPhoto, date, publicationText,
  publicationImages = [], navigation,
  publicationDocs = [],
  liked = [], userId, likedislikeAction, deletePublicationAction, _id, user
}) {
  let [open, setOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(null);
  let youLiked = liked.find(id => id == userId)
  let isYours = user ? userId == user._id : false
  function likePublication() {
    likedislikeAction(_id)
  }

  function deletePost() {
    setOpen(false)
    deletePublicationAction(_id)
  }

  return (

    <View style={styles.container}>

      <UserHeader
        userPhoto={userPhoto} userName={userName} date={date} />
      {
        publicationText && (
          <View style={styles.publicationText}>
            <Text>
              {publicationText}
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
      <TouchableOpacity
        onPress={likePublication}
      >
        <View style={{ alignItems: "center", display: "flex", flexDirection: "row", marginVertical: 10, marginHorizontal: 20, position: "absolute", right: 0, bottom: 0 }}>
          <Icon
            name="heart" color={youLiked ? "red" : null} size={20}
          />
          <Text style={{ marginLeft: 10 }}>{liked.length ? liked.length : null}</Text>
        </View>
      </TouchableOpacity>
      {isYours &&
        <TouchableOpacity
          onPress={() => setOpen(true)}
        >
          <Icon style={{ position: "absolute", right: -15, bottom: 0, marginHorizontal: 10, marginVertical: 10 }} size={20} name="trash" />
        </TouchableOpacity>
      }


      <GastroModal
        title="Eliminar"
        text="¿Estas segurx de eliminar tu publicación?"
        onCancel={() => setOpen(false)}
        onAccept={deletePost}
        isVisible={open}
      />
    </View>
  );
}

function mapState() {
  return {}
}

export default connect(mapState, { deletePublicationAction, likedislikeAction })(PublicationCard)

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
