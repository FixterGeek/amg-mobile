import React from 'react'
import {
    View,
    Image,
    Text,
    TextInput,
    ImageBackground,
    StyleSheet,
    Button,
    Platform
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from "react-native-modal-loader";
import { AsyncStorage } from 'react-native'
import EditButton from '../components/common/EditButton';

let userImg = require('../../assets/user-img.png')

export default class AccountProfile extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Perfil" || navigation.state.routeName,
            headerRight: (<Icon
                onPress={() => navigation.navigate('EditAccount')}
                style={styles.editIcon} name="edit" size={20} color="#000" />),
            headerLeft: (<Icon
                onPress={() => navigation.pop()}
                style={styles.editIcon} name="power-off" size={20} color="#000" />)
        }
    }


    state = {
        user: {},
        loading: false
    }

    componentWillMount() {
        AsyncStorage.getItem('userData')
            .then(data => {
                let userParsed = JSON.parse(data)
                if (userParsed) this.setState({ user: userParsed.user })
            })
            .catch(() => this.props.navigation.navigate('Login'))
    }

    signOut = () => { }

    render() {
        let { user } = this.state
        user.name = `${user.firstName || "María Eugenia"} ${user.lastName || "Icaza"} ${user.surName || "Chavez"}`
        console.log("usuario: ", user)
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
                contentContainerStyle={{ flex: 1, backgroundColor: "#f4f4f4" }}>
                <View style={[styles.container]}>
                    <View >
                        <Text style={[styles.name]}>
                            {user.gender === "Male" ? "Dr." : "Dra."} {user.name}
                        </Text>
                    </View>
                    <View style={[styles.info]}>
                        <Image style={[styles.image]} source={user.photoURL ? { uri: user.photoURL } : userImg} />
                        <View style={[styles.basicInfo]}>
                            <Text style={[styles.header]}>
                                {user.type || "Socio emérito"}
                            </Text>
                            <Text style={[styles.simpleText]}>
                                {user.specialtity || "Gastroenterología"}
                            </Text>
                            <Text style={[styles.simpleText]}>
                                {user.city || "Mérida, Yucatan"}
                            </Text>
                            <View style={[styles.cards]}>
                                <View style={[styles.littleCard]}>
                                    <Text>
                                        Siguiendo
                                    </Text>
                                    <Text style={[styles.number]}>
                                        2MM
                                    </Text>
                                </View>
                                <View style={[styles.littleCard]}>
                                    <Text >
                                        Seguidos
                                    </Text>
                                    <Text style={[styles.number]}>
                                        10M
                                    </Text>
                                </View>
                            </View>
                        </View>

                    </View>

                    {/* <View>
                        <EditButton
                            style={{ alignSelf: "flex-end" }}
                            text="Cerrar sesión"
                        />
                    </View> */}



                </View>
            </KeyboardAwareScrollView>
        )
    }
}

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
    number: {
        fontWeight: "bold",
        fontSize: 18
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
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between"
    },
    info: {
        flex: 0,
        flexDirection: "row",
        alignItems: "center"
    },
    name: {
        fontSize: 22
    }
})