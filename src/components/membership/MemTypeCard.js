import React from 'react'
import {
    View,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

export default function MemTypeCard({
    tipo = "Socio en entrenamiento",
    price = 4750,
    active,
    onPress
}) {
    return (
        <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
            <View style={[styles.container, (active && styles.active)]} >
                <Text style={styles.title}>{tipo}</Text>
                <Text style={styles.price}>${price}</Text>
                <Text style={styles.mxn}>MXN</Text>
                <Text style={styles.anual}>anual</Text>
            </View>
        </TouchableOpacity>
    )
}

let styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#eaf0f7",
        marginVertical: 5,
        alignItems: "center"
    },
    active: {
        backgroundColor: "#abb4d0",
        color: "white",
        borderWidth: 2,
        borderColor: "#1f2536",
        marginHorizontal: 20,
    },
    mxn: {
        fontSize: 18
    },
    anual: {
        fontWeight: "bold"
    },
    title: {
        fontSize: 18
    },
    price: {
        fontSize: 36
    }
})