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
                    <View style={{ alignItems: "flex-start" }}>

                        {module.activities.map((a, i) => {
                            return (<TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Actividad', {
                                    // event.modulos[i]
                                    actividad: a
                                })}
                                key={i}
                                style={{ height: 60 }}>
                                <View
                                    style={[styles.flexCard]}>
                                    <View style={{ flex: 0, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.roman]}>{moment(new Date(a.startTime)).format('h:mm')}</Text>
                                        <Text style={[styles.roman]}>{moment(new Date(a.startTime)).format('a').toUpperCase()}</Text>
                                    </View>
                                    <View style={[styles.wideCard]}>
                                        <Text >{a.activityName}</Text>
                                        <Text style={styles.miniText}>{a.speakers[0].fullName}</Text>
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
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 10,
    },
    miniText: {
        fontSize: 10,
        marginBottom: 10
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
        marginBottom: 10
    },
    wideCard: {
        width: "80%",
        height: "100%",
        paddingHorizontal: 10,
        // paddingVertical: 30,
        backgroundColor: "#cfecff",
        flexDirection: "column",
        flexWrap: "wrap",
        // height: 80

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