/* eslint-disable */
import '@babel/polyfill';

import { login } from './login';
import { logout } from './logout';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

// DOM ELEMENTS
const loginForm = document.querySelector('.form');
const logoutButton = document.querySelector('.nav__el--logout');
const mapBox = document.getElementById('map');
const accountSettingsForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-password');
const bookButton = document.getElementById('book-tour');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

if (accountSettingsForm) {
  accountSettingsForm.addEventListener('submit', event => {
    event.preventDefault();

    // create multipart form data
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (passwordForm) {
  passwordForm.addEventListener('submit', async event => {
    event.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm = document.getElementById('password-confirm')
      .value;

    await updateSettings(
      { currentPassword, newPassword, newPasswordConfirm },
      'password'
    );

    // reset UI elements
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn--save-password').textContent = 'Save Password';
  });
}

if (bookButton) {
  bookButton.addEventListener('click', event => {
    event.target.textContent = 'In Progress...';
    const { tourId } = event.target.dataset;
    bookTour(tourId);
  });
}
