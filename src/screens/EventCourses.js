import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { ScrollView, Text, StyleSheet, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay'

import { populateEventCourses } from '../redux/coursesDuck';
import BoxItem from '../components/events/BoxItem';

class EventCourses extends React.Component {
  static navigationOptions = {
    title: "Cursos"
  };

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

  render() {
    const { courses, navigation } = this.props;
    return (
      <ScrollView contentContainerStyle={styles.mainContainer}>
        <Spinner visible={this.props.fetching} />
        <Text style={styles.title}>Precongreso</Text>
        <View style={styles.coursesContainer}>
          {
            courses.map(course => (
              course.courseType === 'Precongreso' ? <BoxItem
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
      </ScrollView>
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
