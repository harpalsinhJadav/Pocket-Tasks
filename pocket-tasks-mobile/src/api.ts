import axios from "axios";

// DEV: if running Next.js locally on same Wi-Fi, use your LAN IP: e.g. http://192.168.1.10:3000
// PROD: after Vercel deploy, use your Vercel URL
export const BASE_URL = "http://192.168.17.63:3000";
export const api = axios.create({ baseURL: BASE_URL });
