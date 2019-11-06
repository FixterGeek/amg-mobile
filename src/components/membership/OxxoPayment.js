import React, { Component } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import RegisterButton from '../common/RegisterButton'
import { TouchableOpacity } from 'react-native-gesture-handler'


let texto = "Tu membresía ha sido renovada. Recibirás un correo de confirmación "

export default function OxxoPayment({
    onAccept,
}) {
    let oxxo = require('../../../assets/oxxo.png')
    return (
        <View style={styles.container}>
            <Text style={styles.title} >Pago en OXXO</Text>
            <Image style={styles.image} source={oxxo} />

            <Text style={styles.subtitle}>
                Instrucciones
            </Text>
            <Text style={styles.text}>
                1. Da clic en Generar Referencia
            </Text>
            <Text style={styles.text}>
                2. Usa la referencia para pagar en
    cajas.
            </Text>
            <Text style={styles.text}>
                3. Recibirás un e-mail cuando el pago haya sido aprobado
            </Text>
            <TouchableOpacity
                onPress={onAccept}
            >
                <Text
                    style={styles.button1}
                >
                    Generar referencia
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