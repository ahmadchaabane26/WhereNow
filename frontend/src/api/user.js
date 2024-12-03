import axios from 'axios';

const BASE_URL = "http://localhost:3001/api/user";

export const fetchPreferences = async (idToken) => {
    const response = await axios.get(`${BASE_URL}/preferences`, {
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    });
    return response.data;
};

export const fetchSavedItems = async (idToken) => {
    const response = await axios.get(`${BASE_URL}/saved`, {
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    });
    return response.data;
};
