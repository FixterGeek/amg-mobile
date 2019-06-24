import React from 'react'
import {View, Text, StyleSheet, Platform} from 'react-native'

export default function Header(){
    return(
        <View style={styles.iosHeader}>
            <Text>Blissito</Text>
        </View>
    )
}

let styles = StyleSheet.create({
    iosHeader:{
        paddingHorizontal:20,
        paddingVertical:10,
        textAlign:"center"
    }
})