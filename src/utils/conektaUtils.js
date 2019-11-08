import Conekta from '../services/conektaRN';

export function normalizeData(cardForm, setState) {
  let missing = false
  for (let k in cardForm) {
      if (!cardForm[k] && k !== 'xp') missing = true
      if (k === "number" && cardForm[k] && cardForm[k].length < 16) missing = true
  }
  if (missing) {
      setState(s => ({ ...s, error: "Completa todos los campos" }));
      return
  }
  let normalized
  if (cardForm)
      normalized = {
          name: cardForm.name,
          cvc: cardForm.cvc,
          number: cardForm.number.split(' ').join(''),
          // expMonth: cardForm.exp.split('/')[0],
          exp_month: cardForm.exp.split('/')[0],
          exp_year: cardForm.exp.split('/')[1],
      }

  return normalized
}

export function tokenizeCard (cardForm, setState, makePayment, paymentWorking) {
  let normalized = normalizeData(cardForm, setState)
  // console.log("nomilizada: ", normalized)
  if (normalized) {
      setState(s => ({ ...s, loading: true }));

      // conekta!!
      let conekta = new Conekta()
      // console.log("conekta: ", conekta)
      conekta.tokenizeCard(normalized)
          .then(data => {
              console.log('DATA!!!', data);
              if (data.object === "error") {
                  console.log("ERRORs", data);
                  setState(s => ({ ...s, loading: false, step: 3, error: data.message }))
                  return
              }
              // console.log("DATA", data);
              //this.setState({ loading: false, step: 2 })
              // al backend
              // return console.log('token', data)
              return makePayment({ ...paymentWorking, conektaToken: data }, 'event')
                .then(data => console.log('MP!!', data))
                .catch(error => console.log('MPERROR', error.response));
          })
          .then(res => {
              console.log('RESPONSE!!!', res)
              setState({ loading: false, step: 2 })
          })
          .catch(error => {
              console.log("ERROR", error);
              setState({ loading: false, step: 3, error })
          });
  }
}

export function onChangeCard(name, value, state, setState) {
  if (name === "exp" && value.length > 7) return
  if (name === "cvc" && value.length > 4) return
  if (name === "number" && value.length > 24) return
  let { cardForm } = state
  if (name === "exp") {
    let exp = value.replace('/', '')
    if (value.length > 2) exp = exp.slice(0, 2) + "/" + exp.slice(2)
    else exp = value
    cardForm[name] = exp
  }
  else if (name === "number") {
    let exp = value.replace('-', '')
    if (value.length > 4) exp = exp.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim()
    else exp = value
    cardForm[name] = exp
  }
  else cardForm[name] = value
  setState(s => ({ ...s, cardForm }));
}