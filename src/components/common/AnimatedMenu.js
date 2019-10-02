import React, { Component } from 'react'
import {
    Animated,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Linking
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import NavigationService from '../../services/NavigationService'
import { TouchableHighlight } from 'react-native-gesture-handler';

let revista = "http://www.revistagastroenterologiamexico.org/?codref=ddh3dk3Yjdsafg503zSInMNxBdsddsa545vs809jdn02nubHHtJufRpNPu3hjd673&py=7jb39db3"

let { width, height } = Dimensions.get('window')

function getTransformStyle(animation) {
    return {
        transform: [
            { translateY: animation }
        ]
    }
}

export default class AnimatedMenu extends Component {
    state = {
        open: false,
        animate: new Animated.Value(0),
        fabs: [
            new Animated.Value(0),
            new Animated.Value(0),
            new Animated.Value(0),
            new Animated.Value(0),
            new Animated.Value(0)
        ]
    }
    handlePress = () => {
        let toValue = this.state.open ? 0 : 1
        let flyouts = this.state.fabs.map((value, i) => {
            return Animated.spring(value, {
                toValue: (i + 1) * -60 * toValue,
                friction: 5
            })
        })
        Animated.parallel([
            Animated.timing(this.state.animate, {
                toValue,
                duration: 300
            }),
            Animated.stagger(30, flyouts)
        ]).start()
        this.setState({ open: !this.state.open })



    }

    hanldeOptionPress = (route) => {
        if (route === "Revista") return Linking.openURL(revista)
        this.handlePress()
        this._navigate(route)
    }
    _navigate = (route) => {
        //this.setState({ open: false })
        NavigationService.navigate(route)
    }
    render() {
        let backgroundInterpolate = this.state.animate.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', 'rgba(0,0,0,0.6)']
        })
        let backgroundStyle = {
            backgroundColor: backgroundInterpolate
        }
        let buttonColorInterpolate = this.state.animate.interpolate({
            inputRange: [0, 1],
            outputRange: ['black', 'rgba(0,0,0,0.7)']
        })
        let buttonRotate = this.state.animate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '90deg']
        })
        let buttonStyle = {
            transform: [
                { rotate: buttonRotate }
            ]
        }
        let backgoundButtonStyle = {
            backgroundColor: buttonColorInterpolate
        }
        let { open } = this.state
        return (
            // <View style={open ? styles.overlay : null}>
            <Animated.View pointerEvents='none' style={open?{ width: "100%", height: "100%", backgroundColor: "transparent", position: "absolute" }:null}>

                <Animated.View style={open ? [styles.overlay, backgroundStyle] : null}></Animated.View>

                <Animated.View style={[styles.flyout, styles.position, styles.fab, getTransformStyle(this.state.fabs[4]), backgoundButtonStyle]}>
                    <TouchableOpacity
                    >
                        {open && <Text style={[styles.text]} >Inicio</Text>}
                        <Icon
                            onPress={this.handlePress}
                            style={styles.icon} name="home" />
                    </TouchableOpacity>
                </Animated.View>


                <Animated.View style={[styles.flyout, styles.position, styles.fab, getTransformStyle(this.state.fabs[3]), backgoundButtonStyle]}>
                    <TouchableOpacity
                    >
                        {open && <Text style={[styles.text]} >Eventos</Text>}
                        <Icon
                            onPress={() => this.hanldeOptionPress('Events')}
                            style={styles.icon} name="calendar" />
                    </TouchableOpacity>
                </Animated.View>


                <Animated.View style={[styles.flyout, styles.position, styles.fab, getTransformStyle(this.state.fabs[2]), backgoundButtonStyle]}>
                    <TouchableOpacity
                    >
                        {open && <Text style={[styles.text]} >Revista</Text>}
                        <Icon
                            onPress={() => this.hanldeOptionPress('Revista')}
                            style={styles.icon} name="book" />
                    </TouchableOpacity>
                </Animated.View>


                <Animated.View style={[styles.flyout, styles.position, styles.fab, getTransformStyle(this.state.fabs[1]), backgoundButtonStyle]}>
                    <TouchableOpacity
                    >
                        {open && <Text style={[styles.text]} >Recursos</Text>}
                        <Icon
                            onPress={() => this.hanldeOptionPress('Resources')}
                            style={styles.icon} name="graduation-cap" />
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.flyout, styles.position, styles.fab, getTransformStyle(this.state.fabs[0]), backgoundButtonStyle]}>
                    <TouchableOpacity
                    >
                        {open && <Text style={[styles.text]} >Perfil</Text>}
                        <Icon
                            onPress={() => this.hanldeOptionPress('Profile')}
                            style={styles.icon} name="user" />
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View
                    style={[styles.position, styles.fab, buttonStyle, { zIndex: 9999 }]}
                // pointerEvents={'none'}
                >
                    <TouchableWithoutFeedback
                        onPress={this.handlePress}
                    >

                        <Icon
                            style={[styles.icon]} name="bars" />


                    </TouchableWithoutFeedback>
                </Animated.View>

            </Animated.View >
        )
    }
}

let styles = StyleSheet.create({
    position: {
        position: "absolute",
        right: 20,
        bottom: 35
    },
    flyout: {
        backgroundColor: "#303030"
    },
    overlay: {
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.6)",
        width: "100%",
        height: "100%",
        // zIndex: 0,
    },
    text: {
        position: "absolute",
        left: -80,
        color: "white",
        fontSize: 15,
        width: 100
    },
    fab: {
        zIndex: 1,
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
        color: "#fff",
        fontSize: 30
    }
})