import React from 'react'
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
import Spinner from 'react-native-loading-spinner-overlay'
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import DatePicker from 'react-native-datepicker'
import { updateUserAction, createUserAction } from '../redux/UserDuck'
import GastroModal from '../components/common/GastroModal';
import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')

let pic = "https://images-cdn.9gag.com/photo/aerjWqO_700b.jpg"

@connectActionSheet
class EditAccount extends React.Component {
    //static navigationOptions = { headerVisible: true, title: "Editar Perfil" }

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



    componentDidMount() {
        this.setState({ user: { ...this.state.user, ...this.props.user } })
    }

    _takePicture = async (type) => {
        // this.setState({ loading: true })
        await this.askPermissionsAsync()
        let result
        if (type === 'camera') {
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
                exif: false,
            })
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
                exif: false,
            })
        }
        //this.setState({ loading: false })
        if (!result.cancelled) {
            //let form = this.state.formData
            let photo = {
                uri: result.uri,
                type: 'image/jpeg',
                name: 'photo.jpg'
            }
            this.setState({ photo })
        }
    }


    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA)
        await Permissions.askAsync(Permissions.CAMERA_ROLL)
    }

    _onOpenActionSheet = () => {
        // let { status } = await Permissions.askAsync(Permissions.LOCATION)
        const options = ['Tomar foto', 'Seleccionar foto', 'Cancelar']
        const cancelButtonIndex = 2
        this.props.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex: cancelButtonIndex,
            },
            buttonIndex => {
                switch (buttonIndex) {
                    case 0:
                        this._takePicture('camera')
                        break
                    case 1:
                        this._takePicture('media')
                        break
                    default:
                }
            },
        )
    }

    isValid = () => {
        this.setState({ error: false })
        let error = false
        let { user: { basicData, address, email, password, password2 } } = this.state

        if (!password || !password2 || password.length < 6 || password !== password2) {
            error = "Usa una contraseña de mínimo 6 caracteres y verifica que coincida"
        }
        if (!basicData.name || basicData.name.length < 5) {
            error = "Escribe tu nombre completo"
        }
        if (!email || email.length < 6 || !email.includes('@')) {
            error = "Escribe un correo electrónico válido porfavor"
        }
        this.setState({ error })
        return error ? false : true
    }
    _createAccount = () => {
        if (!this.isValid()) return
        this.props.createUserAction(this._makeFormData())
            .then(() => {
                if (this.props.status === "error") {
                    this.setState({ error: this.props.error })
                }
                else if (this.props.status === "success") {
                    this.props.navigation.navigate('Events')
                }
            })
        // go to events
    }

    _updateUser = () => {
        this.props.updateUserAction(this._makeFormData())
            .then(() => {
                this.props.navigation.navigate('Profile')
            })
    }

    _makeFormData = () => {
        let { user } = this.state
        let formData = new FormData()
        for (let k in user) {
            if (Array.isArray(user[k])) {
                for (let el of user[k]) {
                    formData.append(`${k}[]`, el)
                }
            } if (typeof user[k] === "object") {
                if (k === "photoURL") continue
                for (let key in user[k]) {
                    formData.append(`${k}[${key}]`, user[k][key])
                }

            } else {
                formData.append(k, user[k])
            }
        }
        if (this.state.photo) formData.append('photo', this.state.photo)
        return formData
    }

    onChange = (name, value) => {
        let { user } = this.state
        if (name === "birthDate") {
            user.basicData[name] = value
        }
        else if (name === "email") {
            user[name] = value.toLowerCase()
        }
        else if (name === "name" || name == "dadSurname" || name === "momSurname" || name === "speciality") {
            user.basicData[name] = value
        }
        else if (name === "city" || name === "state") {
            user.address[name] = value
        }
        else {
            user[name] = value
        }
        this.setState({ user })
    }

    render() {
        let { user, error, photo } = this.state
        let { basicData, address } = this.state.user
        let { fetching } = this.props
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
                contentContainerStyle={{ flex: 1, backgroundColor: "#f4f4f4" }}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={[styles.imageContainer]}>
                            <TouchableOpacity
                                onPress={this._onOpenActionSheet}
                                style={styles.opacityCamera}
                            >
                                <Icon style={styles.camera} name="camera" />
                            </TouchableOpacity>
                            <Image
                                style={styles.image}
                                //source={{ uri: file }}
                                source={photo ? { uri: photo.uri } : basicData.photoURL ? { uri: basicData.photoURL } : { uri: pic }}
                            />




                        </View>

                        <View style={[styles.form]}>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Nombres:</Text>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    style={[styles.input]}
                                    onChangeText={text => this.onChange("name", text)}
                                    value={basicData.name}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Apellido paterno:</Text>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    style={[styles.input]}
                                    onChangeText={text => this.onChange("dadSurname", text)}
                                    value={basicData.dadSurname}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Apelido materno:</Text>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    style={[styles.input]}
                                    onChangeText={text => this.onChange("momSurname", text)}
                                    value={basicData.momSurname}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Correo electrónico:</Text>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    onChangeText={text => this.onChange("email", text)}
                                    style={[styles.input]}
                                    value={user.email}
                                />
                            </View>

                            {!this.props.loggedIn && <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Password:</Text>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    secureTextEntry={true}
                                    style={[styles.input]}
                                    onChangeText={text => this.onChange("password", text)}
                                    value={user.password}
                                />
                            </View>}
                            {!this.props.loggedIn && <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Repite tu password:</Text>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    secureTextEntry={true}
                                    style={[styles.input]}
                                    onChangeText={text => this.onChange("password2", text)}
                                    value={user.password2}
                                />
                            </View>}

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Fecha de nacimiento:</Text>
                                <DatePicker
                                    style={Object.assign(styles.input, { minWidth: 300, marginBottom: 20 })}
                                    locale="es"
                                    date={basicData.birthDate}
                                    //mode="time"
                                    androidMode="spinner"
                                    placeholder="Tu fecha de nacimiento"
                                    format="DD/MM/YYYY"
                                    minDate="01-01-1930"
                                    maxDate="01-01-2007"
                                    confirmBtnText="Aceptar"
                                    cancelBtnText="Cancelar"
                                    onDateChange={date => { this.onChange("birthDate", date) }}
                                // onDateChange={date => this.setState({ date })}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Estado:</Text>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    style={[styles.input]}
                                    onChangeText={text => this.onChange("state", text)}
                                    value={address.state}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Ciudad:</Text>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    style={[styles.input]}
                                    onChangeText={text => this.onChange("city", text)}
                                    value={address.city}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Especialidad:</Text>
                                <Picker
                                    selectedValue={basicData.speciality}
                                    style={styles.picker}
                                    onValueChange={text => this.onChange("speciality", text)} >
                                    <Picker.Item label="Cirujano" value="Cirujano" />
                                    <Picker.Item label="Gastroenterología" value="Gastroenterología" />
                                    <Picker.Item label="Endoscopia" value="Endoscopia" />
                                    <Picker.Item label="Motilidad" value="Motilidad" />
                                    <Picker.Item label="Medicina Interna" value="Medicina Interna" />
                                    <Picker.Item label="Otra" value="Otra" />
                                </Picker>
                            </View>
                            {!this.props.loggedIn ?
                                <TouchableOpacity
                                    onPress={this._createAccount}
                                >
                                    <Text style={styles.editText}>
                                        Crear cuenta
                             </Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    onPress={this._updateUser}
                                >
                                    <Text style={styles.editText}>
                                        Actualizar Perfil
                             </Text>
                                </TouchableOpacity>
                            }
                        </View>

                    </View>
                </ScrollView>
                <GastroModal
                    isVisible={error}
                    text={error}
                    onlyOne
                    onAccept={() => this.setState({ error: false })}
                />
                <Spinner animation="fade" visible={fetching} />
            </KeyboardAwareScrollView >
        )
    }
}

function mapState({ user }) {
    return {
        user: { ...user },
        ...user,
        ...user.basicData,
        ...user.address
    }
}

export default connect(mapState, { createUserAction, updateUserAction })(EditAccount)

let styles = StyleSheet.create({
    picker: {
        height: 200, minWidth: 300
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
    container: {
        backgroundColor: "white",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        paddingHorizontal: 30
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

// f5f8f9