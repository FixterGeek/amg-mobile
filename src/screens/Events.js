import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import EventCard from '../components/events/EventCard'
import MainMenu from '../components/common/MainMenu';
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'
import AnimatedMenu from '../components/common/AnimatedMenu';

class Events extends Component {
    static navigationOptions = { headerVisible: true, headerLeft: null, title: "Próximos Eventos" }

    state = {
        spin: true
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.fetching) {
            // console.log("apagar")
            setTimeout(() => this.setState({ spin: false }), 300)
        } else if (newProps.fetching) {
            // console.log("encender")
            setTimeout(() => this.setState({ spin: true }), 300)
        }
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
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ padding: 10 }}>
                    {this.props.events.map(this.renderEventCard)}
                    {this.props.events.length < 1 && <Text style={styles.none}>No hay eventos publicados</Text>}
                </ScrollView>
                {/* <MainMenu /> */}
                <AnimatedMenu />
                <Spinner visible={this.state.spin} />
            </View>
        )
    }
}

//redux
function mapStateToProps({ events }) {
    return {
        ...events,
        events: events.array,
    }
}

export default connect(mapStateToProps, {})(Events)

let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    none: {
        marginTop: 20,
        fontSize: 25,
        fontWeight: "100",
        paddingHorizontal: 30,
        paddingVertical: 10
    },
    header: {
        fontSize: 30,
        textAlign: "center",
        marginBottom: 20
    }
})