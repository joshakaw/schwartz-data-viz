import axios from "axios";
import Qs from "qs"

const instance = axios.create({
    baseURL: 'http://localhost:5555/',
    headers: {
        "Content-Type": "application/json",
        "timeout": 1000,
    },
    paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
});

export default instance;