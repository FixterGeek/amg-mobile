import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Linking
} from 'react-native'
import NavigationService from '../../services/NavigationService'
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native-gesture-handler';

let revista = "http://www.revistagastroenterologiamexico.org/?codref=ddh3dk3Yjdsafg503zSInMNxBdsddsa545vs809jdn02nubHHtJufRpNPu3hjd673&py=7jb39db3"

export default class MainMenu extends React.Component {

    state = {
        open: false
    }

    _navigate = (route) => {
        this.setState({ open: false })
        NavigationService.navigate(route)
    }

    render() {
        let { open } = this.state
        return (

            <View style={[styles.container]} >
                {open && <View style={styles.overlay}></View>}
                {open &&
                    <View style={[styles.circle]}>
                        <Text style={[styles.text]} >Inicio</Text>
                        <Icon
                            onPress={() => this._navigate('Events')}
                            style={styles.icon} name="home" size={20} color="white" />
                    </View>}
                {open && <View style={[styles.circle]}>
                    <Text style={[styles.text]} >Eventos</Text>
                    <Icon
                        onPress={() => this._navigate('Events')}
                        style={styles.icon} name="calendar" size={20} color="white" />
                </View>}
                {open && <View style={[styles.circle]}>
                    <Text style={[styles.text]} >Revista</Text>
                    <Icon
                        onPress={() => Linking.openURL(revista)}
                        style={styles.icon} name="book" size={20} color="white" />
                </View>}
                {open && <View style={[styles.circle]}>
                    <Text style={[styles.text]} >Recursos</Text>
                    <Icon
                        onPress={() => this._navigate('Resources')}
                        style={styles.icon} name="graduation-cap" size={20} color="white" />
                </View>}
                {open && <View style={[styles.circle]}>
                    <Text style={[styles.text]} >Perfil</Text>
                    <Icon
                        onPress={() => this._navigate('Profile')}
                        style={styles.icon} name="user" size={20} color="white" />
                </View>}
                <TouchableOpacity
                    onPress={() => this.setState({ open: !open })}
                >
                    <View
                        style={[styles.circle, styles.main]}>

                        <Icon
                            style={styles.icon} name="bars" size={20} color="white" />


                    </View>
                </TouchableOpacity>

            </View >
        )
    }
}

let styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: "-400%",
        left: "-1000%",
        width: "2000%",
        height: "1000%",
        backgroundColor: "black",
        opacity: .6,
        zIndex: 0
    },
    container: {
        zIndex: 9999,
        position: "absolute",
        bottom: 0,
        right: 0,
    },
    text: {
        position: "absolute",
        left: -80,
        color: "white",
        fontSize: 15,
        width: 100
    },
    main: {
        marginBottom: 50,
        marginRight: 20
    },
    circle: {
        position: "relative",
        borderRadius: 100,
        backgroundColor: "black",
        width: 50,
        height: 50,
        flex: 0,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15
    },
    icon: {
        color: "white",
        fontSize: 30
    }
})