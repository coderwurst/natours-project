import axios from 'axios';
import { showAlert } from './alerts';
/* eslint-disable */
const stripe = Stripe('pk_test_NvI7IGyx83WCUH4NXSKHOaYg00XMXCf3Oz');

export const bookTour = async tourId => {
  try {
    // get session from /checkout/tourId
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // send to Stripe checkout and charge card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
