# 230316 - trouble shooting

# firebase - morai 연동 시 파일 실행 오류

---

## 문제 상황

### firebase_get_Ego_status.py 실행 오류

- Ego Vehicle 에서 속도, 경도, 위도, 브레이크, 엑셀 정보 받아오는 파일

```powershell
# 터미널1 : rosbridge 실행하기
$ roslaunch rosbridge_server rosbridge_websocket.launch

$ roscd roscd chapter8/online_web/ROS_api_code
$ chmod +x firebase_get_Ego_status.py

$ rosrun chapter8 firebase_get_Ego_status.py
```

![Untitled](230316%20-%20trouble%20shooting%205dbbc8f91ae84398ad7ef1483751f5d7/Untitled.png)

### rosrun ~ 하면 발생하는 현상

- 일단 roslaunch 도 안됨
- rosrun chap ~ 에서 tab 키 안먹음 → src 안에 chapter8 넣어서 해결
- pip is being invoked by an old script wrapper. 에러
- No module 에러

### pip install [없다고 하는 모듈명] 하면 발생하는 현상

- subprocess.CalledProcessError: Command 'lsb_release -a' returned non-zero exit status 1. 에러
- 

![Untitled](230316%20-%20trouble%20shooting%205dbbc8f91ae84398ad7ef1483751f5d7/Untitled%201.png)

## 해결

---

### 1. /usr/bin python 심볼릭 링크 수정

- 황채연씨 ls -al | grep python3 결과 화면

![Untitled](230316%20-%20trouble%20shooting%205dbbc8f91ae84398ad7ef1483751f5d7/Untitled%202.png)

- 내 컴퓨터 ls -al | grep python3 결과 화면

![Untitled](230316%20-%20trouble%20shooting%205dbbc8f91ae84398ad7ef1483751f5d7/Untitled%203.png)

```powershell
# [https://gamechangers.tistory.com/99](https://gamechangers.tistory.com/99)
sudo ln -Tfs python3.6 python3
```

### 2. pip error 해결

- pip 설치
- python 3.7 -V : 3.7.2 나오게 해결
    
    [https://velog.io/@sandartchip/subprocess.CalledProcessError-Command-lsbrelease-a-returned-non-zero-exit-status-1-351nck99](https://velog.io/@sandartchip/subprocess.CalledProcessError-Command-lsbrelease-a-returned-non-zero-exit-status-1-351nck99)
    

# 우분투 터미널 안열리는 문제

---

### 수동으로 xterm 열고, 코드 실행

- 설치한 python3 파일 버전의 우선순위를 설정할 수 있음
- 다른 버전으로 바꿔준 뒤 Ctrl + Alt + t 테스트 해보면 보통 해결됩니다!

```powershell
sudo update-alternatives --config python3
```