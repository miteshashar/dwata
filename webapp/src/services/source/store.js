import create from "zustand";

import { transformData } from "utils";
import { sourceURL } from "services/urls";
import apiClient from "utils/apiClient";

const initialState = {
  columns: [],
  rows: [],
  isFetching: false,
  isReady: false,
};

const initiateFetch = () => ({
  isFetching: true,
});

const completeFetch = (payload) => ({
  columns: payload.columns,
  rows: payload.rows.map((row) => transformData(payload.columns, row)),
  isFetching: false,
  isReady: true,
});

export default create((set, get) => ({
  ...initialState,

  fetchSource: async () => {
    if (get().isFetching) {
      return;
    }

    set(() => ({
      ...initiateFetch(),
    }));

    try {
      const response = await apiClient.get(sourceURL);
      set(() => ({
        ...completeFetch(response.data),
      }));
    } catch (err) {
      console.log("Could not fetch sources. Try again later.");
    }
  },
}));
