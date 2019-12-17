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
import axios from 'axios'



let userImg = require('../../assets/user-img.png')

class AccountProfile extends React.Component {

    static navigationOptions = { headerVisible: true, title: "Perfil público" }

    state = {
        user: {},
        followText: "Seguir"
    }

    componentWillMount() {
        let user = this.props.navigation.getParam('item')
        this.setState({ user }, this.checkIfFollow)

    }

    checkIfFollow = () => {
        console.log("orale", this.state.user.followers)
        // if (!this.state.user || !this.state.user.followers) return
        let following = this.state.user.followers.find(f => f == this.props.myId)
        if (following) this.setState({ followText: "Siguiendo" })
        else this.setState({ followText: "Seguir" })
    }

    follow = () => {
        axios.post(`https://amg-api.herokuapp.com/users/${this.state.user._id}/follow`,
            {},
            { headers: { Authorization: this.props.token } })
            .then(res => {
                this.setState({ user: res.data.following }, this.checkIfFollow)
            })
            .catch(e => {
                console.log(e)
            })

    }

    render() {
        let { followers = [], following = [], basicData = {}, address = {}, membershipStatus } = this.state.user
        let { city, state, } = address
        let {
            name, dadSurname,
            momSurname,
            birthDate,
            speciality,
            photoURL
        } = basicData
        let nombre = `${name || ''} ${dadSurname || ''} ${momSurname || ''}`
        let { followText } = this.state
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
                                {city ? `${city}, ${state}` : "datos de ubicación incompletos"}
                            </Text>
                            <View>
                                <Text style={[styles.header]}>
                                    {`${membershipStatus}`}
                                </Text>
                                <Text>{speciality}</Text>
                            </View>
                            {this.props.myId !== this.state.user._id && <TouchableOpacity
                                onPress={this.follow}
                            >
                                <Text style={[styles.followButton]}>
                                    {followText}
                                </Text>
                            </TouchableOpacity>}
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

                    </View>
                </ScrollView>
                <MainMenu />

            </KeyboardAwareScrollView>
        )
    }
}

function mapState({ user }) {
    return {
        myId: user._id,
        token: user.token
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
    followButton: {
        alignSelf: "stretch",
        backgroundColor: "#eaf0f7",
        paddingHorizontal: 30,
        paddingVertical: 15,
        marginBottom: 20
    }

})
