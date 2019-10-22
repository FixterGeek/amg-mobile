import React, { Component } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import RegisterButton from '../common/RegisterButton'
import { TouchableOpacity } from 'react-native-gesture-handler'

let texto = "Tu membresía ha sido renovada. Recibirás un correo de confirmación "

export default function MessageScreen({
    isError,
    title = "¡Listo!",
    text = texto,
    buttonText1 = "Deseo facturar",
    buttonText2 = "En otro momento",
    onPressButton1,
    onPressButton2,
    onlyOne
}) {
    let success = require('../../../assets/success.png')
    let error = require('../../../assets/error.png')
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={isError ? error : success} />
            <Text style={styles.title} >{title}</Text>
            <Text style={styles.text}>
                {text}
            </Text>
            <TouchableOpacity
                onPress={onPressButton1}
            >
                <Text
                    style={styles.button1}
                >
                    {buttonText1}
                </Text>
            </TouchableOpacity>
            {!onlyOne && <TouchableOpacity
                onPress={onPressButton2}
            >
                <Text
                    style={styles.button2}
                >
                    {buttonText2}
                </Text>
            </TouchableOpacity>}
        </View>
    )

}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
        paddingHorizontal: 20,
        justifyContent: "center"
    },
    image: {
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
        textAlign: "center"
    }
})