import React from 'react'
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "../components/CheckoutForm";

const Checkout = () => {
  const stripePromise = loadStripe('pk_XXXXXXX');

  return (
    <section className="checkout-wrapper">
      <AmplifyAuthenticator>
        <AmplifySignOut></AmplifySignOut>
        <Elements stripe={stripePromise}>
          <section className="checkout">
            <h2>Checking out?</h2>
            <CheckoutForm />
          </section>
        </Elements>
      </AmplifyAuthenticator>
    </section>
  )
}

export default Checkout
