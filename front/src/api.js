import axios from "axios";
import { asyncLocalStorage } from "./utils";

const baseURL = "http://teachtech-moodify.japaneast.cloudapp.azure.com:8000"

export const test = async () => {
  const res = await axios.get(`${baseURL}/test/`);
  return res;
};

export const login = async (body) => {
  const res = await axios.post(`${baseURL}/token/`,
    body,
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
  return res;
}

export const signup = async (body) => {

  const res = await axios.post(`${baseURL}/students/`,
    body,
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
  return res;
}

export const get_all_students = async () => {
  const token = await asyncLocalStorage.getItem("access_token")
  const res = await axios.get(`${baseURL}/students/`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  )
  return res;
}

export const get_current_student = async () => {
  const token = await asyncLocalStorage.getItem("access_token")
  const res = await axios.get(`${baseURL}/status/`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  )
  return res;
}