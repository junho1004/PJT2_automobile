#include <iostream>
#include <queue>
using namespace std;

int N, M, endY, endX;
bool arriveFlag, finishFlag;
char MAP[50][51];

const int dy[] = {0,0,-1,1};
const int dx[] = {-1,1,0,0};

typedef struct {
	int y, x;
}INFO;
queue<INFO> rq, hq;

void input() {
	ios_base::sync_with_stdio(false);
	cin.tie(NULL);	cout.tie(NULL);

	cin >> N >> M;
	for (int y = 0; y < N; ++y) {
		cin >> MAP[y];
		for (int x = 0; x < M; ++x) {
			if (MAP[y][x] == 'W') hq.push({y, x});
			if (MAP[y][x] == 'H') endY = y, endX = x;
			if (MAP[y][x] == '*') rq.push({y, x});
		}
	}
}

bool isValid() {
	for (int y = 0; y < N; ++y) {
		for (int x = 0; x < M; ++x) {
			if (MAP[y][x] == 'W') return true;
		}
	}
	return false;
}

queue<INFO> rainMove() { // 'H'못감, 'X'닿으면 소멸 
	queue<INFO> nrq;
	while (!rq.empty()) {
		INFO cur = rq.front();	rq.pop();
		for (int dir = 0; dir < 4; ++dir) {
			int ny = cur.y + dy[dir];
			int nx = cur.x + dx[dir];
			if (ny < 0 || ny >= N || nx < 0 || nx >= M) continue;
			if (MAP[ny][nx] == '.' || MAP[ny][nx] == 'W') {
				MAP[ny][nx] = '*';
				nrq.push({ny, nx});
			}
		}
	}
	return nrq;
}

queue<INFO> humanMove() { // arriveFlag
	queue<INFO> nhq;
	while (!hq.empty()) {
		INFO cur = hq.front();	hq.pop();
		for (int dir = 0; dir < 4; ++dir) {
			int ny = cur.y + dy[dir];
			int nx = cur.x + dx[dir];
			if (ny < 0 || ny >= N || nx < 0 || nx >= M) continue;
			if (MAP[ny][nx] == 'H') {
				arriveFlag = true;
				break;
			}
			if (MAP[ny][nx] == '.') {
				MAP[ny][nx] = 'W';
				nhq.push({ny, nx});
			}
		}
	}

	if (nhq.size() == 0) finishFlag = true;
	return nhq;
}

int Solve() {
	int timer = 0;
	while (1) {
		if (arriveFlag == true) break;
		if (!isValid() || finishFlag == true) {
			timer = -1;
			break;
		}
		rq = rainMove();
		hq = humanMove();
		timer++;
	}
	return timer;
}

int main()
{
	input();
	int ret = Solve();
	if (ret == -1) cout << "FAIL";
	else cout << ret;
	return 0;
}