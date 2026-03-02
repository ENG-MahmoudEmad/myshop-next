import axios from "axios";

export const api = axios.create({
  baseURL: "https://ecommerce.routemisr.com",
});