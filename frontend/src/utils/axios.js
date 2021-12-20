import axios from 'axios';

import { AxiosError } from './errors';

export const axiosRequest = async (config) => {
  try {
    const result = await axios.request(config);
    return result.data;
  } catch (error) {
    throw new AxiosError(error);
  }
};
