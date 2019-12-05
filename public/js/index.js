/* eslint-disable */
import '@babel/polyfill';

import { login } from './login';
import { logout } from './logout';
import { displayMap } from './mapbox';
import { updatePassword } from './updatePassword';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS
const accountSettingsForm = document.querySelector('.form-user-data');
const loginForm = document.querySelector('.form');
const logoutButton = document.querySelector('.nav__el--logout');
const mapBox = document.getElementById('map');
const passwordForm = document.querySelector('.form-user-password');

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
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    console.log(name, email);
    updateSettings(name, email);
  });
}

if (passwordForm) {
  passwordForm.addEventListener('submit', event => {
    event.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm = document.getElementById('password-confirm')
      .value;
    updatePassword(currentPassword, newPassword, newPasswordConfirm);
  });
}
