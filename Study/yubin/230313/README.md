# web-morai 연동하기

## Local 환경에서의 통신

### 차량 안의 운전자에게 제공하는 서비스

- ROS를 통해, 차량(시뮬레이터)과 WEB 간의 Local 통신
- 운전자가 차량 안에서 사용할 수 있는 다양한 서비스를 제공하기 위한 화면 구성
- 교육장 플립보드를 차량내부 디스플레이로 활용하여 시연해도 됨

### 서비스 구조

- ROS 웹소켓 서버에 직접접근하여 데이터 교환

![Untitled](web-morai%20%E1%84%8B%E1%85%A7%E1%86%AB%E1%84%83%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5%2033852739b3d64ad497dcfe37ffadb0db/Untitled.png)

### 구현하기

- ROS_bridge_server (ws://0.0.0.0:9090) 실행
    - Rosbridge_suite 패키지의 Rosbridge_server가 웹소켓 전송계층을 제공
    - 웹 브라우저와 서버 간 통신이 가능하도록 rosbridge protocol 이 상호 데이터 교환 도움 (웹 브라우저에게는 json 형식, ROS 는 ros 메시지 형식으로 전환시켜줌)
- 시뮬레이터 실행 및 통신 연결
    - 데이터 교환을 위해 ROS_bridge_Server 에 연결
- 프론트 API 코드 : roslojs 활용 > ws://0.0.0.0:9090 통신
    - Roslojs 라이브러리 : http://wiki.ros.org/roslibjs
    - JS 언어로 ROS의 publish, subscribe, service 등 ROS_api 가 제공하는 다양한 기능 사용 가능
    - 즉, 웹 브라우저에서 작동하는 ROS node 를 만들 수 있음

### 프론트 API 코드

- roslijs 활용 > ws://0.0.0.0:9090 통신
- 모듈 형태가 아닌 Roslijs 라이브러리 CDN 삽입하기
- 간단한 예제를 만들고 있으므로 CDN 으로 바로 html 에 삽입했지만, 향후 복잡한 서비스 개발 시 모듈형식으로 사용
- source : http://static.robotwebtools.org/roslibjs/current/roslib.min.js

### chapter8\local_web\gui.html

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <!-- import roslijs scripts : for using ROS -->
        <script type="text/javascript" src="http://static.robotwebtools.org/roslibjs/current/roslib.min.js"></script>

        <!-- import js script : for using js with HTML -->
        <script type="text/javascript" type="text/javascript">
            
            // connect to ROS_bridge_server (local websocket)
            var ros = new ROSLIB.Ros({
                url : 'ws://localhost:9090'
            });
            // check ROS_bridge Connection Status
            ros.on('connection', function() {
                document.getElementById("status").innerHTML = "Connected";
            });
            ros.on('error', function(error) {
                document.getElementById("status").innerHTML = "Error";
            });
            ros.on('close', function() {
                document.getElementById("status").innerHTML = "Closed";
            });

            // -------------------------------------------- Ego status --------------------------------------------
            // get Ego status data from topic : /Ego_topic 
            var Ego_topic_listener = new ROSLIB.Topic({
                    ros : ros,
                    name : '/Ego_topic',
                    messageType : 'morai_msgs/EgoVehicleStatus'
                });

            // activate like callback_function
            Ego_topic_listener.subscribe(function(data) {
                document.getElementById("accel").innerHTML = data.accel * 100;  // to express as a percentage (%)
                document.getElementById("brake").innerHTML = data.brake * 100;  // to express as a percentage (%)
                document.getElementById("position.x").innerHTML = data.position.x; // utm_x
                document.getElementById("position.y").innerHTML = data.position.y; // utm_y
                
                var velocity = data.velocity.x;
                if (velocity < 0) {
                    velocity = 0
                }
                // parseInt : discard decimal places (only show int)
                document.getElementById("velocity.x").innerHTML = parseInt(velocity * 3.6); //  m/s  >>  km/h
            })

            // -------------------------------------------- GPS Sensor --------------------------------------------
            // get GPS data from topic : /gps
            var GPS_topic_listener = new ROSLIB.Topic({
                ros : ros,
                name : '/gps',
                messageType : 'morai_msgs/GPSMessage'
            })

            GPS_topic_listener.subscribe(function(data) {
                document.getElementById("GPS_altitude").innerHTML = data.altitude
                document.getElementById("GPS_latitude").innerHTML = data.latitude
                document.getElementById("GPS_longitude").innerHTML = data.longitude
            })
            
            
            // -------------------------------------------- IMU Sensor --------------------------------------------
            // get IMU data from topic : /imu
            var IMU_topic_listener = new ROSLIB.Topic({
                ros : ros,
                name : '/imu',
                messageType : 'sensor_msgs/Imu'
            })

            IMU_topic_listener.subscribe(function(data) {
                document.getElementById("linear_acceleration_x").innerHTML = data.linear_acceleration.x
                document.getElementById("linear_acceleration_y").innerHTML = data.linear_acceleration.y
                document.getElementById("linear_acceleration_z").innerHTML = data.linear_acceleration.z
                document.getElementById("vector_x").innerHTML = data.orientation.x
                document.getElementById("vector_y").innerHTML = data.orientation.y
                document.getElementById("vector_z").innerHTML = data.orientation.z
                document.getElementById("scalar_w").innerHTML = data.orientation.w
            })

            // -------------------------------------------- Camera Sensor --------------------------------------------
            
            // get Camera image from topic : /image_jpeg/compressed
            var Camera_listener = new ROSLIB.Topic({
                ros : ros, 
                name : '/image_jpeg/compressed',
                messageType : 'sensor_msgs/CompressedImage'
            });

            Camera_listener.subscribe(function(data) {
                document.getElementById('image').src = "data:image/jpeg;base64," + data.data;
            })
        </script>
    </head>

    <body>
        <h1>ROS to Web [Local 환경] </h1>
        <p>ROS_bridge Connection Status : <span style="font-size: x-large; color: magenta;" id="status"></span></p>
        
        <br><hr>
        <h2>topic : /Ego_status</h2>
        <br>
        <p>Accel (%): <span id="accel"></span></p>
        <p>Brake (%): <span id="brake"></span></p>
        <p>position.x (utm): <span id="position.x"></span></p>
        <p>position.y (utm): <span id="position.y"></span></p>
        <p>velocity   (km/h): <span id="velocity.x"></span></p>
        

        <br><hr>
        <h2>topic : /gps</h2>
        <br>
        <p>altitude (고도) : <span id="GPS_altitude"></span></p>
        <p>latitude (위도) : <span id="GPS_latitude"></span></p>
        <p>longitude (경도) : <span id="GPS_longitude"></span></p>

        <br><hr>
        <h2>topic : /imu</h2>
        <br>
        <h5>3축에 대한 선형 가속도</h5>
        <p>linear_acceleration_x : <span id="linear_acceleration_x"></span></p>
        <p>linear_acceleration_y : <span id="linear_acceleration_y"></span></p>
        <p>linear_acceleration_z : <span id="linear_acceleration_z"></span></p>
        <br>
        <h5>Quaternion 벡터(x,y,z) 스칼라(w)</h5>
        <p>vector_x : <span id="vector_x"></span></p>
        <p>vector_y : <span id="vector_y"></span></p>
        <p>vector_z : <span id="vector_z"></span></p>
        <p>scalar_w : <span id="scalar_w"></span></p>

        <br><hr>
        <h2>topic : /image_jpeg/compressed</h2>
        <img width="500" height="400" id="image"/>

    </body>
</html>
```

### 구현 순서

- VM 에서 gui.html 을 실행 ? [localhost](http://localhost)9090 이 여튼 띄워져 있음
- 컴터 움직이면 잘 보임

### 실행 결과

```powershell
$ roslaunch rosbridge_server rosbridge_websocket
```

![Untitled](web-morai%20%E1%84%8B%E1%85%A7%E1%86%AB%E1%84%83%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5%2033852739b3d64ad497dcfe37ffadb0db/Untitled%201.png)

![Untitled](web-morai%20%E1%84%8B%E1%85%A7%E1%86%AB%E1%84%83%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5%2033852739b3d64ad497dcfe37ffadb0db/Untitled%202.png)

![Untitled](web-morai%20%E1%84%8B%E1%85%A7%E1%86%AB%E1%84%83%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5%2033852739b3d64ad497dcfe37ffadb0db/Untitled%203.png)

![Untitled](web-morai%20%E1%84%8B%E1%85%A7%E1%86%AB%E1%84%83%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5%2033852739b3d64ad497dcfe37ffadb0db/Untitled%204.png)

![Untitled](web-morai%20%E1%84%8B%E1%85%A7%E1%86%AB%E1%84%83%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5%2033852739b3d64ad497dcfe37ffadb0db/Untitled%205.png)

![Untitled](web-morai%20%E1%84%8B%E1%85%A7%E1%86%AB%E1%84%83%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5%2033852739b3d64ad497dcfe37ffadb0db/Untitled%206.png)