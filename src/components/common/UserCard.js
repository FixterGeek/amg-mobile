import React from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

let dr = require('../../../assets/avatar-hombre.jpg')
let dra = require('../../../assets/avatar-mujer.jpg')

class UserCard extends React.Component {
    render() {
        let { city, basicData = {} } = this.props.item
        let { photoURL, speciality, address = {}, gender } = basicData
        let fullName = `${basicData.name} ${basicData.dadSurname} ${basicData.momSurname}`
        let image = photoURL ? true : false;
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.onPress(this.props.item)
                }}
            >
                <View
                    style={[styles.flexCard]}>
                    {image ? <Image style={styles.image} source={{ uri: photoURL }} /> : <Image style={styles.image} source={gender === "hombre" ? dr : dra} />}
                    <View style={[styles.wideCard]}>
                        <Text stye={styles.title}>{fullName}</Text>
                        <Text style={styles.miniTextTwo}>{speciality}</Text>
                        <Text style={styles.miniText}>{address.state}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export default UserCard


let styles = StyleSheet.create({
    image: {
        width: 50,
        height: 60
    },
    flexCard: {
        flexDirection: "row",
        alignItems: "center",
        maxHeight: 60,
        marginVertical: 10,
        minWidth: "100%",
        alignSelf: 'stretch',
    },
    wideCard: {

        alignSelf: 'stretch',
        width: "80%",
        height: "100%",
        paddingHorizontal: 10,
        // paddingVertical: 30,
        backgroundColor: "#cfecff",
        flexDirection: "column",
        // flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "center"
        // height: 80

    },
    none: {
        marginTop: 20,
        fontSize: 25,
        fontWeight: "100",
        paddingHorizontal: 30,
        paddingVertical: 10
    },
    container: {
        paddingHorizontal: 10,
        alignItems: "stretch",
        justifyContent: "center"
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 10
    },
    miniText: {
        fontSize: 10,
        marginBottom: 10
    },
    miniTextTwo: {
        fontWeight: "bold",
        fontSize: 10
    },
})