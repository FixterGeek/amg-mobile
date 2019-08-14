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
import Spinner from 'react-native-loading-spinner-overlay';
import { AsyncStorage } from 'react-native'
import { getEvents } from '../redux/EventsDuck';
import { connect } from 'react-redux'
import { tryLogin, loginSuccess } from '../redux/UserDuck'


let background = require('../../assets/login_bacground.png')
let logo = require('../../assets/logo.png')

class Login extends React.Component {
    static navigationOptions = { headerVisible: false, header: null }

    state = {
        auth: {
            email: null,
            password: null
        },
        loading: false
    }

    componentDidUpdate() {
        if (this.props.loggedIn) {
            this.props.getEvents()
            this.props.navigation.navigate('Events', {
                user: this.props.user,
                reload: true
            })
        }
    }

    // componentWillMount() {
    //     AsyncStorage.getItem('userData').then(data => {
    //         let userParsed = JSON.parse(data)
    //         if (userParsed) {
    //             this.props.getEvents()
    //             this.props.navigation.navigate('Events', { // while developing
    //                 user: userParsed,
    //                 reload: true
    //             })
    //         }

    //     })

    // }

    componentDidMount() {
        AsyncStorage.getItem('userData')
            .then(user => {
                if (typeof user === "string") {
                    try {
                        let parsed = JSON.parse(user)
                        this.props.loginSuccess(parsed)
                    } catch (e) { }

                }
            })
    }

    onChange = (field, text) => {
        let { auth } = this.state
        auth[field] = text.toLowerCase()
        this.setState({ auth })
    }

    signIn = () => {
        this.props.tryLogin(this.state.auth)
    }

    render() {
        let { fetching, error } = this.props
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
                contentContainerStyle={{ flex: 1, backgroundColor: "red" }}>

                <ImageBackground
                    style={styles.container}
                    imageStyle={{ borderRadius: 0 }}
                    source={background}>
                    <Spinner animation="fade" visible={fetching} />
                    <View style={styles.over}>

                        <Image
                            source={logo}
                            style={{ width: 200 }}
                            resizeMode='contain'
                        />
                        <View style={styles.searchSection}>
                            <Icon style={styles.searchIcon} name="envelope" size={20} color="#000" />
                            <TextInput
                                value={this.state.auth.email}
                                onChangeText={text => this.onChange("email", text)}
                                style={styles.input}
                                placeholder="Correo electrónico"
                                // onChangeText={(searchString) => {this.setState({searchString})}}
                                underlineColorAndroid="transparent"
                                placeholderTextColor='#686666'
                            />
                        </View>
                        <View style={styles.searchSection}>
                            <Icon style={styles.searchIcon} name="lock" size={20} color="#000" />
                            <TextInput
                                value={this.state.auth.password}
                                onChangeText={text => this.onChange("password", text)}
                                style={styles.input}
                                placeholder="Contraseña"
                                secureTextEntry
                                underlineColorAndroid="transparent"
                                placeholderTextColor='#686666'
                            />
                        </View>
                        <View style={{ flex: 0, flexDirection: "row", justifyContent: "flex-start" }}>
                            <Icon style={[{ color: "#28abd8", paddingRight: 10, paddingBottom: 20 }]} name="check-circle" size={20} />
                            <Text style={{ color: "#bbbbbb" }} >Mantener mi sesion activa</Text>
                        </View>

                        <TouchableOpacity
                            disabled={!this.state.auth.email || !this.state.auth.password}
                            style={!this.state.auth.email || !this.state.auth.password ? styles.disableLogin : styles.loginScreenButton}
                            //onPress={() => navigation.navigate('Events')}
                            onPress={this.signIn}
                            underlayColor='#fff'>
                            <Text style={styles.loginText}>INICIAR SESIÓN</Text>
                        </TouchableOpacity>

                        <View>
                            <Text style={{ color: "#28abd8" }} > ¿Olvidaste tu contraseña? </Text>
                        </View>

                        <View style={{ flex: 0, flexDirection: "row", marginTop: 100 }}>
                            <Text style={{ color: "#fff" }} >¿No tienes cuenta? </Text>
                            <Text style={{ color: "#28abd8" }} > Registrate aquí</Text>
                        </View>


                    </View>
                    <View style={styles.layer}></View>

                </ImageBackground>
            </KeyboardAwareScrollView>
        )
    }
}

//redux

function mapStateToProps({ user }) {
    return {
        ...user,
        user
    }
}
export default connect(mapStateToProps, { tryLogin, getEvents, loginSuccess })(Login)

let styles = StyleSheet.create({
    loginScreenButton: {
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 105,
        backgroundColor: '#28abd8',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'transparent',
        margin: 20
    },
    loginText: {
        color: '#fff',
        textAlign: 'center',
        // fontWeight: 900,
    },
    disableLogin: {
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 105,
        backgroundColor: 'grey',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'transparent',
        margin: 20
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        fontFamily: "Avenir"

    },
    over: {
        zIndex: 999,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    login: {
        fontSize: 25,
        textAlign: 'center',
        margin: 10,
        color: "white",
    },
    layer: {
        position: 'absolute',
        top: 0,
        backgroundColor: 'black',
        width: "100%",
        height: "100%",
        opacity: .1,
        zIndex: 9
    },
    searchSection: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#343434',
        opacity: .5,
        marginBottom: 20,
        marginHorizontal: 20
    },
    searchIcon: {
        padding: 10,
        paddingTop: 20,
        color: "#686666"
    },
    input: {
        fontSize: 20,
        flex: 1,
        paddingTop: 30,
        paddingRight: 10,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: 'transparent',
        color: '#fff',
        marginBottom: 20,
        fontFamily: "Avenir",
    },
})