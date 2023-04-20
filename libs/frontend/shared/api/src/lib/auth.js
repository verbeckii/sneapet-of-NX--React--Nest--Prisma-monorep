import { axiosInstance } from './api';

const baseUri = '/me';

const getMe = () => {
  const url = `${baseUri}/v1`;
  return axiosInstance.get(url);
};

export { getMe };
