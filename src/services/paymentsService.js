import { AsyncStorage } from 'react-native'
import url from './url'
import axios from 'axios'

export async function makePaymen(token, phone) {
    let authToken = await AsyncStorage.getItem('token');
    // let userInfo = await AsyncStorage.getItem('userData')
    // //console.log("userinfo: ", userInfo)
    // let user = JSON.parse(userInfo)
    //console.log(user, authToken)
    let body = {
        // falta phone!!
        conektaToken: token,
        //user: user._id,
        concept: "Plan - socio en entrenamiento",
        price: 625,
        phone
    }
    if (token.isOxxoPayment) body.isOxxoPayment = true
    try {
        let res = await axios.post(`${url}/payments/subscription`,
            body,
            { headers: { Authorization: authToken } })
        await AsyncStorage.setItem('conekta', JSON.stringify(res.data))
        console.log("datA: ", res.data)
        return Promise.resolve(res)
    } catch (e) {
        console.log("Valio: ", e)
        if (!e.response) return
        return Promise.reject(e)
    }
}


export async function postPayment(paymentPayload, paymentType = 'subscription') {
    const token = await AsyncStorage.getItem('token');
    return axios.post(`${url}/payments/${paymentType}`, paymentPayload, {
        headers: {
            Authorization: token,
        },
    }).then(({ data }) => data);
}