import axios from "axios";
import { VITE_API_URL} from "../config"

const apiPublic = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiPublic;
