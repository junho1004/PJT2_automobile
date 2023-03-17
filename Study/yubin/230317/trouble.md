# 230317 - trouble

## ImportError: dynamic module does not define module export function (PyInit__tf2)

### 문제상황

---

- 실행되는 파일 : mgeo_pub.py, local_path_pub.py
- 실행되지 않는 파일 : gpsimu_parser.py, dijkstra.py, advanced_purepursuit.py, tf_pub.py, rviz

```powershell
<launch>
    <node pkg="ssafy_2" type="mgeo_pub.py" name="mgeo_pub"  />
    <node pkg="ssafy_2" type="gpsimu_parser.py" name="gpsimu_parser" />

    <node pkg="ssafy_2" type="dijkstra.py" name="dijkstra" />
    <node pkg="ssafy_2" type="local_path_pub.py" name="local_path_pub" />

    <node pkg="ssafy_2" type="advanced_purepursuit.py" name="advanced_purepursuit"  />
    <node pkg="ssafy_2" type="tf_pub.py" name="tf"  />

    <node pkg="rviz" type="rviz" name="rviz" args="-d $(find ssafy_2)/rviz/kcity_rviz.rviz" />
</launch>
```

- **rviz 에러메시지**

```powershell
[ERROR] [1679035480.698958768]: a message of over a gigabyte was predicted in tcpros. that seems highly unlikely, so I'll assume protocol synchronization is lost.
[ERROR] [1679035480.710221087]: Exception thrown when deserializing message of length [0] from [/rosbridge_websocket]: Buffer Overrun
```

- **gpsimu_parser.py, dijkstra.py, advanced_purepursuit.py, tf_pub.py 에러메시지**

```powershell
ImportError: dynamic module does not define module export function (PyInit__tf2)
```

![Untitled](230317%20-%20trouble%20d40042de21c84389a0ac210b9ec8e96f/Untitled.png)

### 원인

---

- tf(transform) 정보를 가져오는 데 문제가 있는 것으로 보임

### 해결

---

- 해결에 실패함
- 속상함