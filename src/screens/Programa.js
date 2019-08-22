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
import MainMenu from '../components/common/AnimatedMenu';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux'

let map = {
    1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X",
    11: "XI", 12: "XII", 13: "XIII", 14: "XIV", 15: "XV", 16: "XIV", 17: "XVII", 18: "XVIII", 19: "XIX", 20: "XX",
    21: "XXI", 22: "XXII", 23: "XXIII", 24: "XXIV", 25: "XXV", 26: "XXIV", 27: "XXVII", 28: "XXVIII", 29: "XXIX", 30: "XXX",
    31: "XXXI", 32: "XXXII", 33: "XXXIII", 34: "XXXIV", 35: "XXXV", 36: "XXXIV", 37: "XXXVII", 38: "XXXVIII", 39: "XXXIX", 40: "XL",
    41: "XLI", 42: "XLII", 43: "XLIII", 44: "XLIV", 45: "XLV", 46: "XLIV", 47: "XLVII", 48: "XLVIII", 49: "XLIX", 50: "L",
}

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
                    <View>

                        {modules.map((m, i) => {
                            return (<TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Modulo', {
                                    // event.modulos[i]
                                    modulo: m
                                })}
                                key={m._id}
                            >

                                <View style={styles.wideCard} >
                                    <Text style={styles.roman} >{map[i + 1]}</Text>
                                    <Text style={styles.name}>{m.title}</Text>
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
        // paddingHorizontal: 10,
    },
    name: { width: "80%", fontSize: 16, backgroundColor: "#cfecff", paddingVertical: 20, paddingHorizontal: 10 },
    roman: { textAlign: "right", fontSize: 22, marginHorizontal: 20, minWidth: 30 },
    wideCard: { marginVertical: 10, flexDirection: "row", alignItems: "center" },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
        marginLeft: 50
    },

})