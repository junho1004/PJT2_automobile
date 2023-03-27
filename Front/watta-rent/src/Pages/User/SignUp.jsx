import React, { useState } from 'react';
import {
  Button,
  CssBaseline,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material/';
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styled from 'styled-components'
import { firebaseAuth , createUserWithEmailAndPassword } from "../../firebase-config";
import { updateProfile } from '@firebase/auth';
import carImg from '../../assets/images/car.png'

/* ... */


const Boxs = styled(Box)`
padding-bottom: 40px !important;
`;

const Register = () => {
    const navigate = useNavigate();
    const theme = createTheme();
    const [checked, setChecked] = useState(false);
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerNickname, setRegisterNickname] = useState("");
    const [errorMsg, setErrorMsg] = useState("　");

    const onChangeEmail = (event) => {
        console.log(event.target.value)
        setRegisterEmail(event.target.value)
    }
    const onChangePassword = (event) => {
        console.log(event.target.value)
        setRegisterPassword(event.target.value)
    }
    const onChangeNickname = (event) => {
        console.log(event.target.value)
        setRegisterNickname(event.target.value)
    }
    

  // `회원가입` 버튼의 onClick에 할당
    const register = async () => {
        console.log(registerEmail)
        try {
        setErrorMsg('　');
        const createdUser = await createUserWithEmailAndPassword(firebaseAuth, registerEmail, registerPassword);
        console.log(createdUser);
        updateProfile(firebaseAuth.currentUser, {
            displayName : registerNickname
        })
        setRegisterEmail("");
        setRegisterPassword("");
        navigate("/")
        } catch(err){
        console.log(err.code);
        switch (err.code) {
            case 'auth/weak-password':
            setErrorMsg('비밀번호는 6자리 이상이어야 합니다');
            console.log(errorMsg)
            break;
            case 'auth/invalid-email':
            setErrorMsg('잘못된 이메일 주소입니다');
            console.log(errorMsg)
            break;
            case 'auth/email-already-in-use':
            setErrorMsg('이미 가입되어 있는 계정입니다');
            console.log(errorMsg)
            break;
        }
        }
    }


  // 동의 체크
  const handleAgree = (event) => {
    setChecked(event.target.checked);
    console.log(checked)
  };

  // form 전송
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={carImg} style={{ width:"300px", height:"200px"}} alt="car"/>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Boxs component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <FormControl component="fieldset" variant="standard">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    autoFocus
                    fullWidth
                    type="email"
                    id="email"
                    name="email"
                    label="이메일 주소"
                    onChange={onChangeEmail}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="password"
                    id="password"
                    name="password"
                    label="비밀번호 (숫자+영문자+특수문자 8자리 이상)"
                    onChange={onChangePassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="password"
                    id="rePassword"
                    name="rePassword"
                    label="비밀번호 재입력"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    name="name"
                    label="닉네임"
                    onChange={onChangeNickname}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox onChange={handleAgree} color="primary" />}
                    label="회원가입 약관에 동의합니다."
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                size="large"
                onClick={register}

              >
                회원가입
              </Button>
            </FormControl>
          </Boxs>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
export default Register;