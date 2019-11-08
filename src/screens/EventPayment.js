import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { makePayment, setWorkingOn } from '../redux/paymentDuck';
import Method from '../components/membership/Method';
import OxxoPayment from '../components/membership/OxxoPayment';
import OxxoReference from '../components/membership/Referencia';
import CardPayment from '../components/membership/CardPayment';
import MessageScreen from '../components/membership/MessageScreen';
import { onChangeCard, tokenizeCard } from '../utils/conektaUtils';

function EventPayment({
  fetching, paymentWorking, user,
  makePayment, setWorkingOn, navigation,
}) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState({
    method: 'card',
    reference: false,
    conektaOrder: {},
    cardForm: {
      xp: null,
      cvc: null,
      name: null,
      number: null,
      tel: null,
    },
    error: null,
  });

  useEffect(() => {
    if (state.error) Alert.alert(`${state.error}`)
  }, [state.error]);

  useEffect(() => {
    if (user.basicData.phone) setWorkingOn({ ...paymentWorking, phone: user.basicData.phone });
  }, [user.basicData])

  const generateReference = () => {
    makePayment(paymentWorking)
      .then(({ conektaOrder }) => {
        // console.log('here!!!!', conektaOrder);
        setState(s => ({ ...s, conektaOrder, reference: true }));
      })
      .catch(error => console.log(error.response))
  };

  console.log(paymentWorking);
  
  if (step === 0) return (
    <ScrollView>
      <Method
        method={state.method}
        payMethod={v => {
          setState(s => ({ ...s, method: v }));
          v === 'oxxo'
            ? setWorkingOn({
              ...paymentWorking, isOxxoPayment: true, phone: user.basicData.phone,
            })
            : setWorkingOn({
              ...paymentWorking, isOxxoPayment: false, phone: user.basicData.phone,
            })
        }}
        pressNext={() => setStep(1)}
      />
    </ScrollView>
  );

  if (step ===1 && state.method === 'oxxo' && !state.reference) return (
    <ScrollView>
      <OxxoPayment onAccept={() => generateReference()} />
    </ScrollView>
  );

  if (step === 1 && state.reference) return (
    <OxxoReference conektaOrder={state.conektaOrder} />
  )

  if (step === 1 && state.method === 'card') return (
    <KeyboardAwareScrollView>
      <CardPayment
        cardForm={state.cardForm}
        onChangeCard={(name, value) => onChangeCard(name, value, state, setState)}
        onAccept={() => tokenizeCard(state.cardForm, setState, makePayment, paymentWorking)}
      />
    </KeyboardAwareScrollView>
  )

  if (step === 2) return (
    <MessageScreen
      onPressButton1={() => setState( s => ({ ...s, step: 4 }))}
      onPressButton2={() => navigation.navigate('Profile')}
    />
  );

  if (step === 3) return (
    <MessageScreen
      title="Pago declinado"
      isError
      text="Intenta con otro método de pago o contacta a tu entidad bancaria"
      buttonText1="Volver a intentar"
      onlyOne
      // onPressButton1={this.tryAgain}
    />
  );

  return (
    <MessageScreen
      onPressButton1={() => setState( s => ({ ...s, step: 4 }))}
      onPressButton2={() => navigation.navigate('Profile')}
    />
  )
};

function mapStateToProps({ user, payment: { payment, workingOn } }) {
  return {
    fetching: payment.fetching,
    paymentWorking: workingOn,
    user,
  }
}

export default connect(
  mapStateToProps, {
    makePayment,
    setWorkingOn,
  }
)(EventPayment);

EventPayment.navigationOptions = ({ navigation }) => ({
  title: 'Pagar evento',
});
