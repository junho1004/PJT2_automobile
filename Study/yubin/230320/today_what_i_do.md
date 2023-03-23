# today_what_i_do

### test.launch

- 전역 경로를 따라 k-city map 을 한바꾸 돌도록 하는 것이 목적
- mgeo_pub.py
    - k-city map 을 rviz 상에 load
    - node, link topic 을 뚫어줌
- gpsimu_parser.py
    - gps 와 imu 데이터를 실시간으로 받아옴
    - odom 을 뿌림
- global_path_pub.py
    - 전역 경로 생성
    - mgeo_pub.py or [dijstra.py](http://dijstra.py) 갖고옴
    - global_path 를 뿌림
- local_path_pub.py
    - 지역 경로 생성
    - odom, global_path 를 받음
    - local_path 를 뿌림
- advanced_purepursuit.py
    - 위의 모든 파일을 받음
    - 시뮬레이터에 차량 제어 ctrl_cmd 를 publish

```
<launch>
    <node pkg="ssafy_2" type="mgeo_pub.py" name="mgeo_pub"  />
    <node pkg="ssafy_2" type="gpsimu_parser.py" name="gpsimu_parser" />

    <!-- <node pkg="ssafy_2" type="dijkstra.py" name="dijkstra" /> -->
    <node pkg="ssafy_2" type="global_path_pub.py" name="global_path_pub" />
    <node pkg="ssafy_2" type="local_path_pub.py" name="local_path_pub" />

    <node pkg="ssafy_2" type="advanced_purepursuit.py" name="advanced_purepursuit"  />
    <!-- <node pkg="ssafy_2" type="tf_pub.py" name="tf"  /> -->

    <!-- <node pkg="rviz" type="rviz" name="rviz" args="-d $(find ssafy_2)/rviz/kcity_rviz.rviz" /> -->
</launch>
```