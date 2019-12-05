import axios from 'axios';

import { showAlert } from './alerts';

export const updatePassword = async (
  currentPassword,
  newPassword,
  newPasswordConfirm
) => {
  console.log(name, email);
  try {
    const result = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/updatePassword',
      data: {
        currentPassword,
        newPassword,
        newPasswordConfirm
      }
    });
    if (result.data.status === 'success') {
      showAlert('success', 'password update successful');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
