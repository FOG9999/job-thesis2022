import * as api from "../api";
import { AUTH } from "../constants/actionTypes";
import { createSocket } from "./socket";
import { io } from "socket.io-client"

export const login = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.login(formData);
    dispatch({ type: AUTH, data });
    if(data.result.userName == 'administrator'){
      history.push("/admin");
    }
    else history.push("/");
    const socket = io("http://localhost:3001")
    dispatch(createSocket(socket))
  } catch (error) {
    console.log(error);
  }
};

export const register = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.register(formData);
    dispatch({ type: AUTH, data });
    history.push("/");
    const socket = io("http://localhost:3001")
    dispatch(createSocket(socket))
  } catch (error) {
    console.log(error);
  }
};
