import React from 'react'
import {
    View, 
    StyleSheet,
    Image
} from 'react-native'
import EventCard from 'components/events/EventCard'

let fake = require('../../assets/fakeDetail.png')

export default class EventDetail extends React.Component{

    static navigationOptions = {
        title: "Detalle del Evento"
    }


    render(){
        let event = this.props.navigation.getParam('event')
        console.warn(event)

        return(
            <View style={styles.container} >
                <EventCard 
                    {...event}
                />
                <Image 
                style={styles.fake}
                source={fake} />
            </View>
        )
    }

}

let styles = StyleSheet.create({
    container:{
        flex:1
    },
    fake:
        {height:550, width:"100%",
        position:"absolute",
        bottom:0
    }
    
})