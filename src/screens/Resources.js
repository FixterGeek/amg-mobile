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

export default class Resources extends React.Component {
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
                contentContainerStyle={{ flex: 1 }}>
                <View style={[styles.container]}>
                    <View>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Guides')}
                        >
                            <Text style={[styles.item]}>
                                Guías y consensos
                    </Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Text style={[styles.item]}>
                                Publicaciones
                    </Text>
                        </TouchableOpacity>
                    </View>
                    <Image style={[styles.image]} source={require('../../assets/takeda.png')} />
                </View>

            </KeyboardAwareScrollView>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 20
    },
    image: {
        alignSelf: "center",
        marginTop: 150
    },
    item: {
        alignSelf: "stretch",
        backgroundColor: "#eaf0f7",
        paddingHorizontal: 30,
        paddingVertical: 15,
        marginBottom: 20
    }
})