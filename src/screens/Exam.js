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
import { sendIncompleteExamAction, getExamsFromEventAction, getExamAction, saveAnswerAction, resetExamAction } from '../redux/examDuck'
import moment from 'moment'
import GastroModal from '../components/common/GastroModal'
import RegisterButton from '../components/common/RegisterButton';
import ScoreScreen from '../components/exams/ScoreScreen'


let interval
let map = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g"
}

let initialState = {
    user: {},
    loading: false,
    open: false,
    min: 4,
    sec: 59,
    interval,
    modalText: "El tiempo se ha agotado, gracias por participar.",
    timeup: false,
    selected: null
}

class Exam extends React.Component {
    static navigationOptions = { title: "Examen", headerLeft: null }

    state = { ...initialState }

    componentDidMount() {
        if (this.props.questionDuration) this.setState({ min: this.props.questionDuration })
        interval = setInterval(this.count, 1000)
    }

    componentWillUnmount() {
        clearInterval(interval)
    }

    count = () => {
        let { min, sec } = this.state
        if (min < 1 && sec < 2) {
            clearInterval(interval)
            this.setState({ open: true, timeup: true })
        }
        if (sec === 0) this.setState({ sec: 59, min: --min })
        else this.setState({ sec: --sec })
    }

    acceptModal = () => {
        this.setState({ open: false })
        if (this.state.timeup) {
            // redireccionamos
            return this.sendExamForce()
        }
        // Mostramos calificaion
    }
    onSelect = (a, i) => {
        this.setState({ selected: a })
    }

    sendExamForce = () => {
        this.props.sendIncompleteExamAction()
        this.setState({ ...initialState })
    }

    saveAnswer = () => {
        let { currentQuestion } = this.props
        // send answer to redux
        let answer = {
            [currentQuestion.question]: this.state.selected
        }
        this.props.saveAnswerAction(answer)
        // set next question
        // check if is last or timesup
        // reset state
        this.setState({ ...initialState })
    }

    componentWillUnmount() {
        this.props.resetExamAction()
    }

    render() {
        let { title, currentQuestion, currentIndex, totalQuestions, questions, fetching, total } = this.props
        let { min, sec } = this.state
        if (total) return <ScoreScreen total={total} />
        return (
            <ScrollView >
                <View style={[styles.container, { flex: 1, alignItems: "center", flexDirection: "column" }]}>
                    <Text style={styles.mainDate} >{title}</Text>
                    <Text style={styles.roman} >Tiempo restante: {min < 10 ? `0${min}` : min}:{sec < 10 ? `0${sec}` : sec}</Text>
                    <Text style={styles.question}>{currentQuestion.question}</Text>
                    <Text style={styles.miniText} >Elige la respuesta correcta</Text>
                    {!total && <View style={styles.answers}>
                        {currentQuestion.answers.map((a, i) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => this.onSelect(a, i)}
                                    key={i} >
                                    <Text style={this.state.selected === a ? styles.selected : styles.answer}>
                                        {map[i]}. {a}
                                    </Text>
                                </TouchableOpacity>

                            )
                        })}
                        <RegisterButton
                            disabled={!this.state.selected}
                            loading={fetching}
                            text={totalQuestions - 1 === currentIndex ? "Terminar" : "Siguiente pregunta"}
                            onPress={this.saveAnswer}
                        />
                    </View>}

                    <GastroModal
                        isVisible={this.state.open}
                        text={this.state.modalText}
                        onAccept={this.acceptModal}
                        onlyOne={this.state.timeup}
                        onCancel={() => this.setState({ open: false })}
                    />
                </View >
            </ScrollView >
        )
    }
}

function mapState({ exam }) {
    return {
        exam: { ...exam },
        ...exam
    }
}

export default connect(mapState, { sendIncompleteExamAction, resetExamAction, getExamsFromEventAction, getExamAction, saveAnswerAction })(Exam)

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 10
    },
    mainDate: {
        fontSize: 18,
        fontWeight: "100",
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    question: {
        marginVertical: 30,

        fontSize: 18,
        fontWeight: "bold"
    },
    title: {
        fontSize: 22,
        fontWeight: "bold"
    },
    miniText: {
        fontSize: 16,
        marginBottom: 10
    },
    roman: {
        fontSize: 22,
        marginLeft: 10,
        color: "#28abd8",

    },
    answer: {
        marginVertical: 5,
        color: "black",
        backgroundColor: "#eaf0f7",
        paddingHorizontal: 30,
        paddingVertical: 10,
        minWidth: "100%",
        fontSize: 18

    },
    selected: {
        marginVertical: 5,
        color: "white",
        backgroundColor: "#022047",
        paddingHorizontal: 30,
        paddingVertical: 10,
        minWidth: "100%",
        fontSize: 18
    },
    answers: {

        // height: 80

    }
})