import React from 'react'
import {
    View,
    Image,
    Text,
    TextInput,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Platform
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome';
import { login } from '../services/auth'


let background = require('../../assets/login_bacground.png')
let logo = require('../../assets/logo.png')

export default class Home extends React.Component {
    static navigationOptions = { headerVisible: true, title: "Recursos" }

    state = {
        user: {},
        loading: false
    }

    signOut = () => {
    }

    render() {

        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
                contentContainerStyle={{ flex: 1, backgroundColor: "red" }}>

            </KeyboardAwareScrollView>
        )
    }
}

let styles = StyleSheet.create({
    container: {}
})