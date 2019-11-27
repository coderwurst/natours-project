/* eslint-disable */
import axios from 'axios';

export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    if (result.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};
