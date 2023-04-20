import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@visionarea-admin/frontend/shared/api';

const baseUri = 'stores';

const getStoreOptions = async () => {
  const url = `${baseUri}/options`;
  return axiosInstance.get(url);
};

export const useGetStoreOptionsQuery = ({ onError }) =>
  useQuery(['getStoreApiOptions'], getStoreOptions, {
    select: (data) =>
      data.data.map((row) => ({
        value: row.id,
        label: row.Description,
        CustomerId: row.Customers.id,
      })),
    onError: () => onError(),
  });
