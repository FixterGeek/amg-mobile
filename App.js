//import 'moment/locale/es'
import React, { Component } from 'react'
import Events from 'screens/Events'
import EventDetail from 'screens/EventDetail'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import Login from './src/screens/Login';
import EditAccount from './src/screens/EditAccount'
import AccountProfile from './src/screens/AccountProfile';
import {
  ActionSheetProvider
} from '@expo/react-native-action-sheet'
import { AppLoading, Asset, Font } from 'expo'
import { Provider } from 'react-redux'
import NavigationService from './src/services/NavigationService'
//import { AsyncStorage } from 'react-native'
import generateStore from './src/redux/Store'
import Programa from './src/screens/Programa'
import Modulo from './src/screens/Modulo';
import Actividad from './src/screens/Actividad';
import Exams from './src/screens/Exams';
import Exam from './src/screens/Exam';
import Speakers from './src/screens/Speakers';
import PasswordRecovery from './src/screens/PasswordRecovery';
import Resources from './src/screens/Resources'
import Guides from './src/screens/Guides';
import Publications from './src/screens/Publications';
import Membership from './src/screens/Membership';
import EventPayment from './src/screens/EventPayment';
import EventCourses from './src/screens/EventCourses';
import CourseDetail from './src/screens/CourseDetail';
import Feed from './src/screens/Feed';
import Gallery from './src/screens/Gallery';
import PublicationFactory from './src/screens/PublicationFactory';

console.disableYellowBox = true

class App extends Component {

  state = {
    isLoadingComplete: false,
    userData: null
  }

  // componentWillMount() {
  //   AsyncStorage.getItem('userData').then(user => {
  //     let userData = JSON.parse(user)
  //     if (userData) {
  //       this.setState({ userData })
  //       // NavigationActions.navigate('Profile', {
  //       //   user: userParsed,
  //       //   reload: true
  //       // })
  //     }
  //   }).catch(e => { })
  // }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/splash.jpg'),
      ]),
      //Font.loadAsync({
      //'museo-sans-100': require('./assets/fonts/MuseoSans-100.otf')
      //     'museo-sans-100-italic': require(
      //       './assets/fonts/MuseoSans-100Italic.otf'),
      //     'museo-sans-300': require('./assets/fonts/MuseoSans-300.otf'),
      //     'museo-sans-300-italic': require(
      //       './assets/fonts/MuseoSans-300Italic.otf'),
      //     'museo-sans-700': require('./assets/fonts/MuseoSans_700.otf'),
      //     'museo-sans-700-italic': require(
      //       './assets/fonts/MuseoSans-700Italic.otf'),
      //     'museo-sans-500': require('./assets/fonts/MuseoSans_500.otf'),
      //     'museo-sans-500-italic': require(
      //       './assets/fonts/MuseoSans_500_Italic.otf'),
      //     'museo-sans-900': require('./assets/fonts/MuseoSans_900.otf'),
      //}),
    ])
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    //console.warn(error)
    console.error(error)
  }

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })

  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
          startAsync={this._loadResourcesAsync}
        />
      )
    } else {
      return (
        <Provider store={generateStore()}>
          <ActionSheetProvider>
            <AppWithNavigationState
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
          </ActionSheetProvider>
        </Provider>
      )
    }
  } // render


} //component

export default App




let AppWithNavigationState = createAppContainer(createStackNavigator({
  Login: { screen: Login },
  Signup: { screen: EditAccount },
  Home: { screen: Login },
  Profile: { screen: AccountProfile },
  EditAccount: { screen: EditAccount },
  Events: { screen: Events },
  EventDetail: { screen: EventDetail },
  Programa: { screen: Programa },
  Modulo: { screen: Modulo },
  Speakers: { screen: Speakers },
  Actividad: { screen: Actividad },
  Exams: { screen: Exams },
  Exam: { screen: Exam },
  Recovery: { screen: PasswordRecovery },
  Resources: { screen: Resources },
  Guides: { screen: Guides },
  Publications: { screen: Publications },
  Membership: { screen: Membership },
  EventPayment: { screen: EventPayment },
  EventCourses: { screen: EventCourses },
  CourseDetail: { screen: CourseDetail },
  Home: { screen: Feed },
  Gallery: { screen: Gallery },
  CreatePost: { screen: PublicationFactory },
},
  {
    navigationOptions: {
      headerStyle: {
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
