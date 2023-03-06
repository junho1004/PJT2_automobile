# C109 조 

## git flow 

### Branch 종류

- main
    - 배포 가능한 상태의 결과물
- develop
    - 구현한 기능을 병합하기 위한 브랜치
    - 통합 폴더의 기능
- feature
    - 개별 기능 구현 브랜치
    - 기능 개발 완료 시 삭제
    - 네이밍 규칙
        - feat/파트/기능
        - feat/fe/login
        - feat/be/login
 - release
    - 배포 전 QA(품질검사)를 하기위한 브랜치
 - hotfix
    - 배포 후 버그가 생겼을 떄 긴급 수정하는 브랜치

### Merge 관련

- MR은 Git lab을 통해 요청 및 수락
- MR시
    - title : merge하려는 브랜치 이름
    - description : 비우기