import React from 'react'
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform,
    Button
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome';
import { AsyncStorage } from 'react-native'
import MainMenu from '../components/common/MainMenu';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { signOutAction } from '../redux/UserDuck'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'



let userImg = require('../../assets/user-img.png')

class AccountProfile extends React.Component {

    static navigationOptions = ({ navigation }) => {
        let params = navigation.state.params || {}
        return {
            headerTitle: (params.title) || navigation.state.routeName,
            headerRight: params.headerRight,
            headerLeft: params.headerLeft
        }
    }


    state = {
        user: {},
        loading: false,
        open: false
    }

    _setNavigationParams = () => {
        let headerLeft = (<Icon
            onPress={() => {
                this.setState({ open: true })
            }}
            style={styles.editIcon} name="power-off" size={20} color="#000" />)
        let headerRight = (<Icon
            onPress={() => this.props.navigation.navigate('EditAccount')}
            style={styles.editIcon} name="edit" size={20} color="#000" />)

        this.props.navigation.setParams({
            title: "Perfil de usuario",
            headerLeft,
            headerRight,
            hideTabBar: false
        })
    }

    componentWillMount() {
        this._setNavigationParams()
        AsyncStorage.getItem('userData')
            .then(data => {
                let userParsed = JSON.parse(data)
                console.log("user", userParsed)
                if (userParsed) this.setState({ user: userParsed })
            })
            .catch(() => this.props.navigation.navigate('Login'))
    }

    logOut = () => {
        console.log("pachurrado")
        this.props.signOutAction()
        this.props.navigation.navigate('Login')
    }

    render() {
        let { user, open } = this.state
        user.name = `${user.firstName || "María Eugenia"} ${user.lastName || "Icaza"} ${user.surName || "Chavez"}`
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
                contentContainerStyle={{ flex: 1, backgroundColor: "#f4f4f4" }}>
                <ScrollView>
                    <View style={[styles.container]}>
                        {/* basic info */}
                        <View style={[styles.basicInfo]}>
                            <Image style={[styles.image]} source={user.photoURL ? { uri: user.photoURL } : userImg} />
                            <Text style={[styles.name]}>
                                {user.gender === "Male" ? "Dr." : "Dra."} {user.name}
                            </Text>
                            <Text style={[styles.simpleText]}>
                                {user.city || "Mérida, Yucatan"}
                            </Text>
                            <View>
                                <Text style={[styles.header]}>
                                    {user.type || "Socio emérito"}
                                </Text>
                                <Text>Gastroenterología</Text>
                            </View>
                        </View>
                        {/* Followers */}
                        <View style={[styles.info]}>
                            <View style={[styles.number]}>
                                <Text style={styles.followers}>
                                    Seguidores:
                           </Text>
                                <Text style={styles.followNumber}>102</Text>
                            </View>
                            <View style={[styles.number]}>
                                <Text style={styles.followers}>
                                    Seguidos:
                           </Text>
                                <Text style={styles.followNumber}>68</Text>
                            </View>
                        </View>
                        {/* history */}
                        <View style={[styles.history]}>
                            <View style={[styles.histoyCard]}>
                                <Text style={styles.historyText}>Mis pagos</Text>
                            </View>
                            <View style={[styles.histoyCard]}>
                                <Text style={styles.historyText}>Mis constancias</Text>
                            </View>
                            <View style={[styles.histoyCard]}>
                                <Text style={styles.historyText}>Mis publicaciones</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <MainMenu />
                <Modal isVisible={open}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>GASTRO</Text>
                        <Text style={styles.modalSubTitle}>¿Estas segur@ de que deseas cerrar sesión?</Text>
                        <View style={[styles.modalButtons]}>
                            <TouchableOpacity
                                onPress={() => this.setState({ open: false })}
                                style={styles.modalButtonCancel} >
                                <Text style={styles.textCancel}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.logOut}
                                style={styles.modalButton} >
                                <Text style={styles.buttonText}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </KeyboardAwareScrollView>
        )
    }
}

function mapState(state) {
    return {}
}

export default connect(mapState, { signOutAction })(AccountProfile)

let styles = StyleSheet.create({
    modal: {
        backgroundColor: "white",
        paddingVertical: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 12,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        minHeight: 100
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20
    },
    modalSubTitle: {
        textAlign: "center",
        fontSize: 18,
        maxWidth: 200
    },
    modalButtons: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        flexDirection: 'row'
    },
    modalButton: {
        marginHorizontal: 5,
        backgroundColor: "#28abd8",
        borderWidth: 0,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 10,
        minWidth: 120,
        textAlign: "center"
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    textCancel: {
        color: "#28abd8",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalButtonCancel: {
        marginHorizontal: 5,
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: "#28abd8",
        borderWidth: 2,
        minWidth: 120,

    },
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 20,
        paddingTop: 20
    },
    editIcon: {
        padding: 20,
        paddingBottom: 20,
        color: "#686666"
    },
    cards: {
        flex: 0,
        flexDirection: "row"
    },
    littleCard: {
        backgroundColor: "lightgrey",
        paddingVertical: 15,
        paddingHorizontal: 5,
        textAlign: "center",
        flex: 0,
        alignItems: "center",
        marginRight: 5
    },
    image: {
        width: 200,
        height: 200
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10
    },
    simpleText: {
        marginBottom: 5
    },
    basicInfo: {
        backgroundColor: "#f5f8f9",
        marginVertical: 2,
        flex: 0,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10
    },
    info: {
        marginVertical: 2,
        flex: 0,
        flexDirection: "row",
        alignItems: "center",
    },
    number: {
        height: 80,
        backgroundColor: "#f5f8f9",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 2,

    },
    followNumber: {
        fontSize: 22,
        fontWeight: "bold"
    },
    name: {
        fontSize: 18
    },
    history: {
        marginTop: 20,
        flex: 0,
        flexDirection: "column",
    },
    historyText: {
        fontSize: 18,
    },
    histoyCard: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: "#eaf0f7",
        marginVertical: 10
    },

})
