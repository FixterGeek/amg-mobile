import React, { Component } from 'react';
import PDFlib, { PDFPage } from 'react-native-pdf-lib';
import { StyleSheet, View, Text, Image, TextInput } from 'react-native'
import RegisterButton from '../common/RegisterButton'
import { TouchableOpacity } from 'react-native-gesture-handler'
import oxxoImg from '../../../assets/oxxocard.png';

export default function Referencia({
    onAccept,
    onPressButton2,
    conektaOrder,
}) {
    const oxxo = require('../../../assets/oxxopay_brand.png');
    console.log('ahorita vemos que pedo!', conektaOrder);

    const { charges = {} } = conektaOrder;
    const { data = [] } = charges;
    const amount = `${data[0].amount}`;

    const currency = (coins) => {
        return Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(coins);
    };

    const referenceGenerator = () => {
        const doc = PDFPage
            .create()
            .drawImage(oxxoImg, 'png', {
                x: 5,
                y: 25,
            });
        console.log(doc);
    };

    return (
        <View style={styles.container}>
            <View style={styles.oxxoHader}>
                <Image source={oxxo} style={{ width: 120 }} resizeMode="contain" />
                <View style={styles.amountContainer}>
                    <Text style={styles.amountTitle}>MONTO A PAGAR</Text>
                    <Text style={styles.amount}>
                        { currency(amount.substring(0, amount.length - 2) + '.' + amount.substring(amount.length - 2)) }
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
        </View>
    )

}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
        paddingHorizontal: 20,
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