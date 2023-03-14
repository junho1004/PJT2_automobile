# Openvidu 적용
- Openvidu 적용 전, 해당 포트가 사용되고 있는지 확인   
=> 80, 443, 3478, 5442, 5443, 6379, 8888
- nginx 기본 포트는 80, 443으로 Openvidu 설치 후, nginx를 설치해야 함
---

## 1. Openvidu 설정
- 방화벽 해제
```bash
$ sudo ufw disable
```

- let`s encrypt로 ssl 인증서 발급
```bash
$ sudo apt-get install letsencrypt
$ sudo letsencrypt certonly --standalone -d <도메인>
```

- Openvidu 설치
```bash
# 루트 권한
$ sudo su

# 이동
$ cd /opt

# 설치
$ curl https://s3-eu-west-1.amazonaws.com/aws.openvidu.io/install_openvidu_2.25.0.sh | bash

# 환경 설정 열기
$ nano .env
```

- .env 파일 설정
```bash
DOMAIN_OR_PUBLIC_IP=<도메인>

# OpenVidu SECRET used for apps to connect to OpenVidu server and users to access to OpenVidu Dashboard
OPENVIDU_SECRET=비밀번호

# Certificate type:
# - selfsigned:  Self signed certificate. Not recommended for production use.
#                Users will see an ERROR when connected to web page.
# - owncert:     Valid certificate purchased in a Internet services company.
#                Please put the certificates files inside folder ./owncert
#                with names certificate.key and certificate.cert
# - letsencrypt: Generate a new certificate using letsencrypt. Please set the
#                required contact email for Let's Encrypt in LETSENCRYPT_EMAIL
#                variable.
CERTIFICATE_TYPE=letsencrypt

# If CERTIFICATE_TYPE=letsencrypt, you need to configure a valid email for notifications
LETSENCRYPT_EMAIL=이메일
```

- 포트 확인
```bash
# Openvidu 실행
$ ./openvidu start

# port 확인
# 80, 443포트를 nginx가 사용하고 있으면 OK
$ netstat -lntp

# Openvidu 종료
$ ./openvidu stop
```

- .env 파일 재 설정   
=> 
```bash
HTTP_PORT=8081
HTTPS_PORT=8443
```

- 포트 재확인
```bash
# Openvidu 실행
$ ./openvidu start

# port 확인
# 8081, 8443포트를 nginx가 사용하고 있으면 OK
$ netstat -lntp
```
<br/>

## 2. Nginx 설치
```bash
# Nginx 설치
$ sudo apt-get install nginx


# 설치 확인
$ sudo nginx -v


# Nginx 중지
$ sudo service nginx stop


# letsencrypt는 발급이 되었음을 전제로 합니다

# 키 확인
cd /etc/letsencrypt/live/<도메인>

# Nginx 파일 작성
$ cd /etc/nginx/sites-available
$ sudo vim deploy-test.conf


###### 설정파일 내용 ########
server {
  
        location / {
                proxy_pass http://localhost:3000;
        }

        location /api {
                proxy_pass http://localhost:8080;
        }

        listen 443 ssl;
        ssl_certificate /etc/letsencrypt/live/<도메인>/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/<도메인>/privkey.pem;
}

server {

        if ($host = <도메인>) {
                return 301 https://$host$request_uri;
        }

        listen 80;
        server_name <도메인>;

        return 404;
}

#########################


# sites-enabled로 작성 파일 복사
## sites-enabled 폴더에 있는 .conf 파일이 설정됨
## 만약 설정 파일을 다시 작성해서 복사해 넣으려면 sites-enabled에 있는 설정 파일을 지우고 하기
## 단, 절대로 default 파일은 건드리지 않기
$ sudo ln /etc/nginx/sites-available/deploy-test.conf /etc/nginx/sites-enabled/deploy-test.conf

# 적용
## 적용 성공 시 success
## 실패 시 오타 가능성 혹은 경로나 여타 문제 가능성
$ sudo nginx -t

# Nginx 재시작
## 포트 충돌 시 재시작에서 오류 발생 가능성
$ sudo service nginx restart

# Nginx 상태 확인
$ sudo service nginx status
```

- 컨테이너 실행 및 포트 확인
```bash
# 컨테이너 실행 상황 확인 (run port 설정이 잘 되어 있는지 재차 확인)
$ docker ps

# 포트 확인
$ netstat -lntp
```
