import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import EventCard from 'components/events/EventCard'
import MainMenu from '../components/common/MainMenu';
import { connect } from 'react-redux'

class Events extends Component {
    static navigationOptions = { headerVisible: true, headerLeft: null, title: "Próximos Eventos" }
    state = {
        events: [
            {
                _id: 1,
                title: "ECOS Internacionales",
                body: "curso de posgrado dirigido a Gastroenterólogos, Endoscopistas, Hepatólogos, Médicos Internistas, Cirujanos, Generales, Médicos, Residentes de las especialidades, Estudiantes de Medicina y enfermeros.",
                date: "22/11/2019",
                displayDate: "22 al 24 de noviembre",
                image: 'https://d36tnp772eyphs.cloudfront.net/blogs/2/2018/10/angel-de-la-independencia-shutterstock_1066463744.jpg'
            },
            {
                _id: 2,
                title: "Semana Nacional de Gastroenterología",
                body: "curso de posgrado dirigido a Gastroenterólogos, Endoscopistas, Hepatólogos, Médicos Internistas, Cirujanos, Generales, Médicos, Residentes de las especialidades, Estudiantes de Medicina y enfermeros.",
                date: "16/11/2019",
                displayDate: "16 al 20 de noviembre",
                image: 'https://cdn.getyourguide.com/img/tour_img-1191968-146.jpg'
            },
            {
                _id: 3,
                title: "Congreso de Hepatología",
                body: "curso de posgrado dirigido a Gastroenterólogos, Endoscopistas, Hepatólogos, Médicos Internistas, Cirujanos, Generales, Médicos, Residentes de las especialidades, Estudiantes de Medicina y enfermeros.",
                date: "16/11/2019",
                displayDate: "16 al 20 de noviembre",
                image: 'https://conceptodefinicion.de/wp-content/uploads/2017/06/Conferencia.jpg'
            }
        ]
    }

    renderEventCard = (e, i) => {
        return (<EventCard
            key={i}
            {...e}
            event={e}
            navigation={this.props.navigation}
        />)
    }

    render() {
        let events = this.props.events
        console.log(events[0])
        return (
            <View>
                <ScrollView
                    contentContainerStyle={{ padding: 10 }}>
                    {events.map(this.renderEventCard)}
                </ScrollView>
                <MainMenu />
            </View>
        )
    }
}

//redux
function mapStateToProps(state) {
    return {
        events: state.events.array
    }
}

export default connect(mapStateToProps, {})(Events)

let styles = StyleSheet.create({
    header: {
        fontSize: 30,
        textAlign: "center",
        marginBottom: 20
    }
})