import axios from 'axios';
const env = process.env;
const baseURL = env.NX_API_URL;

const baseURL2 = env.NX_API_URL2;
axios.defaults.baseURL = env.NX_API_URL2;
export const axiosInstance = axios.create({ baseURL });

let token = '';

axiosInstance.interceptors.request.use((config) => {
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.error('Unauthorized!');
    }
    return Promise.reject(error);
  }
);

export const instance = axios.create({ baseURL2 });

instance.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.error('Unauthorized!');
    } else if (error.response && error.response.status !== 200) {
      console.error('Api error');
    }
    return Promise.reject(error);
  }
);
export const getAuthToken = () => token;
export const setAuthToken = (authToken) => (token = authToken);
export const clearAuthToken = () => (token = '');

// API CALL FROM useEffect
export const getData = (api, setState, setLoading) => {
  const apiArray = typeof api === 'function' ? [api] : api;
  const setStateArray = typeof setState === 'function' ? [setState] : setState;
  const load = async () => {
    if (setLoading) setLoading(true);
    try {
      await Promise.all(
        apiArray.map((api, idx) =>
          api().then((result) => setStateArray[idx](result.data))
        )
      );
    } catch (error) {
      console.log(error);
      setStateArray[0](error); // return error in first state
    }
    if (setLoading) setLoading(false);
  };
  load();
};
