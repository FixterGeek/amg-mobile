import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
} from 'react-native'
import RegisterButton from '../common/RegisterButton'
import Icon from 'react-native-vector-icons/FontAwesome';


export default class Method extends Component {
    render() {
        return (
            <View style={[styles.container]}>
                <View>
                    <TouchableOpacity
                        onPress={() => this.props.payMethod("card")}
                    >
                        <View style={[styles.box, styles.flexHelper]}>
                            {this.props.method === "card" ? <Icon style={styles.searchIcon} name="check-square" size={20} color="#000" />
                                : <Icon style={styles.searchIcon} name="square" size={20} color="#000" />}
                            <Text style={styles.text}>
                                Tarjeta debito / Credito
                    </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.payMethod("oxxo")}
                    >
                        <View style={[styles.box, styles.flexHelper]}>
                            {this.props.method === "oxxo" ? <Icon style={styles.searchIcon} name="check-square" size={20} color="#000" />
                                : <Icon style={styles.searchIcon} name="square" size={20} color="#000" />}
                            <Text style={styles.text}>
                                Pago en OXXO
                    </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <RegisterButton
                    text="Siguiente"
                    onPress={this.props.pressNext}
                />
            </View>

        )
    }
}


let styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 20
    },
    image: {
        alignSelf: "center",
        marginTop: 150
    },
    box: {
        alignSelf: "stretch",
        backgroundColor: "#eaf0f7",
        paddingHorizontal: 30,
        paddingVertical: 15,
        marginBottom: 20
    },
    flexHelper: {
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        marginLeft: 20
    }
})