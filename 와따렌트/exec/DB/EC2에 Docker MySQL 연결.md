# EC2에 Docker MySQL 연결
---
## 목차   
[1. Docker에 MySQL 이미지 다운](#1.-docker에-mysql-이미지-다운)   
[2. Docker 컨테이너 볼륨 생성](#2.-docker-컨테이너-볼륨-생성)   
[3. 컨테이너 실행](#3.-컨테이너-실행)   
[4. 컨테이너 접속](#4.-컨테이너-접속)   
[5. MySQL 서버 접속](#5.-mysql-서버-접속)   
[6. MySQL USER 생성 후 권한 부여](#6.-mysql-user-생성-후-권한-부여)   
[7. MySQL 외부 접속 확인](#7.-mysql-외부-접속-확인)   
<br/>

## 1. Docker에 MySQL 이미지 다운
```bash
$ docker pull mysql:latest
```
## 2. Docker 컨테이너 볼륨 생성
컨테이너의 내부 볼륨과 호스트의 볼륨을 마운팅 해주어 영구적으로 데이터를 보존
```bash
$ docker volume create mysql-volume
```

```bash
# 볼륨 확인
$ docker volume ls
```

## 3. 컨테이너 실행
```bash
# 3307 포트, 볼륨 마운팅, mysql 초기 비밀번호 설정
$ docker run -d --name mysql-container -p 3307:3306 -v mysql-volume:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=비밀번호 mysql:latest
```

## 4. 컨테이너 접속
```bash
$ docker exec -it mysql-container bash
```

## 5. MySQL 서버 접속
```bash
bash# mysql -u root -p
# 컨테이너 생성 시 입력했던 패스워드 입력
Enter password:
...
mysql>
```

## 6. MySQL USER 생성 후 권한 부여
```bash
# USER 생성(test), '%'는 모든 IP에서 접속 가능
mysql> CREATE USER test@'%' identified by '비밀번호';
# 생성한 USER에 모든 권한 부여
mysql> GRANT ALL PRIVILEGES ON *.* to test@'%';
# 변경 사항 적용
mysql> FLUSH PRIVILEGES;
mysql> exit;
```

## 7. MySQL 외부 접속 확인
![db접속](/images/db 외부접속 확인.JPG)
