import React from 'react'
import { connect } from 'react-redux';
import {
    View,
    StyleSheet,
    Image,
    Text,
    ActivityIndicator,
} from 'react-native'
import EventCard from 'components/events/EventCard'
import Icon from 'react-native-vector-icons/FontAwesome';
import MainMenu from '../components/common/AnimatedMenu';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import RegisterButton from '../components/common/RegisterButton';
import SubscriptionButton from '../components/common/SubscriptionButton';
import { Linking } from 'react-native'
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

let map = require('../../assets/map.png')
let visor = require('../../assets/visor.png')
let paper = require('../../assets/paper.png')
let mic = require('../../assets/mic.png')
let download = require('../../assets/download.png')

class EventDetail extends React.Component {

    static navigationOptions = {
        title: "Detalle del Evento"
    }


    render() {
        let event = this.props.navigation.getParam('event')

        //        console.warn(event)

        return (
            <View style={{ flex: 1 }}>
                { this.props.fetching && <ActivityIndicator size="large" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }} /> }
                <ScrollView style={[styles.container]} >
                    <EventCard
                        {...event}
                    />
                    <Image
                        style={styles.fake}
                        source={map}
                        resizeMode="cover"
                    />
                    <TouchableOpacity >
                        <View>
                            <Text style={[styles.bolder]} >{event.location.city}, {event.location.state}</Text>
                            <Text>{event.location.street}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Programa')}
                    >
                        <View style={[styles.button]}>
                            <Text style={[styles.ver]} >Ver programa</Text>
                            <Image resizeMode={ImageResizeMode.contain} source={visor} />
                            {/* <Icon style={styles.icon} name="eye" /> */}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Speakers')}
                    >
                        <View style={[styles.button]}>
                            <Text style={[styles.ver]} >Ver ponentes</Text>
                            <Image resizeMode={ImageResizeMode.contain} style={{ marginRight: 7 }} source={mic} />
                            {/* <Icon style={styles.icon} name="microphone" /> */}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('EventCourses', {event})}
                    >
                        <View style={[styles.button]}>
                            <Text style={[styles.ver]} >Ver Cursos</Text>
                            <Image resizeMode={ImageResizeMode.contain} style={{ marginRight: 7 }} source={mic} />
                            {/* <Icon style={styles.icon} name="microphone" /> */}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            if (event.permisosURLS[0]) {
                                Linking.openURL(event.permisosURLS[0])
                            }

                        }}
                    >
                        <View style={[styles.button]}>
                            <Text style={[styles.ver]} >Descargar carta permiso</Text>
                            <Image resizeMode={ImageResizeMode.contain} style={{ marginRight: 6 }} source={download} />
                            {/* <Icon style={styles.icon} name="download" /> */}
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Exams', { event })}>
                        <View style={[styles.button]}>
                            <Text style={[styles.ver]} >Examenes</Text>
                            {/* <Icon style={styles.icon} name="check-square" /> */}
                            <Image resizeMode={ImageResizeMode.contain} style={{ marginRight: 7 }} source={paper} />
                        </View>

                    </TouchableOpacity>

                    <View style={styles.titles}>
                        <Text style={styles.title}>
                            Dirigido a
                    </Text>
                        <Text>
                            {event.description[0]}
                        </Text>
                        {/* <Text style={styles.title}>
                            Valor curricular
                    </Text>
                        <Text>
                            {event.description[1]}
                        </Text>
                        <Text style={styles.title}>
                            Objetivo
                    </Text>
                        <Text>
                            {event.description[2]}
                        </Text> */}
                    </View>

                    { this.props.user._id && <SubscriptionButton navigation={this.props.navigation} eventOrActivityObject={event} /> }
                    {/* <RegisterButton text="Inscribirse" /> */}
                </ScrollView>
                <MainMenu />
            </View>
        )
    }
}

function mapStateToProps({ user, events }) {
    return {
        fetching: user.fetching || events.fetching,
        user,
    }
}

export default connect(
    mapStateToProps,
)(EventDetail)

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 10
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 10
    },
    icon: {
        fontSize: 22,
        marginRight: 5,
        color: "#2d9bd6"
    },
    button: {
        flex: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
    },
    ver: {
        fontSize: 22,
        fontWeight: "bold",
        marginVertical: 10,
        color: "#022047"
    },
    bolder: {
        fontWeight: "bold"
    },
    fake: {
        flex: 0,
        height: 100,
        width: "100%"
    }

})