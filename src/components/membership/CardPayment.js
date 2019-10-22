import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity,
    Picker
} from 'react-native'
import RegisterButton from '../common/RegisterButton'
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';


export default class CardPayment extends Component {
    state = {
        error: false,
        loading: false,
        photo: null,
        user: {
            email: '',
            address: {
                city: '',
                state: ''
            },
            basicData: {
                photoURL: null,
                birthDate: '',
                name: '',
                dadSurname: '',
                momSurname: ''
            }
        },
        open: true,
        date: "17-04-1987"
    }
    render() {
        let { cardForm, onChangeCard, onAccept } = this.props
        return (
            <View style={[styles.container]}>
                <Text style={styles.title}>Pago con tarjeta</Text>
                <ScrollView >
                    <View style={[styles.form]}>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.label]} >Nombre que aparece en la tarjeta:</Text>
                            <TextInput
                                placeholder="Lucia Perez"
                                underlineColorAndroid="transparent"
                                style={[styles.input]}
                                onChangeText={text => onChangeCard("name", text)}
                                value={cardForm.name}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.label]} >Número de la tarjeta:</Text>
                            <TextInput
                                placeholder="4242-4242-4242-4242"
                                underlineColorAndroid="transparent"
                                style={[styles.input]}
                                onChangeText={text => onChangeCard("number", text)}
                                value={cardForm.number}
                                keyboardType={'numeric'}
                            />
                        </View>
                        <View style={[styles.inputContainer,]}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={[styles.label]} >Expiración:</Text>
                                <Text style={[styles.label, { marginLeft: 80 }]} >CVC:</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <TextInput
                                    placeholder="MM/YYYY"
                                    underlineColorAndroid="transparent"
                                    style={[styles.input, { width: 150, marginRight: 10 }]}
                                    onChangeText={text => onChangeCard("exp", text)}
                                    value={cardForm.exp}
                                // keyboardType={'numeric'}
                                />

                                <TextInput
                                    placeholder="1234"
                                    underlineColorAndroid="transparent"
                                    onChangeText={text => onChangeCard("cvc", text)}
                                    style={[styles.input, { width: 150 }]}
                                    value={cardForm.cvc}
                                    keyboardType={'numeric'}
                                />
                            </View>
                            <Text>Coloca el año en un formato de 4 digitos</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.label]} >Teléfono:</Text>
                            <TextInput
                                placeholder="7712412828"
                                underlineColorAndroid="transparent"
                                onChangeText={text => onChangeCard("tel", text)}
                                style={[styles.input]}
                                value={cardForm.tel}
                                keyboardType={'numeric'}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={onAccept}
                        >
                            <Text style={styles.editText}>
                                Realizar pago
                                </Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </View >

        )
    }
}


let styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        paddingHorizontal: 30
    },
    title: {
        alignSelf: "flex-start",
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 40,

    },
    form: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        marginBottom: 30
    },
    imageContainer: {
        marginVertical: 30,
        flexDirection: "column",
        alignItems: "center",
        position: "relative"
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100
    },
    editText: {
        textAlign: "center",
        color: "#cfecff",
        fontSize: 18,
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#1f2536",

        minWidth: "100%"
    },

    inputContainer: {
        width: "100%",
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10
    },
    input: {
        color: "black",
        paddingLeft: 20,
        borderColor: 'transparent', borderWidth: 1,
        backgroundColor: "#f5f8f9", fontSize: 20,
        paddingVertical: 20, fontWeight: "300"
    },
    // password: { paddingLeft: 20, height: 40, borderColor: '#cfecff', borderWidth: 1 },
    camera: {
        color: "#1f2536",
        fontSize: 30,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 35,
        overflow: "hidden",

    },
    opacityCamera: {
        position: "absolute",
        right: -20,
        top: 0,
        zIndex: 999
    }
})