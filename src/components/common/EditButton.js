import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import NavigationService from '../../services/NavigationService'

export default function EditButton({ text, style }) {
    return (
        <TouchableOpacity
            onPress={() => NavigationService.navigate("EditAccount")}
        >
            <View style={[styles.container, style]}>
                <Text style={[styles.text]}>{text || "Edit"}</Text>
            </View>
        </TouchableOpacity>

    )
}

let styles = StyleSheet.create({
    container: {
        flex: 0,
        padding: 20,
        backgroundColor: "#f8f8ff",
        borderColor: "black"
    },
    text: {
        fontWeight: "bold",
        fontSize: 18,
    }
})