"use client"

import { createContext, useContext } from 'react';
import axios from 'axios';

const APIContext = createContext();

export const useAPI = () => useContext(APIContext);

export const APIProvider = ({ children }) => {
  const api = axios.create({
    baseURL: "http://localhost:4000/v1",
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    withCredentials: false,
  });

  return (
    <APIContext.Provider value={api}>
      {children}
    </APIContext.Provider>
  );
};