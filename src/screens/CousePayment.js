import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, AsyncStorage } from 'react-native'
import OxxoPayment from '../components/membership/OxxoPayment'
import CardPayment from '../components/membership/CardPayment'
import Referencia from '../components/membership/Referencia'
import Facturacion from '../components/membership/Facturacion'
import MessageScreen from '../components/membership/MessageScreen'
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux'
import { payCourseAction, setWorkingOn } from '../redux/paymentDuck';
import GastroModal from '../components/common/GastroModal'
import Conekta from '../services/conektaRN'
import axios from 'axios'
import RegisterButton from '../components/common/RegisterButton'




class CoursePayment extends React.Component {
    // let [step, setStep] = useState(0)
    // let [meth, setMeth] = useState("card")
    // let [step, setStep] = useState(0)

    state = {
        errorMessage: "",
        loading: false,
        step: 0,
        method: "oxxo",
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
        modalTitle: "Generando referencia, tomará solo unos segundos",
        open: false,
        error: false,
        subscribed: false
    }

    subscribeToCourses = async () => {
        let course = this.props.navigation.getParam('Precongreso');
        let course2 = this.props.navigation.getParam('Trascongreso');
        let promises = []
        let token = await AsyncStorage.getItem('token')
        if (course) {
            let p1 = axios.post(`https://amg-api.herokuapp.com/courses/${course._id}/enroll`, {}, { headers: { Authorization: token } })
            promises.push(p1)
        }
        if (course2) {
            let p2 = axios.post(`https://amg-api.herokuapp.com/courses/${course2._id}/enroll`, {}, { headers: { Authorization: token } })
            promises.push(p2)
        }
        if (!promises.length) return
        let res = await Promise.all(promises)
        this.setState({ subscribed: true })
    }

