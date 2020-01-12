import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity,
    Picker,
    ScrollView
} from 'react-native'
import RegisterButton from '../common/RegisterButton'
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BasePicker from '../common/BasePicker';


let estados = [
    { "label": "AGUASCALIENTES", "value": "AGUASCALIENTES" },
    { "label": "BAJA CALIFORNIA", "value": "BAJA CALIFORNIA" },
    { "label": "BAJA CALIFORNIA SUR", "value": "BAJA CALIFORNIA SUR" },
    { "label": "CHIHUAHUA", "value": "CHIHUAHUA" },
    { "label": "CHIAPAS", "value": "CHIAPAS" },
    { "label": "CAMPECHE", "value": "CAMPECHE" },
    { "label": "CIUDAD DE MEXICO", "value": "CIUDAD DE MEXICO" },
    { "label": "COAHUILA", "value": "COAHUILA" },
    { "label": "COLIMA", "value": "COLIMA" },
    { "label": "DURANGO", "value": "DURANGO" },
    { "label": "GUERRERO", "value": "GUERRERO" },
    { "label": "GUANAJUATO", "value": "GUANAJUATO" },
    { "label": "HIDALGO", "value": "HIDALGO" },
    { "label": "JALISCO", "value": "JALISCO" },
    { "label": "MICHOACAN", "value": "MICHOACAN" },
    { "label": "ESTADO DE MEXICO", "value": "ESTADO DE MEXICO" },
    { "label": "MORELOS", "value": "MORELOS" },
    { "label": "NAYARIT", "value": "NAYARIT" },
    { "label": "NUEVO LEON", "value": "NUEVO LEON" },
    { "label": "OAXACA", "value": "OAXACA" },
    { "label": "PUEBLA", "value": "PUEBLA" },
    { "label": "QUINTANA ROO", "value": "QUINTANA ROO" },
    { "label": "QUERETARO", "value": "QUERETARO" },
    { "label": "SINALOA", "value": "SINALOA" },
    { "label": "SAN LUIS POTOSI", "value": "SAN LUIS POTOSI" },
    { "label": "SONORA", "value": "SONORA" },
    { "label": "TABASCO", "value": "TABASCO" },
    { "label": "TLAXCALA", "value": "TLAXCALA" },
    { "label": "TAMAULIPAS", "value": "TAMAULIPAS" },
    { "label": "VERACRUZ", "value": "VERACRUZ" },
    { "label": "YUCATAN", "value": "YUCATAN" },
    { "label": "ZACATECAS", "value": "ZACATECAS" }
]



export default class Facturacion extends Component {
    render() {
        let { facturaForm, onChangeFactura, onAccept } = this.props
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
                contentContainerStyle={{ flex: 1, backgroundColor: "#f4f4f4" }}>
                <ScrollView >
                    <View style={[styles.container]}>
                        <Text style={styles.title}>Confirma tus datos fiscales</Text>
                        <View style={[styles.form]}>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >RFC</Text>
                                <TextInput
                                    placeholder="CODA458612FCS"
                                    underlineColorAndroid="transparent"
                                    style={[styles.input]}
                                    onChangeText={text => onChangeFactura("rfc", text)}
                                    value={facturaForm.rfc}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Dirección</Text>
                                <TextInput
                                    placeholder="Nicolás San Juan 233"
                                    underlineColorAndroid="transparent"
                                    style={[styles.input]}
                                    onChangeText={text => onChangeFactura("address", text)}
                                    value={facturaForm.address}
                                // keyboardType={'numeric'}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Colonia</Text>
                                <TextInput
                                    placeholder="Colonia del Valle"
                                    underlineColorAndroid="transparent"
                                    style={[styles.input]}
                                    onChangeText={text => onChangeFactura("town", text)}
                                    value={facturaForm.town}
                                // keyboardType={'numeric'}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Código postal</Text>
                                <TextInput
                                    placeholder="03330"
                                    underlineColorAndroid="transparent"
                                    onChangeText={text => onChangeFactura("cp", text)}
                                    style={[styles.input]}
                                    value={facturaForm.cp}
                                    keyboardType={'numeric'}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Municipio</Text>
                                <TextInput
                                    placeholder="Benito Juárez"
                                    underlineColorAndroid="transparent"
                                    onChangeText={text => onChangeFactura("city", text)}
                                    style={[styles.input]}
                                    value={facturaForm.city}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Estado</Text>
                                <BasePicker
                                    style={styles.picker}
                                    placeholder={'Selecciona tu Estado'}
                                    dataSource={estados}
                                    onChange={text => onChangeFactura("state", text)}
                                    defaultValue={facturaForm.state}
                                />
                            </View>



                        </View>

                    </View>

                </ScrollView>
                <TouchableOpacity
                    onPress={onAccept}
                >
                    <Text style={styles.editText}>
                        Facturar
                                </Text>
                </TouchableOpacity>

            </KeyboardAwareScrollView >

        )
    }
}


let styles = StyleSheet.create({
    picker: {
        height: 200, minWidth: 300
    },
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
        // marginLeft: 30

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
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#1f2536",
        marginHorizontal: 20,
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