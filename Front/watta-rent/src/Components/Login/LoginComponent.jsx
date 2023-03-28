import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginComponent.module.css";
import car1 from "../../assets/images/car1.png";
import * as React from 'react';
import Alert from '@mui/material/Alert';
import { firebaseAuth , signInWithEmailAndPassword } from "../../firebase-config";

export default function HomeBanner() {
  const navigate = useNavigate();
  let localStorage = window.localStorage;
  const token = window.localStorage.getItem("token");
  let [loginId, setLoginId] = useState("");
  let [loginPassword, setLoginPassword] = useState("");
  let [appropriate, setIsAppropriate] = useState(false);
  let [user, setUser] = useState();

  // login onClick function
  const login = async () => {
      // localStorage.setItem("loginPassword", loginPassword);
      // setSavedLoginPassword(localStorage.getItem("loginPassword"));
      
      if (loginId.length === 0)  {
        alert("아이디를 입력해주세요");
        <Alert severity="success">This is a success alert — check it out!</Alert>
      } else if(loginPassword.length === 0) {
        alert("비밀번호를 입력해주세요");
      } else {
        try {
          const curUserInfo = await signInWithEmailAndPassword(firebaseAuth, loginId, loginPassword)
          setUser(curUserInfo.user)
          console.log(curUserInfo.user.displayName)
          console.log(curUserInfo.user.email)
          localStorage.setItem("loginEmail", user.email);
          localStorage.setItem("loginNickname", user.displayName);
          navigate("/Maphome");
        } catch(err) {
          setIsAppropriate(false)
          console.log(appropriate)
          alert("아이디와 비밀번호를 확인해주세요!")
        }
        // localStorage.setItem("loginId", loginId);
        // setSavedLoginId(localStorage.getItem("loginId"));
      }
  }

  const signup = () => {
    navigate("/signup");
  }

  return (
    <div className={styles.body}>
        <div className={styles.topleft}>
          <img src={car1} alt="go" style={{width:"90%",height:"250%", marginBottom:"20px"}} />
      </div>
      <div className={styles.bottom} style={{ marginTop:"10px" }}>
          <span style={{color:"white",fontSize:"1em"}}>이메일 :</span>{" "}
          <input
            type="text"
            style={{width:"100%", padding:"2%", marginBottom:"3%",  backgroundColor:"white"}}
            onChange={(e) => {
              setLoginId(e.target.value);
            }}
          />
            {/* <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              autoFocus
              style={{marginTop:"0px"}}
            /> */}

        <div >
        <span style={{color:"white",fontSize:"1em"}}>비밀번호 :</span>{" "}
        {/* <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              style={{marginTop:"0px"}}
            /> */}
          <input
            type="password"
            style={{width:"100%", padding:"2%", marginBottom:"3%", backgroundColor:"white"}}
            onChange={(e) => {
              setLoginPassword(e.target.value);
            }}
          />
        </div>

      </div>
      <div className={styles.bottom2} style={{ marginTop:"10px"}}>
        <button
          onClick={login}
        >
          <span style={{color:"white",fontWeight:"700",fontSize:"1em"}}>Login</span>
        </button>
      </div>
      <div className={styles.bottom2} style={{ marginTop:"10px"}}>
        <button
          onClick={signup}
        >
          <span style={{color:"white",fontWeight:"700",fontSize:"1em"}}>SignUp</span>
        </button>
      </div>
    </div>
  );
};


// function Copyright(props) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// const theme = createTheme();

// export default function SignIn() {
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     console.log({
//       email: data.get('email'),
//       password: data.get('password'),
//     });
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <Box
//           sx={{
//             marginTop: 8,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             Sign in
//           </Typography>
//           <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               autoComplete="email"
//               autoFocus
//               style={{backgroundColor:"grey"}}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type="password"
//               id="password"
//               autoComplete="current-password"
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//             >
//               Sign In
//             </Button>
//             <Grid container>
//               <Grid item>
//                 <Link href="#" variant="body2" style={{ color:"white" }}>
//                   {"Sign Up!"}
//                 </Link>
//               </Grid>
//             </Grid>
//           </Box>
//         </Box>
//       </Container>
//     </ThemeProvider>
//   );
// }