    generarReferencia = () => {
        let course = this.props.navigation.getParam('Precongreso');
        let course2 = this.props.navigation.getParam('Trascongreso');
        let courseIds = []
        if (course) courseIds.push(course._id)
        if (course2) courseIds.push(course2._id)
        let o = { isOxxoPayment: true, amount: this.getPrice(), courseIds, phone: "7717677676" }
        console.log("perro", o)
        this.setState({ open: true, modalTitle: "Generando referencia, tomará solo unos segundos" })
        this.props.payCourseAction(o).then(({ conektaOrder }) => {
            console.log("soloOrder: ", conektaOrder)
            this.setState({ step: 4, conektaOrder, open: false });
            this.subscribeToCourses()
        })
            .catch(e => {
                this.setState({ open: false }, () => this.setState({ error: true }))
            })
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

    tokenizeCard = () => {
        this.setState({ errorMessage: "", error: false })
        let { cardForm } = this.state
        let normalized = this.normalizeData()
        // console.log("nomilizada: ", normalized)
        if (normalized) {
            this.setState({ loading: true })

            // conekta!!
            let conekta = new Conekta()
            // console.log("conekta: ", conekta)
            conekta.tokenizeCard(normalized)
                .then(data => {
                    if (data.object === "error") {
                        console.log("ERRORs", data);
                        this.setState({ error: true, errorMessage: data.message })
                        return Promise.reject(data.message)
                    }
                    let course = this.props.navigation.getParam('Precongreso');
                    let course2 = this.props.navigation.getParam('Trascongreso');
                    let courseIds = []
                    if (course) courseIds.push(course._id)
                    if (course2) courseIds.push(course2._id)
                    let o = {
                        isOxxoPayment: false,
                        amount: this.getPrice(),
                        courseIds,
                        phone: cardForm.tel
                    }
                    return this.props.payCourseAction(o)
                })
                .then(res => {
                    // console.log(res)
                    this.setState({ loading: false, step: 3 })
                    this.subscribeToCourses()
                })
                .catch(error => {
                    console.log("BLISSERROR", error);
                    // this.setState({ loading: false }, () => this.setState({ error: true }))
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

    payMethod = (string) => {
        this.setState({ method: string })
    }
    getPrice = (curso) => {
        let { status } = this.props
        let course = curso ? curso : this.props.navigation.getParam('Precongreso');
        let price = 0
        if (!status || status === "Free") price = course.cost.freeCost
        if (status === "Residente" || status === "Socio en Entrenamiento") price = course.cost.residentCost
        if (status === "Socio" || status === "Veterano" || status === "Mesa Directiva") price = course.cost.socioCost
        return price
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

    render() {
        let { method, step } = this.state
        let course = this.props.navigation.getParam('Precongreso');
        let course2 = this.props.navigation.getParam('Trascongreso');
        if (!course) course = {}
        if (!course2) course2 = {}
        let price = this.getPrice()
        if ((course.cost && this.getPrice(course) == 0) && (course2.cost && this.getPrice(course2) == 0)) return (<View style={{ flex: 1, paddingHorizontal: 10, justifyContent: "center" }}>
            <Text style={{
                fontSize: 18,
                marginTop: 10
            }}>
                {course.title} {course2.title}
            </Text>
            <Text style={{ flex: 1, alignSelf: "center", marginVertical: 30, fontSize: 22 }}>
                Estos cursos son gratis
        </Text>
            <RegisterButton
                onPress={this.subscribeToCourses}
                style={{ marginBottom: 10, marginHorizontal: 10 }}
                text={this.state.subscribed ? "Inscrito" : "Inscribirme"}

            />
        </View>)
        if ((!course.cost && (course2.cost && this.getPrice(course2) == 0)) || (!course2.cost && (course.cost && this.getPrice(course) == 0))) return (<View style={{ paddingHorizontal: 10, flex: 1, justifyContent: "center" }}>
            <Text style={{
                fontSize: 18,
                marginTop: 10
            }}>
                {course.title} {course2.title}
            </Text>
            <Text style={{ flex: 1, alignSelf: "center", marginVertical: 30, fontSize: 22 }}>
                Este curso es gratis
            </Text>
            <RegisterButton
                onPress={this.subscribeToCourses}
                style={this.state.subscribed ? { marginBottom: 10, marginHorizontal: 10, backgroundColor: "#4ce2a7" } : { marginBottom: 10, marginHorizontal: 10 }}
                text={this.state.subscribed ? "Inscrito" : "Inscribirme"}

            />
        </View>)
        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 10,

                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={{
                        fontSize: 18,
                        marginTop: 10
                    }}>
                        {course.title} {course2.title}
                    </Text>
                    <Text style={{
                        fontSize: 22,
                        marginBottom: 10
                    }}>
                        ${price}
                    </Text>
                </View>

                <ScrollView>
                    {step === 0 && <Method
                        method={method}
                        payMethod={this.payMethod}
                        pressNext={() => { }}
                    />}
                    {(step === 0 && method === "card") && <CardPayment
                        cardForm={this.state.cardForm}
                        onChangeCard={this.onChangeCard}
                        onAccept={this.tokenizeCard}
                    />}
                    {(step === 0 && method === "oxxo") && <OxxoPayment
                        onAccept={this.generarReferencia}
                    />}
                    {/* referencia oxxo */}
                    {step === 4 && <Referencia
                        onAccept={this.generarReferencia}
                        onPressButton2={() => this.props.navigation.navigate('Events')}
                        conektaOrder={this.state.conektaOrder || null}
                    />}
                    {/* Card success */}
                    {step === 3 && <MessageScreen
                        onPressButton1={() => this.setState({ step: 4 })}
                        onPressButton2={() => this.props.navigation.navigate('Events')}
                    />}
                    {step === 4 && <Facturacion
                        facturaForm={this.state.facturaForm}
                        onChangeFactura={this.onChangeFactura}
                        onAccept={this.tryMakeFactura}
                    />}
                </ScrollView>
                <GastroModal
                    isVisible={this.state.open}
                    text={this.state.modalTitle}
                    noButtons
                    clockImage
                />
                <GastroModal
                    isVisible={this.state.loading}
                    text={this.state.error ? this.state.errorMessage : "Procesando pago, tomará solo unos segundos"}
                    noButtons={this.state.error ? false : true}
                    clockImage={this.state.error ? false : true}
                    onlyOne={this.state.error ? true : false}
                    onAccept={() => this.setState({ loading: false })}
                />
                <GastroModal
                    isVisible={this.state.error}
                    text={"Ocurrió un error, intenta nuevamente"}
                    onlyOne
                    onAccept={() => this.setState({ error: false })}
                />
            </View>
        )
    }
}

CoursePayment.navigationOptions = {
    title: "Pago de cursos"
};

function mapState({ user, payment: { payment, workingOn } }) {
    return {
        workingOn,
        user,
        status: user.membershipStatus
    }
}

export default connect(mapState, { payCourseAction })(CoursePayment)


function Method({ method, payMethod, pressNext }) {
    return (
        <View>
            <TouchableOpacity
                onPress={() => payMethod("card")}
            >
                <View style={[styles.box, styles.flexHelper]}>
                    {method === "card" ? <Icon style={styles.searchIcon} name="check-square" size={20} color="#000" />
                        : <Icon style={styles.searchIcon} name="square" size={20} color="#000" />}
                    <Text style={styles.text}>
                        Tarjeta débito / Credito
            </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => payMethod("oxxo")}
            >
                <View style={[styles.box, styles.flexHelper]}>
                    {method === "oxxo" ? <Icon style={styles.searchIcon} name="check-square" size={20} color="#000" />
                        : <Icon style={styles.searchIcon} name="square" size={20} color="#000" />}
                    <Text style={styles.text}>
                        Pago en OXXO
            </Text>
                </View>
            </TouchableOpacity>

        </View>
    )
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
        marginLeft: 20,
    }
})