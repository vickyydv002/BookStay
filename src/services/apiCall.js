import axios from 'axios';

export const apiCall = async (url, method, body) => {
  const response = await axios.request({
    url,
    method,
    data: body,
  });
  return response.data;
};
