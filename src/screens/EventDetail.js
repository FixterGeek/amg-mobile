import React from 'react'
import {
    View,
    StyleSheet,
    Image,
    Text,

} from 'react-native'
import EventCard from 'components/events/EventCard'
import Icon from 'react-native-vector-icons/FontAwesome';
import MainMenu from '../components/common/MainMenu';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import RegisterButton from '../components/common/RegisterButton';
import { Linking } from 'react-native'

let map = require('../../assets/map.png')

export default class EventDetail extends React.Component {

    static navigationOptions = {
        title: "Detalle del Evento"
    }


    render() {
        let event = this.props.navigation.getParam('event')

        console.warn(event)

        return (
            <View style={{ flex: 1 }}>
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
                            <Icon style={styles.icon} name="eye" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <View style={[styles.button]}>
                            <Text style={[styles.ver]} >Ver ponentes</Text>
                            <Icon style={styles.icon} name="microphone" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => Linking.openURL(event.permisosURLS[0])}
                    >
                        <View style={[styles.button]}>
                            <Text style={[styles.ver]} >Descargar carta permiso</Text>
                            <Icon

                                style={styles.icon} name="download" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.titles}>
                        <Text style={styles.title}>
                            Dirigido a
                    </Text>
                        <Text>
                            {event.description[0]}
                        </Text>
                        <Text style={styles.title}>
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
                        </Text>
                    </View>



                    <RegisterButton text="Inscribirse" />
                </ScrollView>
                <MainMenu />
            </View>
        )
    }

}

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
        fontSize: 18,
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