import React from 'react'
import {
    View,
    StyleSheet,
    Image,
    Text,
    ScrollView,
} from 'react-native'
//import EventCard from 'components/events/EventCard'
//import Icon from 'react-native-vector-icons/FontAwesome';
import MainMenu from '../components/common/MainMenu';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux'
import { setCurrentActivityAction } from '../redux/EventsDuck'
import { subscribeToActivityAction } from '../redux/UserDuck'
import RegisterButton from '../components/common/RegisterButton';
import GastroModal from '../components/common/GastroModal'

let map = require('../../assets/map.png')


class Actividad extends React.Component {

    static navigationOptions = {
        title: "Actividad"
    }

    state = {
        open: false,
        modalText: "Te inscribirás a esta actividad"
    }

    componentWillReceiveProps(newProps) {
        if (newProps.error) {
            this.setState({ error: newProps.error, modalText: newProps.error })
        }
    }
    componentDidMount() {
        this.props.setCurrentActivityAction(this.props.actividad)
    }

    onRegister = () => {
        this.setState({ open: false })
        this.props.subscribeToActivityAction(this.props.actividad._id)
    }

    render() {
        let { actividad, speaker } = this.props
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
                                source={{ uri: speaker.photoURL }} />
                            <View style={styles.textContainer}>
                                <Text style={styles.name}>{speaker.fullName}</Text>
                                {/* <Text style={{ marginBottom: 20 }} >Gastroenterología</Text> */}
                                <Text>{speaker.origin}</Text>
                            </View>

                        </View>
                        <Text style={styles.title}>Ubicación</Text>
                        <Image
                            style={styles.fake}
                            source={map}
                            resizeMode="cover"
                        />
                        <Text style={[styles.name, { marginTop: 10 }]}>Auditorio Complejo Médico "Antonio Fernández Rodríguez"</Text>
                    </View>
                    <RegisterButton
                        onPress={this.props.alreadyRegistered ? () => { } : () => this.setState({ open: true })}
                        text="Inscribirse"
                        alreadyRegisteredText="Tú asistrás"
                        alreadyRegistered={this.props.alreadyRegistered}
                    />

                </ScrollView>
                <MainMenu />
                <Spinner animation="fade" visible={this.props.fetching} />
                <GastroModal
                    text={this.state.modalText}
                    acceptButtonText="Inscribirme"
                    onAccept={this.onRegister}
                    isVisible={this.state.open}
                    onCancel={() => this.setState({ open: false })}
                    noButtons={this.state.error}
                />
            </View>
        )
    }

}

function mapState({ events, user }, props) {
    let actividad = props.navigation.getParam('actividad') || events.currentActivity
    let alreadyRegistered = actividad.assistants.find(id => id == user._id)
    return {
        event: events.currentEvent,
        alreadyRegistered,
        assistants: actividad.assistants,
        actividad,
        speaker: actividad.speakers[0],
        user,
        fetching: user.fetching,
        error: user.error || null
    }
}

export default connect(mapState, { setCurrentActivityAction, subscribeToActivityAction })(Actividad)

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