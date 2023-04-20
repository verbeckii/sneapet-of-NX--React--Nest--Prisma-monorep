import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@visionarea-admin/frontend/shared/api';

const baseUri = 'customers';

const getCustomerOptions = async () => {
  const url = `${baseUri}/options`;
  return axiosInstance.get(url);
};

export const useGetCustomerOptionsQuery = ({ onError }) =>
  useQuery(['getCustomerApiOptions'], getCustomerOptions, {
    select: (data) =>
      data.data.map((row) => ({
        value: row.id,
        label: row.Description,
      })),
    onError: () => onError(),
  });
