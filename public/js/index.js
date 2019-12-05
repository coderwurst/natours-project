/* eslint-disable */
import '@babel/polyfill';

import { login } from './login';
import { logout } from './logout';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutButton = document.querySelector('.nav__el--logout');
const accountSettingsForm = document.querySelector('.form-user-data');

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
