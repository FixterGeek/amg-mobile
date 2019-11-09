import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';

import { subscribeToEventAction } from '../../redux/UserDuck';

function SubscriptionButton({
  user, eventOrActivityObject, subscribeToEventAction,
  subscriptionType = 'event', navigation,
}) {
  let userPays = false;
  if (user.membershipStatus === 'Free' && eventOrActivityObject.cost.freeCost > 0) userPays = true;
  if (user.membershipStatus === 'Residente' && eventOrActivityObject.cost.residentCost > 0) userPays = true;
  if (user.membershipStatus === 'Socio' && eventOrActivityObject.cost.socioCost > 0) userPays = true;

  const handlePress = () => {
    if (subscriptionType === 'event') subscribeToEventAction(eventOrActivityObject._id);
  }

  if (user.userStatus !== 'Aprobado') return (
    <TouchableOpacity>
      <View style={[styles.container, styles.disabled]}>
        <Text style={styles.text}>Disponible para usuarios aprobados</Text>
      </View>
    </TouchableOpacity>
  )

  if (user.assistedEvents.includes(eventOrActivityObject._id)) return (
    <TouchableOpacity>
      <View style={styles.alreadyContainer}>
        <Text style={styles.text}>Ya estas registrado</Text>
      </View>
    </TouchableOpacity>
  )

  if (userPays) return (
    <TouchableOpacity onPress={() => navigation.navigate('EventPayment')}>
      <View style={styles.container}>
        <Text style={styles.text}>Pagar por este evento</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <Text style={styles.text}>Inscribirme</Text>
      </View>
    </TouchableOpacity>
  )
}

function mapStateToProps({ user }) {
  return { user }
}
export default connect(
  mapStateToProps, {
    subscribeToEventAction,
  }
)(SubscriptionButton);

const styles = StyleSheet.create({
  disabled: {
      backgroundColor: "lightgrey"
  },
  alreadyContainer: {
      flex: 0,
      padding: 20,
      backgroundColor: "green",
      borderColor: "black",
      alignItems: "center"
  },
  container: {
      flex: 0,
      padding: 20,
      backgroundColor: "#1f2536",
      borderColor: "black",
      alignItems: "center"
  },
  text: {
      fontWeight: "bold",
      fontSize: 18,
      color: "white"
  }
})