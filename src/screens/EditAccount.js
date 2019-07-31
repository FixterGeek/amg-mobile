import React from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


let background = require('../../assets/login_bacground.png')
let logo = require('../../assets/logo.png')

export default class EditAccount extends React.Component {
    static navigationOptions = { headerVisible: true, title: "Editar Info" }

    state = {
        user: {},
        loading: false,
        form: {
            first_name: ''
        }
    }

    signOut = () => {
    }

    render() {

        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
                contentContainerStyle={{ flex: 1, backgroundColor: "#f4f4f4" }}>
                <View>
                    <Text>Nombres:</Text>
                    <TextInput
                        style={[styles.input]}
                        onChangeText={(text) => this.setState({ text })}
                        value="Tu nombre"
                    />
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

let styles = StyleSheet.create({
    container: {},
    input: { height: 40, borderColor: '#9393ff', borderWidth: 1 }
})