import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  userCode: 0,
  point: "",
  kakaoNickname: "",
  kakaoProfileImg: "",
  kakaoId: "",
};

let user = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userCode = action.payload.userCode;
      state.point = action.payload.point;
      state.kakaoNickname = action.payload.kakaoNickname;
      state.kakaoProfileImg = action.payload.kakaoProfileImg;
      state.kakaoId = action.payload.kakaoId;
    },
  },
  //초기화를 하고 싶은 state가 있는 slice마다 작성
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

export let { login } = user.actions;
export default user;
