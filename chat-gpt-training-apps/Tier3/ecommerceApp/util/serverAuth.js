import { C8Client } from "jsc8";

export default function getClient() {
  const client = new C8Client({
    url: process.env.URL,
    apiKey: process.env.API_KEY,
    fabricName: process.env.FABRIC,
  });
  return client;
}
