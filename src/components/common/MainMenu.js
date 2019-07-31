import React from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import NavigationService from '../../services/NavigationService'
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
                        onPress={() => this._navigate('Revista')}
                        style={styles.icon} name="book" size={20} color="white" />
                </View>}
                {open && <View style={[styles.circle]}>
                    <Text style={[styles.text]} >Recursos</Text>
                    <Icon
                        onPress={() => this._navigate('Recursos')}
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
    container: {
        position: "absolute",
        bottom: 0,
        right: 0
    },
    text: {
        position: "absolute",
        left: -80,
        color: "darkgrey",
        fontSize: 15,
        width: 100,
        float: "right"
    },
    main: {
        marginBottom: 50,
        marginRight: 20
    },
    circle: {
        position: "relative",
        borderRadius: "100%",
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