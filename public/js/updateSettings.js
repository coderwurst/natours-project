import axios from 'axios';

import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  console.log(data);
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updatePassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    const response = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (response.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
