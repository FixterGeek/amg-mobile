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
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux'
import { setCurrentActivityAction } from '../redux/EventsDuck'
import RegisterButton from '../components/common/RegisterButton';

let map = require('../../assets/map.png')


class Actividad extends React.Component {

    static navigationOptions = {
        title: "Actividad"
    }

    componentDidUpdate() {

    }
    componentDidMount() {
        this.props.setCurrentActivityAction(this.props.actividad)
    }

    render() {
        let { actividad } = this.props
        return (
            <View style={{ flex: 1, }}>
                <ScrollView style={[styles.container]} >
                    <Text style={[styles.title, { marginLeft: 20 }]}>{actividad.activityName}</Text>
                    <Text style={[styles.description]}>{actividad.activityType}</Text>
                    <View style={styles.padder}>
                        <Text style={styles.title}>Ponente</Text>
                        <View style={styles.flexCard}>
                            <Image
                                style={{ width: 100, height: 100 }}
                                source={{ uri: actividad.speaker.photoURL }} />
                            <View style={styles.textContainer}>
                                <Text style={styles.name}>Dr. {actividad.speaker.fullName}</Text>
                                <Text style={{ marginBottom: 20 }} >Gastroenterología</Text>
                                <Text>{actividad.speaker.origin}</Text>
                            </View>

                        </View>
                        <Text style={styles.title}>Ubicación</Text>
                        <Image
                            style={styles.fake}
                            source={map}
                            resizeMode="cover"
                        />
                        <Text style={[styles.name, { marginTop: 10 }]}>Grand Fiesta Americana</Text>
                    </View>
                    <RegisterButton text="Inscribirse" />

                </ScrollView>
                <MainMenu />
                <Spinner animation="fade" visible={actividad.fetching} />
            </View>
        )
    }

}

function mapState({ events }, props) {
    return {
        event: events.currentEvent,
        actividad: props.navigation.getParam('actividad') || events.currentActivity
    }
}

export default connect(mapState, { setCurrentActivityAction })(Actividad)

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 10,
    },
    padder: {
        paddingLeft: 20
    },
    miniText: {
        fontSize: 10
    },
    roman: {
        width: 60,
        fontSize: 18,
        marginLeft: 10
    },
    flexCard: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        // marginLeft: 10
    },
    description: {
        fontSize: 16,
        // fontWeight: "500",
        marginVertical: 10,
        marginLeft: 20,
        marginBottom: 30,
        marginRight: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
        marginTop: 20,
        marginRight: 20,
        marginBottom: 30
    },
    name: {
        fontSize: 18,
    },
    textContainer: {
        marginLeft: 10
    },
    fake: {
        flex: 0,
        height: 100,
        width: "100%"
    }

})