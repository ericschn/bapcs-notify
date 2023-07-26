import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const useAxios = () => {
  const [response, setResponse] = useState(null);
  const [axiosConfig, setAxiosConfig] = useState({
    url: '',
    method: 'get',
    data: {},
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
    if (axiosConfig.url !== '') fetchData();
  }, [axiosConfig]);

  return [{ response, isLoading, isError }, setAxiosConfig];
};

export default useAxios;
