"use server";

import { AudioRequest } from "@/src/types/request";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SERVICE_ENDPOINT = "query";

export async function queryMemory(input: AudioRequest) {
  try {
    console.log('input', input)
    const response = await axios.post(`${BACKEND_URL}/${SERVICE_ENDPOINT}`, input);
    console.log('response', response.data)
    return response.data
  } catch (error) {
    console.error(error);
    throw error;
  }
}
