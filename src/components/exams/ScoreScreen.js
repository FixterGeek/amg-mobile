import React from 'react'
import {
    Image,
    Text,
    View,
    StyleSheet
} from 'react-native'
import MainMenu from '../common/MainMenu'

let wow = require('../../../assets/wow.png')
let oops = require('../../../assets/oops.png')
let bravo = require('../../../assets/bravo.png')

export default function ScoreScreen({ total = "12/16" }) {
    let correct = Number(total.split('/')[0])
    let all = Number(total.split('/')[1])
    let percentage = correct * 100 / all
    if (percentage < 70) {
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={oops} ></Image>
                <Text style={styles.title} >{total}</Text>
                <Text style={styles.subTitle}>¡Necesitas estudiar más!</Text>
                <MainMenu />
            </View>
        )
    }
    else if (percentage < 100) {
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={bravo} ></Image>
                <Text style={styles.title}>{total}</Text>
                <Text style={styles.subTitle}>¡Muy Bien!</Text>
                <MainMenu />
            </View>
        )
    }
    else {
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={wow} ></Image>
                <Text style={styles.title}>{total}</Text>
                <Text style={styles.subTitle}>¡Wow!</Text>
                <MainMenu />
            </View>
        )
    }


}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20
    },
    image: {
        maxWidth: 320,
        marginVertical: 50
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        marginVertical: 20
    },
    subTitle: {
        fontSize: 25,
        fontWeight: "100"
    }
})
