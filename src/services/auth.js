import axios from 'axios'
import {AsyncStorage} from 'react-native';


let url = "https://amg-api.herokuapp.com/"

export function login(auth){
    return axios.post(url+'auth/login', auth)
    .then(res=>{
        saveUserData(res.data)
        return res.data
    })
}

async function  saveToken(token){
    try {
        await AsyncStorage.setItem('token', token);
      } catch (error) {
        console.log(error)
      }
}

async function  saveUserData(data){
    try {
        console.log("user: ? ", data)
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        saveToken(data.token)
      } catch (error) {
        console.log(error)
      }
}