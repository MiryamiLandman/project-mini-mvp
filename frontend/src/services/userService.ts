import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

interface ILoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    phone: string;
    role: 'user' | 'admin';
  };
}

export const register = async (name: string, phone: string) => {
  const response = await axios.post(`${API_URL}/register`, { name, phone });
  return response.data;
};

export const login = async (phone: string): Promise<ILoginResponse> => {
  const response = await axios.post(`${API_URL}/login`, { phone });
  return response.data;
};
