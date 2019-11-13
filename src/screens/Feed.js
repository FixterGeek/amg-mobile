import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import {
  ScrollView, FlatList, StyleSheet,
  View, TouchableOpacity, Text
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';

import { getEvents } from '../redux/EventsDuck';
import { populatePublications } from '../redux/publicationDuck';
import EventCard from '../components/events/EventCard';
import PublicationCard from '../components/feed/PublicationCard';

function Feed({
  getEvents, fetching, event,
  navigation, populatePublications,
  publications, noPublications, user,
}) {
  useEffect(() => {
    getEvents();
    if (!publications[0] && !noPublications) populatePublications(false, user.token);
  }, []);

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableAutomaticScroll={(Platform.OS === 'ios')}
      contentContainerStyle={{ flex: 1, backgroundColor: "#f4f4f4" }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Spinner visible={fetching} />
        <EventCard
          event={event}
          title={event.title}
          location={event.location}
          mainImagesURLS={event.mainImagesURLS}
          startDate={event.startDate}
          navigation={navigation}
        />
        <TouchableOpacity style={styles.fakeContainer} onPress={() => navigation.navigate('CreatePost')}>
          <View style={styles.fakeInput}>
            <Text style={{ color: '#333333' }}>Cuentanos algo</Text>
          </View>
          <View style={styles.fakeButton}>
            <Text style={{ color: 'white' }}>Publicar</Text>
          </View>
        </TouchableOpacity>
        <FlatList
          data={publications}
          renderItem={({ item }) => <PublicationCard
            userName={`${item.user.basicData.name} ${item.user.basicData.dadSurname}`}
            userPhoto={item.user.basicData.photoURL}
            publicationText={item.text}
            date={item.createdAt}
            publicationImages={item.imagesURLS[0] ? item.imagesURLS.map(i => ({ uri: i })) : []}
            navigation={navigation}
          />}
          keyExtractor={item => item._id}
        />
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

Feed.navigationOptions = ({ navigation }) => ({
  title: 'Inicio',
});

function mapStateToProps({ user, events, publication }) {
  return {
    user,
    event: events.array.filter(e => e.status === 'published').pop(),
    fetching: events.fetching || publication.fetching,
    publications: publication.array || [],
    noPublications: publication.noData,
  }
}

export default connect(
  mapStateToProps, {
    getEvents,
    populatePublications,
  }
)(Feed);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fakeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  fakeInput: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#f5f8f9',
    flexGrow: 1,
  },
  fakeButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#1f2536',
  }
});
