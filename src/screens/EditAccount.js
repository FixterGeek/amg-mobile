import React from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity,
    Button
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
import { updateUserAction } from '../redux/UserDuck'




let background = require('../../assets/login_bacground.png')
let logo = require('../../assets/logo.png')
let pic = "https://images-cdn.9gag.com/photo/aerjWqO_700b.jpg"

@connectActionSheet
class EditAccount extends React.Component {
    static navigationOptions = { headerVisible: true, title: "Editar Perfil" }

    state = {
        loading: false,
        file: null,
        user: {
            "__v": "0",
            "_id": "5d2410a7fdb6ac0017f4578d",
            "basicData": {
                "address": {
                    "coordinates": [],
                    "type": "Point",
                },
                "birthDate": "17-04-1987",
                "placeOfBirth": {
                    "coordinates": [],
                    "type": "Point",
                },
            },
            "consultories": [],
            "createdAt": "2019-07-09T03:57:28.319Z",
            "email": "bliss@fixter.org",
            "fiscalData": {
                "address": {
                    "coordinates": [],
                    "type": "Point",
                },
            },
            "followers": [],
            "following": [],
            "hash": "",
            "hospitalActivities": [],
            "internships": [],
            "medicalSocieties": [],
            "membersWhoRecommend": [],
            "membershipStatus": "Free",
            "renewals": [],
            "residencies": [],
            "salt": "a8f7a61aef852c3431fbb541a2a94c3a4b507aa8c0ccc07ebd2a0e405c5e75bd",
            "studies": [],
            "teachingActivities": [],
            "updatedAt": "2019-07-09T03:57:28.319Z",
            "userStatus": "Registrado",
            "workedAtInstitutions": [],
        }, // user
        open: true,
        date: "17-04-1987"
    }



    componentWillMount() {
        this.setState({ user: this.props.user })
    }

    _takePicture = async (type) => {
        this.setState({ loading: true })
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
        this.setState({ loading: false })
        if (!result.cancelled) {
            //let form = this.state.formData
            let file = result.uri
            //console.log(file)
            this.setState({ file })
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
    _updateUser = () => {
        let { user } = this.state
        this.setState({ loading: true })
        let formData = new FormData()
        for (let k in user) {
            if (Array.isArray(user[k]) || typeof user[k] === "object") {
                formData.append(k, JSON.stringify(user[k]))
            } else {
                formData.append(k, user[k])
            }
        }
        this.props.updateUserAction(formData)
    }

    onChange = (name, value) => {
        let { user } = this.state
        if (name === "name" || name == "dadSurname" || name === "momSurname" || name === "birthDate") {
            console.log(value)
            user.basicData[name] = value
        }
        else {
            user[name] = value
        }
        this.setState({ user })
    }

    render() {
        let { photoURL = pic } = this.state.user
        let { file, user, loading, open } = this.state
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
                                source={file ? { uri: file } : { uri: photoURL }}
                            />
                            <TouchableOpacity
                                onPress={this._updateUser}
                            >
                                <Text style={styles.editText}>Actualizar Perfil</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.form]}>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Correo electrónico:</Text>
                                <TextInput
                                    onChangeText={text => this.onChange("email", text)}
                                    style={[styles.input]}
                                    value={user.email}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Nombres:</Text>
                                <TextInput
                                    style={[styles.input]}
                                    onChangeText={text => this.onChange("name", text)}
                                    value={user.basicData.name}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Apellido paterno:</Text>
                                <TextInput
                                    style={[styles.input]}
                                    onChangeText={text => this.onChange("dadSurname", text)}
                                    value={user.basicData.dadSurname}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Apelido materno:</Text>
                                <TextInput
                                    style={[styles.input]}
                                    onChangeText={text => this.onChange("momSurname", text)}
                                    value={user.basicData.momSurname}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Fecha de nacimiento:</Text>
                                <DatePicker
                                    style={{ width: 300, marginBottom: 20 }}
                                    date={user.basicData.birthDate}
                                    mode="date"
                                    placeholder="Tu fecha de nacimiento"
                                    format="DD-MM-YYYY"
                                    minDate="01-01-1930"
                                    maxDate="01-01-2007"
                                    confirmBtnText="Aceptar"
                                    cancelBtnText="Cancelar"
                                    onDateChange={date => { this.onChange("birthDate", date) }}
                                // onDateChange={date => this.setState({ date })}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label]} >Especialidad:</Text>
                                <TextInput
                                    style={[styles.input]}
                                    onChangeText={text => this.onChange("speciality", text)}
                                    value={user.speciality}
                                />
                            </View>

                        </View>

                    </View>
                </ScrollView>
                <Spinner animation="fade" visible={loading} />
            </KeyboardAwareScrollView >
        )
    }
}

function mapState(state) {
    return {
        user: state.user
    }
}

export default connect(mapState, { updateUserAction })(EditAccount)

let styles = StyleSheet.create({
    form: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%"
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
        color: "#cfecff",
        fontSize: 18,
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#1f2536"
    },
    container: {
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
    input: { paddingLeft: 20, height: 40, borderColor: '#cfecff', borderWidth: 1 },
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