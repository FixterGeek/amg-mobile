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
import Icon from 'react-native-vector-icons/FontAwesome';
import { login } from '../services/auth'
import Spinner from "react-native-loading-spinner-overlay";
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { getExamsFromEventAction, getExamAction } from '../redux/examDuck'
import moment from 'moment'
import GastroModal from '../components/common/GastroModal'


let background = require('../../assets/login_bacground.png')
let logo = require('../../assets/logo.png')

class Exams extends React.Component {
    static navigationOptions = { headerVisible: true, title: "Examenes del evento" }

    state = {
        user: {},
        loading: false,
        open: false,
        modalText: "Estas a punto de comenzar el examen, sólo dispondras de 20min para ompletarlo apartir de que presiones aceptar."
    }

    componentWillMount() {
        let event = this.props.navigation.getParam('event')
        this.props.getExamsFromEventAction(event._id)
    }

    tryToFetchExam = (exam) => {
        this.props.getExamAction(exam._id)
            .then(() => {
                if (this.props.total) return this.acceptModal()
                this.setState({ open: true })

            })
    }

    acceptModal = () => {
        if (this.props.status === "allowed") {
            this.props.navigation.navigate("Exam")
        }
        this.setState({ open: false })
    }

    render() {
        // if (this.props.fetching) return (<Spinner animation="fade" visible={this.props.fetching} />)
        return (
            <View sstyle={{ flex: 1 }}>
                <ScrollView >
                    {this.props.exams.length < 1 && <Text style={styles.mainDate} >No hay examenes para este evento</Text>}
                    {this.props.exams.map((exam, i) => {
                        return (<TouchableOpacity
                            onPress={() => this.tryToFetchExam(exam)}
                            key={i}
                        >
                            <Text style={styles.mainDate}>{moment(exam.date).format('LL')}</Text>
                            <View
                                style={[styles.flexCard]}>
                                <View style={{ flex: 0, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.roman]}>{moment(exam.startTime).format('h:mm')}</Text>
                                    <Text style={[styles.roman]}>{moment(exam.startTime).format('a').toUpperCase()}</Text>
                                </View>
                                <View style={[styles.wideCard]}>
                                    <Text stye={styles.title}>{exam.title}</Text>
                                    {/* <Text style={styles.miniText}>Dr. {a.speakers[0].fullName}</Text> */}
                                </View>
                            </View>
                        </TouchableOpacity>)
                    })}

                </ScrollView>
                <GastroModal
                    isVisible={this.state.open}
                    text={this.props.error || this.state.modalText}
                    onAccept={this.acceptModal}
                    onlyOne={this.props.error}
                    onCancel={() => this.setState({ open: false })}
                />

            </View >
        )
    }
}

function mapState({ exam }) {
    return {
        exams: exam.array,
        fetching: exam.fetching,
        error: exam.error,
        status: exam.status,
        total: exam.total
    }
}

export default connect(mapState, { getExamsFromEventAction, getExamAction })(Exams)

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 10
    },
    mainDate: {
        fontSize: 25,
        fontWeight: "100",
        paddingHorizontal: 30,
        paddingVertical: 10
    },
    header: {
        fontSize: 22
    },
    title: {
        fontSize: 22,
        fontWeight: "bold"
    },
    miniText: {
        fontSize: 10,
        marginBottom: 10
    },
    roman: {
        width: 60,
        fontSize: 18,
        marginLeft: 10
    },
    flexCard: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        minHeight: 60
    },
    wideCard: {
        width: "80%",
        height: "100%",
        paddingHorizontal: 10,
        // paddingVertical: 30,
        backgroundColor: "#cfecff",
        flexDirection: "column",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center"
        // height: 80

    }
})