import React, { Component } from 'react'
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native'
import UserCard from '../components/common/UserCard'
import { connect } from 'react-redux'
import { getUsersAction } from '../redux/publicationDuck'

class UserList extends Component {
    static navigationOptions = { headerVisible: true }

    state = {
        text: '',
        filtered: []
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ filtered: nextProps.users })
    }

    componentDidMount() {
        this.props.getUsersAction()
    }

    filterUsers = () => { }

    onChange = (value) => {
        let { text } = this.state
        this.setState({ text: value })
        let regex = new RegExp(value.toLowerCase(), "i")
        let filtered = this.props.users.filter(u => regex.test(u.email) || regex.test(u.fullName))
        this.setState({ filtered })
    }

    onPress = (item) => {
        this.props.navigation.navigate("PublicProfile", { item })
    }
    render() {
        return (
            <View>
                <TextInput
                    underlineColorAndroid="transparent"
                    style={[styles.input]}
                    onChangeText={text => this.onChange(text)}
                    value={this.state.text}
                    placeholder="Ingresa el nombre o correo del usuario"
                />
                <FlatList
                    data={this.state.filtered}
                    renderItem={item => <UserCard onPress={this.onPress} {...item} />}
                    keyExtractor={item => item._id}
                />
            </View>
        )
    }
}

function mapState({ publication, user }) {
    return {
        users: publication.users
    }
}

export default connect(mapState, { getUsersAction })(UserList)

let styles = StyleSheet.create({
    input: {
        color: "black",
        paddingLeft: 20,
        borderColor: 'transparent',
        borderWidth: 1,
        backgroundColor: "#f5f8f9",
        fontSize: 20,
        paddingVertical: 20,
        fontWeight: "300"
    },
})