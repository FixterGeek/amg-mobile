import React from 'react'
import {
    View,
    Image,
    Text,
    TextInput,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Platform
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import Method from '../components/membership/Method'
import CardPayment from '../components/membership/CardPayment'
import GastroModal from '../components/common/GastroModal';
import MessageScreen from '../components/membership/MessageScreen';
import Facturacion from '../components/membership/Facturacion'
import OxxoPayment from '../components/membership/OxxoPayment'
import Referencia from '../components/membership/Referencia'
import Conekta from '../services/conektaRN'
import { makePaymen } from '../services/paymentsService'


let background = require('../../assets/login_bacground.png')
let logo = require('../../assets/logo.png')

class Membership extends React.Component {
    static navigationOptions = { headerVisible: true, title: "Pago de membresía" }

    state = {
        error: false,
        user: {},
        loading: false,
        facturando: false,
        generando: false,
        method: "card",
        step: 0,
        cardForm: {
            exp: null,
            cvc: null,
            name: null,
            number: null,
            tel: null
        },
        facturaForm: {
            rfc: null,
            address: null,
            town: null,
            cp: null,
            city: null,
            state: null
        },
        normalized: {}
    }

    payMethod = (string) => {
        this.setState({ method: string })
    }

    changeStep = (step) => {
        this.setState({ step })
    }
    onChangeCard = (name, value) => {
        if (name === "exp" && value.length > 7) return
        if (name === "cvc" && value.length > 4) return
        if (name === "number" && value.length > 24) return
        let { cardForm } = this.state
        if (name === "exp") {
            let exp = value.replace('/', '')
            if (value.length > 2) exp = exp.slice(0, 2) + "/" + exp.slice(2)
            else exp = value
            cardForm[name] = exp
        }
        else if (name === "number") {
            let exp = value.replace('-', '')
            if (value.length > 4) exp = exp.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim()
            else exp = value
            cardForm[name] = exp
        }
        else cardForm[name] = value
        this.setState({ cardForm })
    }

    onChangeFactura = (name, value) => {
        let { facturaForm } = this.state
        facturaForm[name] = value
        this.setState({ facturaForm })
    }

    tryMakeFactura = () => {
        let missing = false
        let { facturaForm } = this.state
        for (let k in facturaForm) {
            if (!facturaForm[k]) missing = true
        }
        if (missing) {
            this.setState({ error: "Completa todos los campos" })
            return
        }
        //console.log(this.state.facturaForm) // aqui facturamos
        this.setState({ facturando: true })
        setTimeout(() => {
            this.setState({ step: 6, facturando: false })
        }, 5000)

    }

    tokenizeCard = () => {
        let { cardForm } = this.state
        let normalized = this.normalizeData()
        console.log("nomilizada: ", normalized)
        if (normalized) {
            this.setState({ loading: true })

            // conekta!!
            let conekta = new Conekta()
            // console.log("conekta: ", conekta)
            conekta.tokenizeCard(normalized)
                .then(data => {
                    if (data.object === "error") {
                        console.log("ERRORs", data);
                        this.setState({ loading: false, step: 3, error: data.message })
                        return
                    }
                    // console.log("DATA", data);
                    //this.setState({ loading: false, step: 2 })
                    // al backend
                    return console.log(data)
                    return makePaymen(data, cardForm.tel)
                })
                .then(res => {
                    console.log(res)
                    this.setState({ loading: false, step: 2 })
                })
                .catch(error => {
                    console.log("ERROR", error);
                    this.setState({ loading: false, step: 3, error })
                });
        }

    }

    normalizeData = () => {
        let { cardForm } = this.state
        let missing = false
        for (let k in cardForm) {
            if (!cardForm[k]) missing = true
            if (k === "number" && cardForm[k] && cardForm[k].length < 16) missing = true
        }
        if (missing) {
            this.setState({ error: "Completa todos los campos" })
            return
        }
        let normalized
        if (cardForm)
            normalized = {
                name: cardForm.name,
                cvc: cardForm.cvc,
                number: cardForm.number.split(' ').join(''),
                // expMonth: cardForm.exp.split('/')[0],
                exp_month: cardForm.exp.split('/')[0],
                exp_year: cardForm.exp.split('/')[1],
            }

        return normalized
    }

    tryAgain = () => {
        this.setState({ step: 1 })
    }

    generarReferencia = () => {
        this.setState({ generando: true })
        // generamos referencia
        setTimeout(() => {
            this.setState({ generando: false, step: 7 })
        }, 5000)
    }

    render() {
        let { step, error, loading, method, facturando, generando } = this.state
        return (
            <View style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    enableOnAndroid={true}
                    enableAutomaticScroll={(Platform.OS === 'ios')}
                    contentContainerStyle={{ flex: 1 }}>

                    {step === 0 && < Method
                        payMethod={this.payMethod}
                        method={this.state.method}
                        pressNext={() => this.changeStep(1)}
                    />}

                    {step === 1 && method === "card" && <CardPayment
                        cardForm={this.state.cardForm}
                        onChangeCard={this.onChangeCard}
                        onAccept={this.tokenizeCard}
                    />}
                    {step === 1 && method === "oxxo" && <OxxoPayment
                        onAccept={this.generarReferencia}
                    />}
                    {/* referencia oxxo */}
                    {step === 7 && <Referencia
                        onAccept={this.generarReferencia}
                        onPressButton2={() => this.props.navigation.navigate('Profile')}
                    />}

                    {step === 2 && <MessageScreen
                        onPressButton1={() => this.setState({ step: 4 })}
                        onPressButton2={() => this.props.navigation.navigate('Profile')}
                    />}
                    {step === 3 && <MessageScreen
                        title="Pago declinado"
                        isError
                        text="Intenta con otro método de pago o contacta a tu entidad bancaria"
                        buttonText1="Volver a intentar"
                        onlyOne
                        onPressButton1={this.tryAgain}
                    />}
                    {/* facturacion */}
                    {step === 4 && <Facturacion
                        facturaForm={this.state.facturaForm}
                        onChangeFactura={this.onChangeFactura}
                        onAccept={this.tryMakeFactura}
                    />}
                    {/* ultimo mensaje despues de facturar (exitoso) */}
                    {step === 5 && <MessageScreen
                        text="Hemos enviado la factura a tu correo."
                        buttonText1="Ir a inicio"
                        onlyOne
                        onPressButton1={() => this.props.navigation.navigate('Profile')}
                    />}
                    {/* ultimo mensaje despues de facturar (erroneo) */}
                    {step === 6 && <MessageScreen
                        title="No se pudo facturar"
                        isError
                        text="Revisa tus datos e intenta de nuevo"
                        buttonText1="Volver a intentar"
                        onlyOne
                        onPressButton1={() => this.setState({ step: 4 })}
                    />}


                </KeyboardAwareScrollView>
                <GastroModal
                    isVisible={error}
                    text={error}
                    onlyOne
                    onAccept={() => this.setState({ error: false })}
                />
                <GastroModal
                    isVisible={loading}
                    text={"Procesando pago, tomará solo unos segundos"}
                    noButtons
                    clockImage
                />
                <GastroModal
                    isVisible={generando}
                    text={"Generando referencia, tomará solo unos segundos"}
                    noButtons
                    clockImage
                />
                <GastroModal
                    isVisible={facturando}
                    text={"Generando factura, tomará solo unos segundos"}
                    noButtons
                    clockImage
                />
            </View>
        )
    }
}

function mapState({ user }) {
    console.log("USUARIO: ", user)
    return {}
}

export default connect(mapState, {})(Membership)

let styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 20
    }
})