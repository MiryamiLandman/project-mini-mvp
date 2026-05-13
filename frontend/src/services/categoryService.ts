import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/categories`;
const SUB_API_URL = `${import.meta.env.VITE_API_URL}/subcategories`;

const authHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getCategories = async (token: string) => {
  const response = await axios.get(API_URL, authHeader(token));
  return response.data;
};

export const getSubCategories = async (categoryName: string, token: string) => {
  const response = await axios.get(`${SUB_API_URL}/${categoryName}`, authHeader(token));
  return response.data;
};
