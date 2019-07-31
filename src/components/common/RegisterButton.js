import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import NavigationService from '../../services/NavigationService'

export default function RegisterButton({ text, style, marginVertical }) {
    return (
        <TouchableOpacity
            onPress={() => { }}
        >
            <View style={[styles.container, style, { marginVertical: marginVertical || 50, marginBottom: 100 }]}>
                <Text style={[styles.text]}>{text || "Edit"}</Text>
            </View>
        </TouchableOpacity>

    )
}

let styles = StyleSheet.create({
    container: {
        flex: 0,
        padding: 20,
        backgroundColor: "#1f2536",
        borderColor: "black",
        alignItems: "center"
    },
    text: {
        fontWeight: "bolder",
        fontSize: 18,
        color: "white"
    }
})