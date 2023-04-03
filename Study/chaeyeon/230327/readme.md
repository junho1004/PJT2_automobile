# today what I do

#### 1. 프로젝트 시나리오 작성
##### [Part]
- FE | DB | EMB

##### [시나리오]
- FE to DB
    - 사용자 현재 좌표
	- 목적지 좌표
	- 차량 call 기능 (flag 값)
	- 차량 도착 기능 (flag 값)

- EMB to DB
	- GPS기반 Ego차량 위치 좌표
	- 목적지 도착 알림 기능 (flag 값) 

- DB to FE
	- 2-1값을 받아와 web 상에서 차량이 이동하는 경로를 map에 표시
	- 2-2값을 통해 도착 완료 표기 

- DB to EMB
	- 1-3값을 통해 차량 출발
		- case a) 해당 값이 true, 목적지 좌표가 가능할 때		
		- case b) 해당 값이 true, 목적지 좌표가 불가능할 때	
		- case c) 해당 값이 false일 때				
	- 1-1, 1-2값을 바탕으로 최단경로로 이동(Dijkstra)
	- 목적지 부근 도착시 도착 알림 flag 전송
	- 사용자가 운행종료 버튼 누르면 1-4값 확인해서 차고지(start point 고정값)로 다시 이동

##### [고려사항]
- DB 업데이트 시 주기(Hz) 설정 -> 비용 부담, sync문제
- multi thread 구현

#### 2. DB 접근 구현
- collection > document > field 접근법 구현
- module 단위 구현을 통해 multi-thread 사용하기 위한 기틀을 다짐
- .py 파일 참고
