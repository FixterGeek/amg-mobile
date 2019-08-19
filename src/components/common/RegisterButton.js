import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'

export default function RegisterButton({ disabled, loading, text, style, marginVertical, onPress, alreadyRegistered, alreadyRegisteredText }) {
    if (disabled) return (
        <View style={[styles.container, style, { marginVertical: marginVertical || 50, marginBottom: 100 }, styles.disabled]}>
            <Text style={[styles.text]}>{text || "Registrarse"}</Text>
        </View>
    )
    if (alreadyRegistered) return (
        <TouchableOpacity
            onPress={onPress}
        >
            <View style={[styles.alreadyContainer, style, { marginVertical: marginVertical || 50, marginBottom: 100 }]}>
                <Text style={[styles.text]}>{alreadyRegisteredText || "Registrado"}</Text>
            </View>
        </TouchableOpacity>

    )
    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <View style={[styles.container, style, { marginVertical: marginVertical || 50, marginBottom: 100 }]}>
                <Text style={[styles.text]}>{text || "Registrarse"}</Text>
            </View>
        </TouchableOpacity>

    )
}

RegisterButton.defaultProps = {
    onPress: () => { }
}

let styles = StyleSheet.create({
    disabled: {
        backgroundColor: "lightgrey"
    },
    alreadyContainer: {
        flex: 0,
        padding: 20,
        backgroundColor: "green",
        borderColor: "black",
        alignItems: "center"
    },
    container: {
        flex: 0,
        padding: 20,
        backgroundColor: "#1f2536",
        borderColor: "black",
        alignItems: "center"
    },
    text: {
        fontWeight: "bold",
        fontSize: 18,
        color: "white"
    }
})