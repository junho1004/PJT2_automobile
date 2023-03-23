import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function Oauth() {
  // params로 받은 인가 코드를 code 변수에 저장
  const code = new URL(window.location.href).searchParams.get("code");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        // 토큰 axios 요청
        await axios.get(`api/oauth/token?code=${code}`)
            .then((res) => {
              const token = res.headers.authorization;

              // 받아온 토큰을 로컬 스토리지에 token으로 저장
              localStorage.setItem("token", token);

              // 유저 정보를 불러오는 api
              axios
                .get(`${process.env.REACT_APP_API_ME}`, {
                  headers: {
                    Authorization: token,
                  },
                })
            .then((res) => {
              dispatch(
                login({
                  userCode: res.data.user.userCode,
                  point: res.data.user.point,
                  kakaoNickname: res.data.user.kakaoNickname,
                  kakaoProfileImg: res.data.user.kakaoProfileImg,
                  kakaoId: res.data.user.kakaoId,
                })
              );

              // home으로 이동
              navigate("/MapHome");
            });
        });
      } catch (e) {
        console.error(e);
        navigate("/");
      }
    })();
  }, []);

  return <div></div>;
}
