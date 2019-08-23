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
import axios from 'axios'


let baseURL = "https://amg-api.herokuapp.com"
let background = require('../../assets/login_bacground.png')
let logo = require('../../assets/logo.png')

export default class PasswordRecovery extends React.Component {
    static navigationOptions = { headerVisible: true }

    state = {
        email: null,
        sent: false,
        user: {},
        loading: false
    }

    sendRecoveryEmail = () => {
        let { email } = this.state
        axios.post(baseURL + "/auth/forgot", { email })
        this.setState({ sent: true })
    }

    render() {
        if (this.state.sent) return (
            <ImageBackground
                source={background} style={styles.container}
            >
                <Image
                    source={logo}
                    style={{ width: 200, margin: 0 }}
                    resizeMode='contain'
                />
                <Text style={styles.underLogo}>Restablecer contraseña</Text>
                <Text style={styles.text}>En la bandeja de entrada de {this.state.email} encontrarás instrucciones sobre cómo restablecer tu contraseña.</Text>
                <Text style={{ color: "#bbbbbb" }} >=================================</Text>
                <Text style={{ color: "#bbbbbb" }}>¿Dudas si esa dirección de correo era correcta?   </Text>
                <Text style={{ color: "#28abd8" }} >Podemos ayudarte</Text>
            </ImageBackground >
        )
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
                contentContainerStyle={{ flex: 1, backgroundColor: "grey" }}>
                <ImageBackground
                    source={background} style={styles.container}
                >
                    <Image
                        source={logo}
                        style={{ width: 200 }}
                        resizeMode='contain'
                    />
                    <Text style={styles.underLogo}>Restablecer contraseña</Text>
                    <Text style={styles.text}>Para restablecer tu contraseña, introduce la dirección de correo electrónico que utilizas para iniciar sesión en GASTRO</Text>
                    <View style={styles.searchSection}>
                        <Icon style={styles.searchIcon} name="envelope" size={20} color="#000" />
                        <TextInput
                            value={this.state.email}
                            onChangeText={email => this.setState({ email })}
                            style={styles.input}
                            placeholder="Correo electrónico"
                            // onChangeText={(searchString) => {this.setState({searchString})}}
                            underlineColorAndroid="transparent"
                            placeholderTextColor='#686666'
                        />
                    </View>
                    <TouchableOpacity
                        disabled={!this.state.email}
                        style={!this.state.email ? styles.disableLogin : this.state.email.includes("@") ? styles.loginScreenButton : styles.disableLogin}
                        onPress={this.sendRecoveryEmail}
                        underlayColor='#fff'>
                        <Text style={styles.loginText}>Obtener enlace para restablecer</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 0, flexDirection: "row", marginTop: 100 }}>
                        <Text style={{ color: "#fff" }} >¿No tienes cuenta? </Text>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Signup')}
                        >
                            <Text style={{ color: "#28abd8" }} > Registrate aquí</Text>
                        </TouchableOpacity>

                    </View>
                </ImageBackground>
            </KeyboardAwareScrollView>
        )
    }
}

let styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", width: '100%', height: '150%', paddingTop: 100 },
    searchSection: {
        flexDirection: 'row',
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#343434',
        opacity: .6,
        marginVertical: 10,
        marginHorizontal: 20,
        alignSelf: "stretch",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 5,
        marginVertical: 30
    },
    searchIcon: {
        color: "#686666",
        width: 30,
        backgroundColor: "transparent",
    },
    input: {
        width: "85%",
        fontSize: 20,
        backgroundColor: 'transparent',
        color: '#fff',

    },
    text: {
        textAlign: "left",
        paddingHorizontal: 20,
        fontSize: 18,
        color: "white",

    },
    underLogo: {
        textAlign: "center",
        paddingHorizontal: 20,
        fontSize: 16,
        color: "white",
        marginBottom: 30
    },
    loginScreenButton: {
        paddingVertical: 20,
        backgroundColor: '#28abd8',
        borderRadius: 5,
        marginBottom: 20,
        alignSelf: "stretch",
        marginHorizontal: 20
    },
    disableLogin: {
        paddingVertical: 20,
        backgroundColor: 'grey',
        borderRadius: 5,
        alignSelf: "stretch",
        marginBottom: 20,
        marginHorizontal: 20
    },
    loginText: {
        fontSize: 16,
        fontWeight: "bold",
        color: '#fff',
        textAlign: 'center',
    }
})