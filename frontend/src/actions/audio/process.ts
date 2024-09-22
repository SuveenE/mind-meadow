"use server";

import { AudioRequest } from "@/src/types/request";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SERVICE_ENDPOINT = "process-audio";

export async function processAudio(input: AudioRequest) {
  try {
    const response = await axios.post(`${BACKEND_URL}/${SERVICE_ENDPOINT}`, input);
    return response
  } catch (error) {
    console.error(error);
    throw error;
  }
}
