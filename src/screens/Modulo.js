import React from 'react'
import {
    View,
    StyleSheet,
    Image,
    Text,

} from 'react-native'
import EventCard from 'components/events/EventCard'
import Icon from 'react-native-vector-icons/FontAwesome';
import MainMenu from '../components/common/AnimatedMenu';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux'
import moment from 'moment'
import 'moment/locale/es'

class Modulo extends React.Component {

    static navigationOptions = {
        title: "Ver el Módulo"
    }


    render() {
        let { module, event } = this.props
        return (
            <View style={{ flex: 1, }}>
                <ScrollView style={[styles.container]} >
                    <Text style={[styles.title]}>{module.title}</Text>
                    <Text style={[styles.description]}>{module.description}</Text>
                    <View>

                        {module.activities.map((a, i) => {
                            return (<TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Actividad', {
                                    // event.modulos[i]
                                    actividad: a
                                })}
                                key={i}
                            >
                                <View
                                    style={[styles.flexCard]}>
                                    <View style={{ alignItems: "center", width: 70 }}>
                                        <Text style={[styles.roman]}>{moment(new Date(a.startTime)).format('h:mm')}</Text>
                                        <Text style={[styles.roman]}>{moment(new Date(a.startTime)).format('a').toUpperCase()}</Text>
                                    </View>
                                    <View style={[styles.wideCard]}>
                                        <Text >{a.activityName}</Text>
                                        {a.speakers[0].fullName && <Text style={styles.miniText}>{a.speakers[0].fullName}</Text>}
                                    </View>
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
    let modulo = events.currentEvent.modules.find(m => m._id === props.navigation.getParam('modulo')._id)
    return {
        event: events.currentEvent,
        module: modulo
    }
}

export default connect(mapState, {})(Modulo)

let styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    miniText: {
        fontSize: 10
    },
    roman: {
        fontSize: 18,
        marginHorizontal: 10
    },
    flexCard: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    wideCard: {
        justifyContent: "center",
        minHeight: 60,
        paddingHorizontal: 10,
        backgroundColor: "#cfecff",
        width: "80%",
        paddingVertical: 10,
        marginBottom: 20
    },
    description: {
        fontSize: 12,
        fontWeight: "bold",
        marginVertical: 10,
        marginLeft: 0
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
        marginLeft: 0
    },

})