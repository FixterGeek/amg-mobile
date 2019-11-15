import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  ScrollView, View, Text,
  FlatList,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import { populateUserPayments } from '../redux/paymentDuck';
import BoxItem from '../components/events/BoxItem';

function UserPayments({
  userId, fetching, payments,
  populateUserPayments, noPayments,
}) {

  useEffect(() => {
    if (!payments[0] && !noPayments) populateUserPayments(userId);
  }, [payments.length])

  return (
    <View style={{ marginHorizontal: 20, marginVertical: 10, flex: 1 }}>
      <Spinner visible={fetching} />
      <ScrollView>
        <FlatList
          data={payments}
          renderItem={({ item }) => <BoxItem
            noCheck
            title={item.concept}
            date={moment(item.createdAt).format('DD[ de ]MMMM[ de ]YYYY')}
            subtitle={item.paid ? 'PAGADO' : 'DECLINADO'}
          />}
          keyExtractor={item => item._id}
        />
      </ScrollView>
    </View>
  );
}

function mapStateToProps({ user, payment: { payment } }) {
  console.log(payment);
  return {
    userId: user._id,
    fetching: user.fetching || payment.fetching,
    payments: payment.array,
    noPayments: payment.noData,
  }
}

UserPayments.navigationOptions = () => ({
  title: 'Mis Pagos',
})

export default connect(
  mapStateToProps, {
    populateUserPayments,
  }
)(UserPayments)
