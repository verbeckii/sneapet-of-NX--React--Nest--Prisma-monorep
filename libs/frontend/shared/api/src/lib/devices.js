import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@visionarea-admin/frontend/shared/api';

const baseUri = 'devices';

const getDevices = async () => {
  const url = `${baseUri}`;
  return axiosInstance.get(url);
};

export const useGetDevicesQuery = ({ onError }) =>
  useQuery(['getDevicesApi'], getDevices, {
    select: (data) => data.data,
    onError: () => onError(),
  });

const removeDevices = async (ids) => {
  const url = `${baseUri}/delete`;
  return axiosInstance.post(url, { ids: ids });
};

export const useRemoveDevicesMutation = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();
  return useMutation((ids) => removeDevices(ids), {
    onSuccess: () => {
      onSuccess();
      return queryClient.invalidateQueries({ queryKey: ['getDevicesApi'] });
    },
    onError: () => onError(),
  });
};

const createDevice = async (data) => {
  const url = `${baseUri}/create`;
  return axiosInstance.post(url, data);
};

export const useCreateDeviceMutation = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();
  return useMutation((data) => createDevice(data), {
    onSuccess: () => {
      onSuccess();
      return queryClient.invalidateQueries({ queryKey: ['getDevicesApi'] });
    },
    onError: () => onError(),
  });
};

const updateDevice = async (data) => {
  const url = `${baseUri}/update`;
  return axiosInstance.patch(url, data);
};

export const useUpdateDeviceMutation = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();
  return useMutation((data) => updateDevice(data), {
    onSuccess: (data) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['getDevicesApi'] });
      return queryClient.invalidateQueries({
        queryKey: ['getDeviceApi', data.data.id],
      });
    },
    onError: () => onError(),
  });
};

const getDevice = async (id) => {
  const url = `${baseUri}/device/${id}`;
  return axiosInstance.get(url);
};

export const useGetDeviceQuery = (id, { onError }) =>
  useQuery(['getDeviceApi', id], () => getDevice(id), {
    select: (data) => data.data,
    onError: () => onError(),
  });
