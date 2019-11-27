import axios from 'axios';

import { showAlert } from './alerts';

export const logout = async (email, password) => {
  try {
    const result = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout'
    });
    if (result.data.status === 'success') {
      location.reload(true); // reload to empty cache
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
