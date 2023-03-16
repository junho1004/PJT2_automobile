# zum:go &nbsp;
![줌고](/images/logo.png)
#### web RTC 기반 중고거래 플랫폼
<br/><br/>


# :bulb: Description  
#### 기간 : 2023.01.03 ~ 2023.02.17 (6주)
#### 기획 배경
- 중고거래 시장은 연간 25조원 규모로 추정. 중고거래 시장이 커질수록, 중고거래 사기는 갈수록 급증하고 있는 상황. 
- 대부분의 중고거래 플랫폼이 C2C에 기반두어 지금까지 구매자는 판매자가 제시한 글과 사진만으로 상품을 평가. 구매자와 판매자간의 정보 비대칭성이 커지게 되고 이러한 점을 이용하여 사기가 늘어나게 되는 것.
- 구매자의 불안함은 낮춰주고 서로에 대한 신뢰가 높아질 수 있는 zumgo 서비스 기획.
#### 기대 효과
- 사용자에게 긍정적인 중고 거래 경험 제공
- 구매자는 거래에 대한 신뢰도를, 판매자는 만족스러운 수익 창출을 기대
<br/><br/>
# 📷 UCC
   
<br/><br/>
# 🔎 기능 소개   
#### 1. 카카오 소셜 로그인
  ![소셜로그인](/images/function/소셜로그인.gif)    
<br/>
#### 2. 상품 & 리뷰 CRUD
  ![상품리뷰](/images/function/상품.png)    
<br/>
#### 3. 라이브 스트리밍
  ![라이브스트리밍](/images/function/상품라이브_구매자.gif)   
<br/>
#### 4. 알림톡
  ![알림톡](/images/function/카카오알림톡.png)   
<br/>
#### 5. 일반채팅
  ![일반채팅](/images/function/유저채팅.gif)   
<br/>
#### 6. 경매
  ![라이브경매]()

<br/><br/>

# :hammer: 개발 환경   

#### Backend   
- IntelliJ 2021.2.4
- Spring boot 2.7.8
- Spring boot JPA
- JWT Authentication 3.10.2
- Java 8
- MySQL 8.0.32
- AWS S3
- Junit 4.13.1
- Gradle 7.6

#### Frontend   
- Visual Studio Code 1.75
- React.js 18.2.05
- Node.js 19.6.0
- redux 8.0.5   

#### Web RTC
- Openvidu 2.25.0

#### Web Socket
- Stomp websocket 2.3.3

#### CI/CD
- AWS EC2 (Ubuntu 20.04.1)
- Docker 20.10.12
- Nginx 1.23.3
- Jenkins 2.375.2
<br/><br/>

# 🔗 협업 툴   
- Jira
- [Notion](https://enchanting-top-e29.notion.site/ISF6-560c04e9a853425f9bcd192184296d9a)
- GitLab
- DisCord
- Mattermost   
<br/><br/>

# 🎈 시스템 아키텍쳐   
![시스템 아키텍쳐](/images/시스템아키텍쳐.png)
<br/><br/>

# 📈 ERD
<img src="/images/erd.PNG" width="800" height="900">
<br/><br/>

# 📂 Site Map
![sitemap](/images/siteMap.png)
<br/><br/>

# :art: WireFrame   
![와이어프레임](/images/와이어프레임.png)
<br/><br/>

# ✏ 상세 디자인   
![상세디자인](/images/상세디자인.png)
<br/><br/>

# :earth_asia: Browser Support   
|Chrome|Edge|Safari|
|:-------:|:-------:|:-------:|
|o|o|o|

<br/><br/>

# :family: Team - isf6  

<table>
  <tr>
    <th colspan="3"> Frontend </th>
    <th colspan="3"> Backend </th>
  </tr>
  <tr>
    <td> 사진 </td>
    <td> 사진 </td>
    <td> 사진 </td>
    <td> 사진 </td>
    <td> 사진 </td>
    <td> 사진 </td>
  </tr>
  <tr>
    <td> 김유나 </td>
    <td> 나혜승 </td>
    <td> 최지우 </td>
    <td> 김정효 </td>
    <td> 박시형 </td>
    <td> 한선영 </td>
  </tr>
</table>

<br/><br/>


# :pushpin: Git Convention
#### Commit
* 커밋 타입: 내용 자세히 적어주기  
ex) FEAT: 로그인 rest api 추가   

|Type|Description|
|----|---------------|
|FEAT|새로운 기능을 추가할 경우|
|FIX|버그를 고친 경우|
|STYLE|코드 포맷 변경, 간단한 수정, 코드 변경이 없는 경우|
|REFACTOR|프로덕션 코드 리팩토링|
|DOCS|문서를 수정한 경우 ex) Swagger|
|RENAME|파일 혹은 폴더명 수정 및 이동|
|REMOVE|파일 삭제|
|CHORE|build task 수정, 프로젝트 매니저 설정 수정 등|


#### Branch   

* 네이밍   
ex) feature/login   
ex) feature/login-api   

* Merge 주기   
master: 매주 금요일   
develop: 필요 시   

* Git Flow

  ![gitflow](/images/gitflow_gif.gif)

<br/><br/>

# :pushpin: Jira
 매주 월요일 오전 회의에서 금주의 진행 이슈를 백로그에 등록했습니다. 전주에 완료하지 못한 이슈나, 앞으로 진행할 이슈들을 추가합니다.
 
  ![jira](/images/jira_gif.gif)