import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/prompts`;

const authHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const generateLesson = async (subCategoryId: string, userPrompt: string, token: string) => {
  const response = await axios.post(
    `${API_URL}/generate`,
    { subCategoryId, userPrompt },
    authHeader(token)
  );
  return response.data;
};

export const getUserStats = async (userId: string, token: string) => {
  const response = await axios.get(`${API_URL}/stats/${userId}`, authHeader(token));
  return response.data;
};

export const getAllPromptsAdmin = async (token: string) => {
  const response = await axios.get(`${API_URL}/admin/all`, authHeader(token));
  return response.data;
};
export const getMyPrompts = async (token: string) => {
  const response = await axios.get(`${API_URL}/my-prompts`, authHeader(token));
  return response.data;
};
