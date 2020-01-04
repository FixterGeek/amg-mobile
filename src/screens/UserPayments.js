import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import GastroModal from '../components/common/GastroModal'

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
  navigation
}) {

  let [open, setOpen] = useState(true)

  useEffect(() => {
    if (!payments[0] && !noPayments) populateUserPayments(userId);
  }, [payments.length])

  if (noPayments) return <GastroModal
    onAccept={() => {
      setOpen(false)
      navigation.navigate('Profile')
    }}
    text="No has realizado ningún pago"
    onlyOne={true}
    isVisible={open}
  />
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
  let payments = payment ? payment.array.reverse() : []
  return {
    userId: user._id,
    fetching: user.fetching || payment.fetching,
    payments,
    noPayments: payment.noData,
    // noPayments: true
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
