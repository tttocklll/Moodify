import axios from "axios";
import { asyncLocalStorage } from "./utils";

const baseURL = "http://teachtech-moodify.japaneast.cloudapp.azure.com:8000";

export const test = async () => {
  const res = await axios.get(`${baseURL}/test/`);
  return res;
};

export const login = async (body) => {
  const res = await axios.post(`${baseURL}/token/`, body, {
    headers: { "Content-Type": "application/json" },
  });
  return res;
};

export const signup = async (body) => {
  const res = await axios.post(`${baseURL}/students/`, body, {
    headers: { "Content-Type": "application/json" },
  });
  return res;
};

export const getAllStudents = async () => {
  const res = await axios.get(`${baseURL}/students/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

export const getCurrentStudent = async () => {
  const token = await asyncLocalStorage.getItem("access_token");
  const res = await axios.get(`${baseURL}/status/`, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
  return res;
};

export const getAllQuestions = async () => {
  const res = await axios.get(`${baseURL}/questions/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

export const addQuestion = async (body) => {
  const res = await axios.post(`${baseURL}/questions/`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

export const setQuestions = async (body, user_id) => {
  const res = await axios.post(
    `${baseURL}/update-questions/${user_id}/`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

export const chatQuestions = async () => {
  const token = await asyncLocalStorage.getItem("access_token");
  const res = await axios.get(`${baseURL}/chat-questions/`, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
  return res;
};

export const postChat = async (body) => {
  const token = await asyncLocalStorage.getItem("access_token");
  const res = await axios.post(`${baseURL}/post/`, body, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
  return res;
};

export const getUserPosts = async (user_id) => {
  const res = await axios.get(`${baseURL}/post/${user_id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

export const getPostMonthly = async (year, month) => {
  const token = await asyncLocalStorage.getItem("access_token");
  const res = await axios.get(`${baseURL}/post/?year=${year}&month=${month}`, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
  return res;
};

export const getPostDetails = async (post_id) => {
  const token = await asyncLocalStorage.getItem("access_token");
  const res = await axios.get(`${baseURL}/get-post-detail/${post_id}`, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
  return res;
};

export const getPositiveFactor = async () => {
  const token = await asyncLocalStorage.getItem("access_token");
  const res = await axios.get(`${baseURL}/get-factor/positive`, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
  return res;
};

export const getNegativeFactor = async () => {
  const token = await asyncLocalStorage.getItem("access_token");
  const res = await axios.get(`${baseURL}/get-factor/negative`, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
  return res;
};
