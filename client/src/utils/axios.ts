import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5555/',
    headers: {
        "Content-Type": "application/json",
        "timeout": 1000,
    }

  // .. other options
});

export default instance;