import axios from 'axios';

import { showAlert } from './alerts';

export const updateSettings = async (name, email) => {
  console.log(name, email);
  try {
    const result = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/updateMe',
      data: {
        name,
        email
      }
    });
    if (result.data.status === 'success') {
      showAlert('success', 'update settings successful');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
