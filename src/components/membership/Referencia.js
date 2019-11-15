import React, { Component, useState } from 'react';
import { printToFileAsync, printAsync } from 'expo-print';
import axios from 'axios';
import { WebView } from 'react-native-webview';

import {
    StyleSheet, View, Text,
    Image, TextInput, Linking,
    ActivityIndicator, ScrollView, Alert,
} from 'react-native'
import RegisterButton from '../common/RegisterButton'
import { TouchableOpacity } from 'react-native-gesture-handler'
import oxxoImg from '../../../assets/oxxocard.png';
import oxxo  from '../../../assets/oxxopay_brand.png';
import firebase from '../../services/firebase'



export default function Referencia({
    onAccept,
    onPressButton2,
    conektaOrder,
}) {
    const { charges = {} } = conektaOrder;
    const { data = [] } = charges;
    const amount = `${data[0].amount}`;
    const [pdf, setPdf] = useState(null)
    const [generating, setGenerating] = useState(false);

    const currency = (coins) => {
        // return Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(coins);
        return `$ ${coins} MXN`;
    };

    const referenceGenerator = () => {
        setGenerating(true);
        printToFileAsync({
            html:
            `<div style="display: flex; justify-content: center; padding-top: 100px; font-family: Helvetica">
                <div style="width: 500px; border: solid 2px #CCC">
                   <div style="display: flex; justify-content: space-between; padding: 32px;">
                   <div style="width: 40%; background-repeat: no-repeat; background-position: center; background-size: contain; heigth: 200px; background-image: url('https://raw.githubusercontent.com/conekta-examples/oxxopay-payment-stub/master/demo/oxxopay_brand.png')"></div>
                    <div style="text-align: left; width: 50%;">
                        <h4>MONTO A PAGAR</h5>
                        <h2>${currency(amount.substring(0, amount.length - 2) + '.' + amount.substring(amount.length - 2))}</h3>
                        <p style="font-size: 12px">OXXO cobrará una comisión adicional al momento de realizar el pago</p>
                    </div>
                   </div>
                   <div style="box-sizing: border-box; margin-top: 32px; margin-bottom: 32px; padding-left: 50px; padding-right: 50px;">
                    <h5>REFERENCIA</h5>
                    <div style="display: flex; justify-content: center; align-items: center; font-size: 32px; padding: 16px; background: #eeeeee">
                        ${conektaOrder.charges.data[0].payment_method.reference}
                    </div>
                   </div>
                   <div style="padding: 32px; background: #eeeeee">
                    <h5>INSTRUCCIONES</h5>
                    <p>1. Acude a la tienda OXXO más cercana</p>
                    <p>2. Indica en caja que quieres realizar un pago de OXXOPay</p>
                    <p>3. Dicta al cajero el número de referencia en esta ficha para que tecleé directamete en la pantalla de venta.</p>
                    <p>4. Realiza el pago correspondiente con dinero en efectivo.</p>
                    <p>
                        5. Al confirmar tu pago, el cajero te entregará un comprobante impreso.
                        En el podrás verificar que se haya realizado correctamente.
                        Conserva este comprobante de pago.
                    </p>
                   </div>
                </div>
            </div>'`,
            base64: true,
        })
            .then(result => {
                // setPdf(result.uri)
                // console.log(result.data64);
                return axios.get(result.uri, {
                    responseType: 'blob'
                })
                let obj = { uri: result.uri, type: 'application/pdf', name: 'oxxo.pdf' }
            })
            .then(({ data }) => firebase.storage().ref('oxxoPdfs').child('oxxo.pdf').put(data))
            .then(function (snap) {
                console.log('Uploaded a data_url string!');
                return snap.ref.getDownloadURL()
            })
            .then(link => {
                setGenerating(false);
                Linking.openURL(link);
            })
            .catch((error) => {
                console.log(error);
                setGenerating(false);
                Alert.alert('Lo sentimos', 'Ocurrio un error al generar la referencia');
            })
    };
    if (pdf) return (<WebView style={{ flex: 1 }} source={{ uri: pdf }} />)
    return (
        <ScrollView contentContainerStyle={styles.container}>
          { generating && <ActivityIndicator /> }  
            <View style={styles.oxxoHader}>
                <Image source={oxxo} style={{ width: 120 }} resizeMode="contain" />
                <View style={styles.amountContainer}>
                    <Text style={styles.amountTitle}>MONTO A PAGAR</Text>
                    <Text style={styles.amount}>
                        {currency(amount.substring(0, amount.length - 2) + '.' + amount.substring(amount.length - 2))}
                    </Text>
                    <Text style={styles.smallLetter}>OXXO cobrará una comisión adicional al momento de realizar el pago</Text>
                </View>
            </View>
            <View>
                <Text style={styles.amountTitle}>REFERENCIA</Text>
                <TextInput
                    editable={false}
                    value={conektaOrder.charges.data[0].payment_method.reference}
                    style={styles.textAmount}
                />
            </View>
            {/* <View>
                <Image
                    source={{ uri: conektaOrder.charges.data[0].payment_method.barcode_url }}
                    style={{ width: 200, marginTop: 20 }}
                    resizeMode="contain"
                />
            </View> */}
            <View style={styles.points}>
                <Text>1. Acude a la tienda OXXO más cercana</Text>
                <Text>2. Indica en caja que quieres realizar un pago de OXXOPay</Text>
                <Text>3. Dicta al cajero el número de referencia en esta ficha para que tecleé directamete en la pantalla de venta.</Text>
                <Text>4. Realiza el pago correspondiente con dinero en efectivo.</Text>
                <Text>
                    5. Al confirmar tu pago, el cajero te entregará un comprobante impreso.
                    En el podrás verificar que se haya realizado correctamente.
                    Conserva este comprobante de pago.
                </Text>
            </View>
            <TouchableOpacity
                onPress={referenceGenerator}
            >
                <Text
                    style={styles.button1}
                >
                    Guardar
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={(onPressButton2)}
            >
                <Text
                    style={styles.button2}
                >
                    Volver
                </Text>
            </TouchableOpacity>
        </ScrollView>
    )

}

let styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        paddingHorizontal: 20,
        paddingBottom: 100,
        // justifyContent: "center"
    },
    image: {
        width: 300,
        height: 500,
        alignSelf: "center"
    },
    button1: {
        padding: 20,
        backgroundColor: "#1f2536",
        borderColor: "black",
        textAlign: "center",
        color: "white",
        alignSelf: "stretch",
        fontWeight: "bold",
        fontSize: 18,
        marginVertical: 30,
        marginBottom: 0
    },
    button2: {
        padding: 20,
        backgroundColor: "transparent",
        borderRadius: 0,
        borderWidth: 2,
        borderColor: 'black',
        textAlign: "center",
        color: "#1f2536",
        alignSelf: "stretch",
        fontWeight: "bold",
        fontSize: 18,
        marginVertical: 10,
        borderColor: "black"
    },
    title: {
        alignSelf: "center",
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 30
    },
    text: {
        marginVertical: 20,
        fontSize: 16
    },
    subtitle: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "bold"
    },
    amountContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: "50%",
        marginLeft: 20,
    },
    oxxoHader: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        paddingTop: 20,
        alignContent: 'space-between',
    },
    amountTitle: {
        fontSize: 20,
    },
    amount: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    smallLetter: {
        fontSize: 12,
    },
    textAmount: {
        backgroundColor: '#CCC',
        padding: 8,
        textAlign: 'center',
        fontSize: 28,
    },
    points: {
        marginTop: 20,
    }
})