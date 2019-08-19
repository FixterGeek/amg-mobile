import React, { Component } from 'react'
import { getEvents } from '../redux/EventsDuck'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import EventCard from 'components/events/EventCard'
import MainMenu from '../components/common/MainMenu';
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay';

class Events extends Component {
    static navigationOptions = { headerVisible: true, headerLeft: null, title: "Próximos Eventos" }


    renderEventCard = (e, i) => {
        return (<EventCard
            key={i}
            {...e}
            event={e}
            navigation={this.props.navigation}
        />)
    }

    render() {
        if (this.props.fetching && this.props.events.length < 1) return <Spinner animation="fade" visible={this.props.fetching} />
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ padding: 10 }}>
                    {this.props.events.map(this.renderEventCard)}
                </ScrollView>
                <MainMenu />

            </View>
        )
    }
}

//redux
function mapStateToProps({ events }) {
    return {
        events: events.array,
        ...events
    }
}

export default connect(mapStateToProps, { getEvents })(Events)

let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        fontSize: 30,
        textAlign: "center",
        marginBottom: 20
    }
})