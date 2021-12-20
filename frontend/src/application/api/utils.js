import { axiosRequest } from '../../utils';
import { BASE_URL } from './endpoints';

const axiosBaseRequest = (config) =>
  axiosRequest({ baseURL: BASE_URL, ...config });

export const axiosGet = (url, config = {}) =>
  axiosBaseRequest({
    url,
    ...config,
  });

const getAxiosUpdateMethod =
  (method) =>
  (url, data, config = {}) =>
    axiosBaseRequest({
      url,
      ...config,
      data,
      method,
    });

export const axiosPost = getAxiosUpdateMethod('post');
export const axiosPut = getAxiosUpdateMethod('put');
export const axiosPatch = getAxiosUpdateMethod('patch');
export const axiosDelete = getAxiosUpdateMethod('delete');
// export const axiosDelete = (url, config = {}) =>
//   axiosGet(url, { ...config, method: 'delete' });
