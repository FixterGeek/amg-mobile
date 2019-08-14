import React from 'react'
import {
    View,
    Text,

    TouchableOpacity,
    StyleSheet,
    ImageBackground
} from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { getSingleEventAction } from '../../redux/EventsDuck'

let logo = require('../../../assets/gastro.jpg')

function EventCard({ getSingleEventAction, event, title, startDate, mainImagesURLS, navigation }) {

    function push() {
        if (!navigation) return
        getSingleEventAction(event._id)
        navigation.navigate('EventDetail', { event })
    }

    let image = "http://amicsliceu.com/wp-content/uploads/2018/12/paris_noche_museos_01-1.jpg"
    if (mainImagesURLS) image = mainImagesURLS[0]

    return (
        <TouchableOpacity
            onPress={push}
        >
            <ImageBackground
                style={[styles.container, { width: '100%', height: '100%' }]}
                imageStyle={{ borderRadius: navigation && 0 }}
                source={{ uri: image }}>
                <View style={styles.text}>
                    <Text style={styles.size}>
                        {title}
                    </Text>
                    <Text style={styles.p}>
                        {moment(startDate).format('LL')}
                    </Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>

    )
}

function mapState(state) {
    return {}
}

export default connect(mapState, { getSingleEventAction })(EventCard)

let styles = StyleSheet.create({
    text: {
        position: "absolute",
        bottom: 20,
        left: 15
    },
    size: {
        fontSize: 20,
        color: "white"
    },
    p: {
        fontSize: 15,
        color: "white"
    },
    logo: {
        width: 40,
        height: 50,
        position: "absolute",
        left: 15,
        top: 10
    },

    container: {
        borderRadius: 0,
        borderWidth: 1,
        marginBottom: 20,
        borderColor: "#d6d7da",
        flex: 1,
        minHeight: 200,
        position: "relative"
    },
    containerDetail: {
        borderWidth: 1,
        marginBottom: 20,
        borderColor: "#d6d7da",
        flex: 1,
        minHeight: 200,
        position: "relative"
    }
})