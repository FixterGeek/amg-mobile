import React from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ImageBackground
} from 'react-native'
import moment from 'moment'

let logo = require('../../../assets/gastro.jpg')

export default function EventCard({ event, title, startDate, thumbnailImagesURLS, navigation }) {

    function push() {
        if (!navigation) return
        navigation.navigate('EventDetail', { event })
    }

    let image = thumbnailImagesURLS[0]

    return (
        <TouchableOpacity
            onPress={push}
        >
            <ImageBackground
                style={[styles.container, { width: '100%', height: '100%' }]}
                imageStyle={{ borderRadius: navigation && 0 }}
                source={{ uri: image }}>
                {/* <Image
                    style={styles.logo}
                    source={logo} /> */}
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