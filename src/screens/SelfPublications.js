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
import GastroModal from '../components/common/GastroModal'

class SelfPublications extends React.Component {
    state = {
        open: true,
        showEvent: false,
    }
    componentWillMount() {
        // console.log("own", this.props.navigation.getParam('event'))
        // this.populate()
    }

    populate = () => {
        // this.props.getEvents()
        // console.log(this.props.user._id, this.props.user.token)
        this.props.populatePublications(this.props.user._id, this.props.user.token);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.user.membershipStatus === "Free") {
            this.setState({ open: true })
        }
    }

    goBack = () => {
        this.setState({ open: false })
        this.props.navigation.navigate("Events")
    }

    render() {
        let {
            getEvents, fetching, event,
            navigation, populatePublications,
            publications, noPublications, user,
        } = this.props
        let { showEvent } = this.state

        if (this.props.user.membershipStatus === "Free") return <GastroModal onlyOne={true} onAccept={this.goBack} isVisible={this.state.open} title="Feed" text="Esta sección de Feed, está solo disponible para usuarios con membresía" />
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
                        {/* <TouchableOpacity style={styles.fakeContainer} onPress={() => navigation.navigate('Users')}>
                            <View style={styles.fakeInput}>
                                <Text style={{ color: '#333333' }}>Buscar colegas</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.fakeContainer} onPress={() => navigation.navigate('CreatePost')}>
                            <View style={styles.fakeInput}>
                                <Text style={{ color: '#333333' }}>Cuentanos algo</Text>
                            </View>
                            <View style={styles.fakeButton}>
                                <Text style={{ color: 'white' }}>Publicar</Text>
                            </View>
                        </TouchableOpacity> */}
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
                                userId={user._id}
                                {...item}
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

SelfPublications.navigationOptions = ({ navigation }) => ({ headerVisible: true, headerLeft: null, title: "Publicaciones propias" });

function mapStateToProps({ user, events, publication }) {
    let publications = publication.array.filter(p => p.user._id == user._id)
    return {
        user,
        event: events.array.filter(e => e.status === 'published').pop(),
        fetching: events.fetching || publication.fetching,
        // publications: publication.array || [],
        publications,
        noPublications: publication.noData,
    }
}

export default connect(
    mapStateToProps, {
    getEvents,
    populatePublications,
}
)(SelfPublications);

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
