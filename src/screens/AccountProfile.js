import React from 'react'
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome';
import MainMenu from '../components/common/AnimatedMenu';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { signOutAction } from '../redux/UserDuck'
import { connect } from 'react-redux'
import GastroModal from '../components/common/GastroModal';



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
        tooltip: false,
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
    }

    logOut = () => {
        this.props.signOutAction()
        this.props.navigation.navigate('Login')
    }

    render() {
        let { followers = [],
            following = [],
            title, name, dadSurname, momSurname, birthDate, city, state, membershipStatus, speciality, photoURL } = this.props
        let { user, open, tooltip } = this.state
        let nombre = `${name || ''} ${dadSurname || ''} ${momSurname || ''}`
        if (nombre === '  ' || !nombre) nombre = "No has completado tus datos"
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
                contentContainerStyle={{ flex: 1, backgroundColor: "#f4f4f4" }}>
                <ScrollView>
                    <View style={[styles.container]}>
                        {/* basic info */}
                        <View style={[styles.basicInfo]}>
                            <Image style={[styles.image]} source={photoURL ? { uri: photoURL } : userImg} />
                            <Text style={[styles.name]}>
                                {nombre}
                            </Text>
                            <Text style={[styles.simpleText]}>
                                {city ? `${city}, ${state}` : "Completa tu datos de ubicación"}
                            </Text>
                            <View>
                                <Text style={[styles.header]}>
                                    {`Socio ${membershipStatus}`}
                                </Text>
                                <Text>{speciality}</Text>
                            </View>
                        </View>
                        {/* Followers */}
                        <View style={[styles.info]}>
                            <View style={[styles.number]}>
                                <Text style={styles.followers}>
                                    Seguidores:
                           </Text>
                                <Text style={styles.followNumber}>
                                    {followers.length}
                                </Text>
                            </View>
                            <View style={[styles.number]}>
                                <Text style={styles.followers}>
                                    Seguidos:
                           </Text>
                                <Text style={styles.followNumber}>
                                    {following.length}
                                </Text>
                            </View>
                        </View>
                        {/* history */}
                        <TouchableOpacity onPress={() => this.setState({ tooltip: true })}>
                            <View style={[styles.history]}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('UserPayments')}>
                                    <View style={[styles.histoyCard]}>
                                        <Text style={styles.historyText}>Mis pagos</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={[styles.histoyCard]}>
                                    <Text style={styles.historyText}>Mis constancias</Text>
                                </View>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home', { event: false })}>
                                    <View style={[styles.histoyCard]}>
                                        <Text style={styles.historyText}>Mis publicaciones</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Membership')}
                                >
                                    <View style={[styles.histoyCard]}>
                                        <Text style={styles.historyText}>Membresía</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <MainMenu />
                <GastroModal
                    isVisible={open}
                    text={"¿Estas segur@ de que deseas cerrar sesión?"}
                    onCancel={() => this.setState({ open: false })}
                    onAccept={this.logOut}
                    acceptButtonText="Cerrar sesión"
                />
                <GastroModal
                    isVisible={tooltip}
                    title="Versión de prueba"
                    text={"Esta función estará disponible en la siguiente versión"}
                    onAccept={() => this.setState({ tooltip: false })}
                    onlyOne={true}
                />
            </KeyboardAwareScrollView>
        )
    }
}

function mapState({ user }) {
    console.log(user)
    return {
        ...user,
        ...user.basicData,
        ...user.address
    }
}

export default connect(mapState, { signOutAction })(AccountProfile)

let styles = StyleSheet.create({
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
        fontSize: 18,
        marginVertical: 20
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
