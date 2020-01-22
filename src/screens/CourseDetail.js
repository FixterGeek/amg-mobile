import React from 'react';
import moment from 'moment';

import { ScrollView, Text, StyleSheet, View } from 'react-native';

import BoxItem from '../components/events/BoxItem';

class CourseDetail extends React.Component {
  static navigationOptions = {
    title: "Detalles del curso"
  };

  render() {
    const course = this.props.navigation.getParam('course');
    const { modules = [] } = course;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{course.title}</Text>
        <View>
          {
            modules.map(module => {
              return (
                <View>
                  <Text style={styles.subtitle}>{module.title}</Text>
                  {
                    module.activities.map(activity => (
                      <BoxItem
                        key={activity._id}
                        noCheck
                        title={activity.activityName}
                        subtitle={activity.description}
                        footer={activity.address}
                        date={`${moment(activity.startTime).format('hh:mm a')} - ${moment(activity.endTime).format('hh:mm a')}`}
                      />
                    ))
                  }
                </View>
              )
            })
          }
        </View>
      </ScrollView>
    );
  }
}

export default CourseDetail;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#022047",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
  }
})
