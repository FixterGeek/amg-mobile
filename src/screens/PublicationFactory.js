import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as DocumentPicker from 'expo-document-picker';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LB from 'react-native-image-view';

import {
  ScrollView, StyleSheet, TextInput,
  TouchableOpacity, View, Text, Image,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';

import {
  createPublication,
  writeWorkingOn,
  setWorkingOn,
} from '../redux/publicationDuck';
import UserHeader from '../components/common/UserHeader';
import DocumentItem from '../components/common/DocumentItem';

function PublicationFactory({
  user, fetching, workingOn,
  createPublication, writeWorkingOn, setWorkingOn,
  createdStatus, navigation,
}) {
  const [currentIndex, setCurrentIndex] = useState(null);
  useEffect(() => {
    if (user._id) writeWorkingOn(workingOn, 'user', user._id);
  }, [user._id]);

  useEffect(() => {
    if (createdStatus === 'success') navigation.goBack();
  }, [createdStatus]);

  const handleCameraRoll = async () => {
    let result = null;
    let status = null;
    status = await Permissions.getAsync(Permissions.CAMERA_ROLL).then(({ status }) => status);
    //console.log(status);
    if (status === 'undetermined') status = await Permissions.askAsync(Permissions.CAMERA_ROLL).then(({ status }) => status);
    if (status === 'granted') result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      base64: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    })

    //if(result.width>5000) return

    if (result.cancelled === false) writeWorkingOn(workingOn, 'files', [...workingOn.files, result])
  }

  function removeImage(index, file) {
    let copy = Object.assign(workingOn, {})
    copy.files.splice(index, 1)
    writeWorkingOn(copy, 'files', [...copy.files])
  }

  // const handleDocumentPicker = async () => {
  //   let result = null;
  //   result = await DocumentPicker.getDocumentAsync({
  //     type: '*/*',
  //   })

  //   if (result.type === 'success') {
  //     writeWorkingOn(workingOn, 'docs', [...workingOn.docs, result])
  //   }
  // };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableAutomaticScroll={(Platform.OS === 'ios')}
      contentContainerStyle={{ flex: 1, backgroundColor: "#f4f4f4" }}
    >
      <Spinner visible={fetching} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <UserHeader
            userPhoto={user.basicData.photoURL || null}
            userName={`${user.basicData.name} ${user.basicData.dadSurname}`}
            noDate
          />
          <TouchableOpacity onPress={() => createPublication(workingOn, user.token, user)}>
            <View style={styles.postButton}>
              <Text style={{ color: 'white' }}>Publicar</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TextInput
          onChangeText={value => writeWorkingOn(workingOn, 'text', value)}
          value={workingOn.text}
          style={styles.textInput}
          placeholder="Cuentanos algo"
          numberOfLines={10}
          multiline={true}
        />
        <TouchableOpacity style={styles.itemButton} onPress={() => handleCameraRoll()}>
          <View style={styles.item}>
            <Icon name="image" style={styles.itemButtonIcon} />
            <Text style={{ fontSize: 18 }}>Foto/Video</Text>
          </View>
        </TouchableOpacity>

        {fetching && <Text>Subiendo</Text>}

        <View style={{
          flexDirection: 'row', flexWrap: 'wrap',
          justifyContent: 'space-between', marginBottom: 10,
        }}>
          {
            workingOn.files.map((file, index) => {
              return (

                <View
                  style={[styles.imageToUpload, styles.preview]}>
                  <TouchableOpacity
                    onPress={() => removeImage(index, file)} >
                    <Text style={styles.x}>X</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ zIndex: -9999 }}
                    key={`image-${index}`}
                    onPress={() => setCurrentIndex(index)} >
                    <Image
                      style={{ width: '100%', height: 110 }}
                      source={{ uri: `data:${file.type}/${file.uri.split('.').pop()};base64,${file.base64}` }}
                    />
                  </TouchableOpacity>
                </View>


              )
            })
          }
        </View>

        {/* <TouchableOpacity style={styles.itemButton} onPress={() => handleDocumentPicker()}>
          <View style={styles.item}>
            <Icon name="paperclip" style={styles.itemButtonIcon} />
            <Text style={{ fontSize: 18 }}>Archivos</Text>
          </View>
        </TouchableOpacity> */}

        <View style={styles.docsContainer}>
          {
            workingOn.docs.map((doc, index) => (
              <DocumentItem
                key={`document-${index}`}
                fileName={doc.name}
              />
            ))
          }
        </View>

        <LB
          isVisible={currentIndex !== null}
          images={workingOn.files.map(f => ({ source: { uri: `data:${f.type}/${f.uri.split('.').pop()};base64,${f.base64}` } }))}
          imageIndex={currentIndex}
          onClose={() => setCurrentIndex(null)}
        />
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

PublicationFactory.navigationOptions = ({ navigation }) => ({
  title: 'Crear publicación',
});

function mapStateToProps({ user, publication }) {
  return {
    user,
    fetching: user.fetching || publication.fetching,
    workingOn: publication.workingOn,
    createdStatus: publication.status,
  }
}

export default connect(
  mapStateToProps, {
  createPublication,
  setWorkingOn,
  writeWorkingOn,
}
)(PublicationFactory);

const styles = StyleSheet.create({
  preview: {
    position: "relative",
    zIndex: -1
  },
  x: {
    color: "white",
    backgroundColor: "black",
    padding: 10,
    borderRadius: 15,
    overflow: "hidden",
    position: "absolute",
    top: -15,
    right: -15,
    zIndex: 1
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: "100%",
  },
  textInput: {
    backgroundColor: '#f5f8f9',
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    minHeight: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#1f2536',
  },
  itemButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f5f8f9',
    marginBottom: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  itemButtonIcon: {
    marginRight: 10,
    fontSize: 26,
  },
  item: {
    flexDirection: 'row',
  },
  imageToUpload: {
    width: "49%",
    height: 110,
    marginBottom: 5,
  },
  docsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});
