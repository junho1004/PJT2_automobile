# 230321 - A-Star Algorithm

## 4-State node

- Block 은 변하지 않음 : 한번 block 은 영원한 block
- 나머지 노드는 Empty → Open → Close 순서로 변경됨

![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled.png)

## Steps

### Step1(S1): 도착한 Node 는 Close

![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%201.png)

### Step2(S2): 주변 Node 4가지 상태에 따라

* Leave 는 아무것도 하지 않는다는 의미

- Empty → OPEN
- BLOCK → Leave
- CLOSE → Leave
- OPEN → G가 작다 → 부모 Node 바꿈
    
               → G가 크다 → Leave
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%202.png)
    

### Step3(S3): 최소 F값 Node 로 이동

- G : 출발지로부터의 거리
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%203.png)
    
- H : 도착지까지의 거리
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%204.png)
    
- F = G + H
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%205.png)
    
- 최소 F값 Node 로 이동
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%206.png)
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%207.png)
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%208.png)
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%209.png)
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%2010.png)
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%2011.png)
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%2012.png)
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%2013.png)
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%2014.png)
    
    ![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%2015.png)
    

## 실패 경우

- 사방이 벽으로 막혀있는 경우 길울 찾을 수 없음
- Open Node 와 Empty 로만 이뤄지게 되는 경우 실패로 간주

![Untitled](230321%20-%20A-Star%20Algorithm%200153bdd04e964298b3f5464ef8054b9f/Untitled%2016.png)

## Source

https://github.com/sweetchild222/vanilla-algorithm

```python
from classes.node import Node
from classes.openList import OpenList
from classes.point import Point
from classes.map import Map
import classes.drawer as drawer

def aStar(start, stop, nodeMap):

    openList = OpenList()

    node = map.getNode(start)

    while True:

        node.setClose()

        drawer.draw(map, start, stop)

        if node.getPoint() == stop:
            return node

        childList = lookAround(node, nodeMap)

        openList.append(childList)

        node = openList.minCostFNode()

        if node is None:
            return None

def neighborBlock(node, deltaPoint, map):

    x = deltaPoint.x
    y = deltaPoint.y

    neighborList = []

    if (abs(x) + abs(y)) == 2:
        neighborList = [Point(x, 0), Point(0, y)]

    for point in neighborList:

        neighborPoint = node.getPoint() + point
        neighbor = map.getNode(node.getPoint() + point)

        if neighbor is None:
            continue

        if neighbor.isBlock() is True:
            return True

    return False

def lookAround(node, map):

    childDelta = [Point(1, 0), Point(1, -1), Point(0, -1), Point(-1, -1),
                 Point(-1, 0), Point(-1, 1), Point(0, 1), Point(1, 1)]

    openList = []

    for delta in childDelta:

        childPoint = node.getPoint() + delta
        childNode = map.getNode(childPoint)

        if childNode is None:
            continue

        if neighborBlock(node, delta, map) is True:
            continue

        if childNode.isBlock():
            continue
        elif childNode.isClose():
            continue
        elif childNode.isEmpty():
            childNode.setParent(node)
            childNode.setOpen()
            openList.append(childNode)
        elif childNode.isOpen():
            currentCostG = childNode.costG()
            newCostG = childNode.calcCostG(node)
            if currentCostG > newCostG:
                childNode.setParent(node)
        else:
            print('error!')

    return openList

"""
data = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, -1, 0, 0, 0,
    0, 0, 0, 0, -1, 0, 0, 0,
    0, 0, 0, 0, -1, 0, 0, 0,
    0, 0, 0, 0, -1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0]
"""

"""
data = [
    0, -1, -1, -1, 0, 0, 0, 0,
    -1, 0, 0, 0, -1, 0, 0, 0,
    0, 0, 0, 0, -1, 0, 0, 0,
    0, 0, 0, 0, -1, 0, 0, 0,
    0, -1, 0, 0, -1, 0, 0, 0,
    0, 0, 0, -1, 0, 0, 0, 0]
"""

data = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, -1, 0, 0, 0,
    0, 0, 0, 0, -1, 0, 0, 0,
    0, 0, 0, 0, -1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0]

width = 8
height = 6

start = Point(2, 3)
stop = Point(6, 3)

map = Map(data, width, height, stop)
node = aStar(start, stop, map)

while node:
    print(node.getPoint())
    node = node.getParent()
```