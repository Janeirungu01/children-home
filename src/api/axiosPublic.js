import axios from "axios";

const apiPublic = axios.create({
  baseURL: "http://localhost:5418",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiPublic;
