# 230320 - trouble shooting

### 문제상황

---

- import tf 관련 에러 발생
- pip install tf 안먹음
- pip3 install tf 안먹음
- 찾아보니 파이썬 버전 에러라는 의견
- https://github.com/RobotnikAutomation/summit_xl_sim/issues/21
    
    ![Untitled](230320%20-%20trouble%20shooting%20d87cf70c9b5c4b0f88c6e520c0586355/Untitled.png)
    

### 문제해결

---

- gps_parser.py 는 MORAI 에서 재연결
- gpsimu_parser.py 코드 첫줄 변경
- morai F3 에서 Disconnect 했다가 Connect 해서 재연결

```python
#!/usr/bin/env python 에서
#!/usr/bin/env python2.7 로 변경
#!/usr/bin/env 또는 이것으로 변경
```

```python
Traceback (most recent call last):
  File "/home/ssafy/mobility-autodriving-skeleton/ssafy_ad/src/ssafy_2/scripts/dijkstra.py", line 11, in <module>
    import tf
  File "/opt/ros/melodic/lib/python2.7/dist-packages/tf/__init__.py", line 30, in <module>
    from tf2_ros import TransformException as Exception, ConnectivityException, LookupException, ExtrapolationException
  File "/opt/ros/melodic/lib/python2.7/dist-packages/tf2_ros/__init__.py", line 38, in <module>
    from tf2_py import *
  File "/opt/ros/melodic/lib/python2.7/dist-packages/tf2_py/__init__.py", line 38, in <module>
    from ._tf2 import *
ImportError: dynamic module does not define module export function (PyInit__tf2)
```