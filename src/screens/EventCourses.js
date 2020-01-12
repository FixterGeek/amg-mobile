import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { ScrollView, Text, StyleSheet, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay'

import { populateEventCourses } from '../redux/coursesDuck';
import BoxItem from '../components/events/BoxItem';

import RegisterButton from '../components/common/RegisterButton'

class EventCourses extends React.Component {
  static navigationOptions = {
    title: "Cursos"
  };

  state = {
    Precongreso: null, Trascongreso: null,
    selected: {}
  }

  componentDidMount() {
    const {
      courses, noCourses,
      populateEventCourses,
      navigation,
      authToken,
    } = this.props;

    const event = navigation.getParam('event');

    populateEventCourses(event._id, authToken);
  }

  onSelectPrecogreso = (id, course) => {
    if (id === this.state.Precongreso) return this.setState({ Precongreso: null })
    let selected = {}
    selected["Precongreso"] = course
    this.setState({ selected })
    this.setState({ Precongreso: id })
  }
  onSelectTrascongreso = (id, course) => {
    if (id === this.state.Trascongreso) return this.setState({ Trascongreso: null })
    let selected = {}
    selected["Trascongreso"] = course
    this.setState({ selected })
    this.setState({ Trascongreso: id })
  }

  render() {
    const { courses, navigation } = this.props;
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <ScrollView contentContainerStyle={styles.mainContainer}>
          <Spinner visible={this.props.fetching} />
          <Text style={styles.title}>Precongreso</Text>
          <View style={styles.coursesContainer}>
            {
              courses.map(course => (
                course.courseType === 'Precongreso' ? <BoxItem
                  course={course}
                  {...course}
                  onSelect={this.onSelectPrecogreso}
                  selected={this.state.Precongreso}
                  key={course._id}
                  title={course.title}
                  subtitle={course.description}
                  footer={course.location.street}
                  date={`${moment(course.startDate).format('DD [ de ] MMMM')}`}
                  onPressBox={() => navigation.navigate('CourseDetail', { course })}
                /> : null
              ))
            }
          </View>
          <Text style={styles.title}>Trascongreso</Text>
          <View style={styles.coursesContainer}>
            {
              courses.map(course => (
                course.courseType === 'Trascongreso' ? <BoxItem
                  course={course}
                  {...course}
                  onSelect={this.onSelectTrascongreso}
                  selected={this.state.Trascongreso}
                  key={course._id}
                  title={course.title}
                  subtitle={course.description}
                  footer={course.location.street}
                  date={`${moment(course.startDate).format('DD [ de ] MMMM')}`}
                  onPressBox={() => navigation.navigate('CourseDetail', { course })}
                /> : null
              ))
            }
          </View>
          {!courses.length && <Text>No hay cursos registrados para este evento</Text>}
        </ScrollView>
        <RegisterButton
          disabled={!this.state.Precongreso && !this.state.Trascongreso}
          style={{ marginBottom: 20 }}
          text="Siguiente"
          onPress={() => this.props.navigation.navigate('CoursePayment', this.state.selected)}
        />
      </View>
    );
  }
}

function mapStateToProps({ course, user }) {
  return {
    fetching: course.fetching,
    courses: course.array,
    noCourses: course.noData,
    authToken: user.token,
  }
}

export default connect(
  mapStateToProps, {
  populateEventCourses,
}
)(EventCourses);

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#022047",
  },
  coursesContainer: {
    marginTop: 8,
  }
});
