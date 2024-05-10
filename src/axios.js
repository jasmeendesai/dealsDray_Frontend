import axios from 'axios';

export const makeRequest = axios.create({
    baseURL : "https://aware-satisfying-belly.glitch.me/api/",
    withCredentials : true,
})