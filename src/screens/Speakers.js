import React from 'react'
import {
    View,
    Image,
    Text,
    TextInput,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ScrollView
} from 'react-native'
import { connect } from 'react-redux'

let dr = require('../../assets/avatar-hombre.jpg')
let dra = require('../../assets/avatar-mujer.jpg')

class Speakers extends React.Component {
    static navigationOptions = { headerVisible: true }

    state = {
        user: {},
        loading: false
    }

    renderSpeaker = ({ photoURL, city, fullName, title }, i) => {
        // using avatars just for he first event
        return (
            <View
                key={i}
                style={[styles.flexCard]}>
                <Image style={styles.image} source={title === "Dr." ? dr : dra} />
                <View style={[styles.wideCard]}>
                    <Text stye={styles.title}>{title} {fullName}</Text>
                    <Text style={styles.miniText}>{city}</Text>
                </View>
            </View>
        )
    }

    render() {
        let { speakers } = this.props
        return (
            <View style={{
                flex: 1
            }}>
                <ScrollView >
                    {!speakers && <Text style={styles.none}>
                        No hay speakers para este evento aún
                    </Text>}
                    <View style={styles.container}>
                        {speakers.map(this.renderSpeaker)}

                    </View>

                </ScrollView>
            </View>

        )
    }
}

function mapState({ events: { currentEvent } }) {
    return {
        ...currentEvent,
        speakers: currentEvent.speakers || null
    }
}

export default connect(mapState, {})(Speakers)

let styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50
    },
    flexCard: {
        flexDirection: "row",
        alignItems: "center",
        maxHeight: 50,
        marginVertical: 10,
        minWidth: "100%",
        alignSelf: 'stretch',
    },
    wideCard: {

        alignSelf: 'stretch',
        width: "80%",
        height: "100%",
        paddingHorizontal: 10,
        // paddingVertical: 30,
        backgroundColor: "#cfecff",
        flexDirection: "column",
        // flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "center"
        // height: 80

    },
    none: {
        marginTop: 20,
        fontSize: 25,
        fontWeight: "100",
        paddingHorizontal: 30,
        paddingVertical: 10
    },
    container: {
        paddingHorizontal: 10,
        alignItems: "stretch",
        justifyContent: "center"
    },
    title: {
        fontSize: 22,
        fontWeight: "bold"
    },
    miniText: {
        fontSize: 10,
        marginBottom: 10
    },
})