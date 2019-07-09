import Events from 'screens/Events'
import EventDetail from 'screens/EventDetail'
import {createStackNavigator, createAppContainer} from 'react-navigation'
import Login from './src/screens/Login';

console.disableYellowBox = true

export default createAppContainer(createStackNavigator({
  Login:{screen: Login},
  Events: {screen: Events},
  EventDetail: {screen: EventDetail}
},
{
  navigationOptions:{
    headerStyle:{
      backgroundColor: "#0066CC",
      color: "#FFF"
    },
    headerTintColor: "#FFF",
    headerTitleStyle: {
      color: "#FFF"
    }
  }
}
))
