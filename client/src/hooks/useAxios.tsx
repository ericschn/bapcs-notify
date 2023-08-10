import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

interface IAxiosConfig {
  url: string;
  method: string;
  data?: object;
  withCredentials: boolean;
}

interface useAxiosReturn {}

const useAxios = (): [
  { response: any; isLoading: any; isError: any },
  React.Dispatch<React.SetStateAction<IAxiosConfig>>
] => {
  const [response, setResponse] = useState<object>({});
  const [axiosConfig, setAxiosConfig] = useState<IAxiosConfig>({
    url: '',
    method: 'get',
    data: {},
    withCredentials: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const result = await axios(axiosConfig);
      setResponse(result.data);
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (axiosConfig.url !== '') {
      fetchData();
    }
  }, [axiosConfig]);

  let returnObj = { response, isLoading, isError };

  return [returnObj, setAxiosConfig];
};

export default useAxios;
