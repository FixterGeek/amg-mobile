import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import {
  ScrollView, FlatList, StyleSheet,
  View, TouchableOpacity, Text,
  Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';

import { getEvents } from '../redux/EventsDuck';
import { populatePublications } from '../redux/publicationDuck';
import EventCard from '../components/events/EventCard';
import PublicationCard from '../components/feed/PublicationCard';
import MainMenu from '../components/common/AnimatedMenu';

class Feed extends React.Component {
  state = {
    showEvent: this.props.navigation.getParam('event')
  }
  componentWillMount() {
    this.props.getEvents();
    if (!this.props.publications[0] && !this.props.noPublications) {
      if (this.state.showEvent) this.props.populatePublications(false, this.props.user.token);
      else this.props.populatePublications(this.props.user._id, this.props.user.token);
    }
  }
  render() {
    let {
      getEvents, fetching, event,
      navigation, populatePublications,
      publications, noPublications, user,
    } = this.props
    let { showEvent } = this.state

    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          enableAutomaticScroll={(Platform.OS === 'ios')}
          contentContainerStyle={{ flex: 1, backgroundColor: "#f4f4f4" }}
        >
          <ScrollView contentContainerStyle={styles.container}>
            <Spinner visible={fetching} />
            {
              showEvent && (
                <EventCard
                  event={event}
                  title={event.title}
                  location={event.location}
                  mainImagesURLS={event.mainImagesURLS}
                  startDate={event.startDate}
                  navigation={navigation}
                />
              )
            }
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
                publicationDocs={item.docsURLS}
              />}
              keyExtractor={item => item._id}
            />
          </ScrollView>

        </KeyboardAwareScrollView>
        <MainMenu />
      </View>
    );
  }
}

Feed.navigationOptions = ({ navigation }) => ({ headerVisible: true, headerLeft: null, title: "Inicio" });

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
