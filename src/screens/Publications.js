import React from 'react'
import {
    View,
    FlatList,
    TextInput,
    Text,
    StyleSheet,
    Platform,
    AsyncStorage,
    Image,
    Linking,
    TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'

export default class Publications extends React.Component {
    static navigationOptions = { headerVisible: true, title: "Guías y consensos" }

    state = {
        user: {},
        loading: false,
        guides: [],
        search: ''
    }

    componentDidMount() {
        AsyncStorage.getItem('token')
            .then(token => {
                return axios.get('https://amg-api.herokuapp.com/recursos?query={"tipo":"Publicaciones"}', { headers: { Authorization: token } })
            })
            .then(res => {
                this.setState({ guides: res.data.data })
            })
            .catch(e => console.log("error", e))

    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => Linking.openURL(item.docsURLS[0])}
            >
                <View style={styles.render}>
                    <Image
                        style={styles.thumb} source={{ uri: item.url }} />
                    <View>
                        <Text style={styles.text}>{item.title}</Text>
                        <Text style={styles.text}>{item.authors}</Text>
                        <Text style={styles.text}>{item.publishedAt}, {item.volume}</Text>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }

    render() {
        let { search, guides } = this.state
        let regex = new RegExp(search, 'i')
        let filtered = guides.filter(g => (regex.test(g.title) || regex.test(g.authors) || regex.test(g.volume)))
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
                contentContainerStyle={{ flex: 1 }}>
                <View style={[styles.container]}>
                    <View>
                        <View style={[styles.item]}>
                            <Icon
                                style={styles.icon} name="search" />
                            <TextInput onChangeText={search => this.setState({ search })} placeholder="¿Buscas un artículo?" />
                        </View>
                    </View>



                    {filtered.length > 0 ? <FlatList
                        data={filtered}
                        renderItem={this.renderItem}
                    /> : <Text>No hay resultados que coincidan con tu búsqueda</Text>}
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 20
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "stretch",
        backgroundColor: "#eaf0f7",
        paddingHorizontal: 30,
        paddingVertical: 15,
        marginBottom: 20,
    },
    icon: {
        color: "#8e8e93",
        fontSize: 24,
        marginRight: 25
    },
    render: {
        flexDirection: "row",
        paddingVertical: 10,
        backgroundColor: "#eaf0f7",
        marginBottom: 10,
        paddingLeft: 10
    },
    text: {
        marginBottom: 10,
        maxWidth: "85%"
    },
    thumb: {
        width: 100,
        height: 150,
        marginRight: 10
    }
})