import React, { Component } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import RegisterButton from '../common/RegisterButton'
import { TouchableOpacity } from 'react-native-gesture-handler'

let img = "https://i.imgur.com/oRUEvzp.png"

export default function Referencia({
    onAccept,
    onPressButton2
}) {
    let oxxo = require('../../../assets/oxxo.png')
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={{ uri: 'https://i.imgur.com/oRUEvzp.png' }}
            />
            <TouchableOpacity
                onPress={onAccept}
            >
                <Text
                    style={styles.button1}
                >
                    Guardar
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={(onPressButton2)}
            >
                <Text
                    style={styles.button2}
                >
                    Volver
                </Text>
            </TouchableOpacity>
        </View>
    )

}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
        paddingHorizontal: 20,
        // justifyContent: "center"
    },
    image: {
        width: 300,
        height: 500,
        alignSelf: "center"
    },
    button1: {
        padding: 20,
        backgroundColor: "#1f2536",
        borderColor: "black",
        textAlign: "center",
        color: "white",
        alignSelf: "stretch",
        fontWeight: "bold",
        fontSize: 18,
        marginVertical: 30,
        marginBottom: 0
    },
    button2: {
        padding: 20,
        backgroundColor: "transparent",
        borderRadius: 0,
        borderWidth: 2,
        borderColor: 'black',
        textAlign: "center",
        color: "#1f2536",
        alignSelf: "stretch",
        fontWeight: "bold",
        fontSize: 18,
        marginVertical: 10,
        borderColor: "black"
    },
    title: {
        alignSelf: "center",
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 30
    },
    text: {
        marginVertical: 20,
        fontSize: 16
    },
    subtitle: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "bold"
    }
})