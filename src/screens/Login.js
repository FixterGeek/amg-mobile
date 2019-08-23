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
// import Video from 'react-native-video';
import { Video } from 'expo-av';

let video = "https://firebasestorage.googleapis.com/v0/b/reactfirebase-b16aa.appspot.com/o/videos%2FMasterApp.mp4?alt=media&token=52986935-a8b9-46b4-8ece-7c13c1605de6"


let background = require('../../assets/login_bacground.png')
let logo = require('../../assets/logo.png')

class Login extends React.Component {
    static navigationOptions = { headerVisible: false, header: null }

    state = {
        eye: false,
        auth: {
            email: null,
            password: null
        },
        loading: false,
        error: false
    }

    componentDidUpdate() {
        if (this.props.loggedIn) {
            this.props.getEvents()
            this.props.navigation.navigate('Events', {
                user: this.props.user,
                reload: false
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

    componentWillReceiveProps(newProps) {
        if (!newProps.error) return
        this.setState({ error: newProps.error })

    }

    render() {
        let { fetching } = this.props
        let { error } = this.state
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
                contentContainerStyle={{ flex: 1, backgroundColor: "grey" }}>

                <View style={styles.overlay}></View>

                <Video
                    //source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                    source={{ uri: video }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={styles.backgroundVideo}
                />
                <View
                    style={styles.container}
                    imageStyle={{ borderRadius: 0 }}
                //source={background}
                >
                    <Spinner animation="fade" visible={fetching} />
                    <View style={styles.over}>




                        <Image
                            source={logo}
                            style={{ width: 200 }}
                            resizeMode='contain'
                        />
                        {error && <Text style={styles.error}>Usuario o contraseña incorrectos</Text>}
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
                                secureTextEntry={!this.state.eye}
                                underlineColorAndroid="transparent"
                                placeholderTextColor='#686666'
                            />
                            <TouchableOpacity
                                onPress={() => this.setState({ eye: !this.state.eye })}
                            >
                                <Icon

                                    style={styles.searchIcon}
                                    name={this.state.eye ? "eye" : "eye-slash"}
                                    size={20}
                                    color="#000" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignSelf: "flex-start", margin: 20, flex: 0, flexDirection: "row", justifyContent: "flex-start" }}>
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
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Recovery')}>
                                <Text style={{ color: "#28abd8" }} > ¿Olvidaste tu contraseña? </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 0, flexDirection: "row", marginTop: 100 }}>
                            <Text style={{ color: "#fff" }} >¿No tienes cuenta? </Text>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Signup')}
                            >
                                <Text style={{ color: "#28abd8" }} > Registrate aquí</Text>
                            </TouchableOpacity>

                        </View>


                    </View>
                    <View style={styles.layer}></View>
                </View>
                {/* 
                 // image */}
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        background: "rgba(0,0,0,0.5)",
        zIndex: 999,

    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "black",
        opacity: .6,
        zIndex: 1
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,

    },
    error: {
        textAlign: "center",
        fontSize: 16,
        color: "red"
    },
    loginScreenButton: {
        paddingVertical: 20,
        backgroundColor: '#28abd8',
        borderRadius: 5,
        marginBottom: 20,
        alignSelf: "stretch",
        marginHorizontal: 20
    },
    loginText: {
        fontSize: 16,
        fontWeight: "bold",
        color: '#fff',
        textAlign: 'center',
    },
    disableLogin: {
        paddingVertical: 20,
        backgroundColor: 'grey',
        borderRadius: 5,
        alignSelf: "stretch",
        marginBottom: 20,
        marginHorizontal: 20
    },

    over: {
        width: "100%",
        alignItems: 'center',
        zIndex: 999
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
        borderRadius: 5
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
        color: '#fff'
    },
})


// <Video source={{ uri: "https://video.fmex6-1.fna.fbcdn.net/v/t42.9040-2/10000000_2357590327629938_7256647928662458368_n.mp4?_nc_cat=1&efg=eyJ2ZW5jb2RlX3RhZyI6InN2ZV9zZCJ9&_nc_eui2=AeEMCXn6LN8f4FybyCwgmm7ExufWzOXs3iITPSdYGxw9E_q9CiqmajpNlXP5I_Mof8Y3ElPtCSdSX_GDGDCAJApW1tvMwoAi279ZUqHvOmFPJw&_nc_oc=AQlB-TkW87m2aiwOAMEOvRRjJW5-LVLzhRocTe5oS-z_DAP6YN2nzzXbb5IoENdMKuE&_nc_ht=video.fmex6-1.fna&oh=89c4662188d555b0abb0f3d99e2023bf&oe=5D5CA57D" }}   // Can be a URL or a local file.
// style={styles.backgroundVideo} />