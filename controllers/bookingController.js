const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');

exports.getCheckoutSession = catchAsync(async (request, response, next) => {
  // get currently booked tour
  const tour = await Tour.findById(request.params.tourId);

  // create checkoutSession object w/ private key included in import
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${request.protocol}://${request.get('host')}/?tour=${
      request.params.tourId
    }&user=${request.user.id}&price=${tour.price}`,
    cancel_url: `${request.protocol}://${request.get('host')}/tour/${
      tour.slug
    }`,
    customer_email: request.user.email,
    client_reference_id: request.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: `${tour.summary}`,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // send session back to client
  response.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = catchAsync(async (request, response, next) => {
  // TODO: make secure using Session once deployed
  const { tour, user, price } = request.query;

  if (!tour && !user && !price) {
    return next();
  }
  await Booking.create({ tour, user, price });

  response.redirect(request.originalUrl.split('?')[0]);
});
