import axios from "axios";

const  API_BASE_URL = 'https://gamereviewapi-production.up.railway.app'

export default axios.create({
    baseURL: API_BASE_URL,
});