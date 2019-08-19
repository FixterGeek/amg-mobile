import React from 'react'
import {
    View,
    StyleSheet,
    Image,
    Text,
    AsyncStorage
} from 'react-native'
import EventCard from 'components/events/EventCard'
import Icon from 'react-native-vector-icons/FontAwesome';
import MainMenu from '../components/common/MainMenu';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux'

class Programa extends React.Component {

    static navigationOptions = {
        title: "Programa del Evento"
    }

    componentDidUpdate() {
        if (this.props.event.error) {
            //this.props.navigation.navigate('Events')
        }
    }
    componentDidMount() {
        if (this.props.event.error) {
            //this.props.navigation.navigate('Events')
        }
    }

    render() {
        let { event, modules } = this.props
        return (
            <View style={{ flex: 1, }}>
                <ScrollView style={[styles.container]} >
                    <EventCard
                        {...event}
                    />
                    <Text style={[styles.title]}>Módulos</Text>
                    <View style={{ alignItems: "flex-end" }}>

                        {modules.map((m, i) => {
                            return (<TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Modulo', {
                                    // event.modulos[i]
                                    modulo: m
                                })}
                                key={m._id}
                                style={{ height: 60, width: "100%" }}>

                                <View style={[styles.wideCard]}>
                                    <Text style={styles.number}>{i + 1}</Text>
                                    <Text style={styles.roman} >{m.title}</Text>
                                </View>
                            </TouchableOpacity>)
                        })}

                    </View>

                </ScrollView>
                <MainMenu />
                <Spinner animation="fade" visible={event.fetching} />
            </View>
        )
    }

}

function mapState({ events }, props) {
    return {
        event: events.currentEvent,
        modules: events.currentEvent.modules || [],
    }
}

export default connect(mapState, {})(Programa)

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 10,
    },
    number: {
        fontSize: 16,
        marginRight: 20,
        marginLeft: 20
    },
    roman: {
        width: 290,
        paddingBottom: 10,
        paddingTop: 10,
        paddingHorizontal: 10,
        backgroundColor: "#cfecff",
        fontSize: 14,
        maxWidth: 300
    },
    wideCard: {

        marginLeft: 0,
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        flexWrap: "wrap",

    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
        marginLeft: 50
    },

})