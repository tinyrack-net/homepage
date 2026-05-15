---
title: "대규모 데이터도 느리지 않게, VanillaRecyclerView"
excerpt: "가상 스크롤 라이브러리"
lang: "ko"
routeSlug: "vanilla-recycler-view"
translationKey: "vanilla-recycler-view"
publishedAt: "2022-05-08T00:00:00.000+00:00"
updatedAt: "2025-12-06T18:04:39.000+00:00"
tags: ["project", "frontend"]
featureImage: "./images/feature-image.gif"
commentsTerm: "vanilla-recycler-view"
draft: false
---

> 💡 이 프로젝트는 Public Archive 상태로 더 이상 유지보수되지 않습니다.

VanillaRecyclerView 는 웹에서 대량의 데이터를 효과적으로 제어하고 화면에 렌더링하기 위한 고성능 UI 렌더링 라이브러리 입니다. Framework 에 종속되지 않도록 순수한 자바스크립트로 설계되었으며, 단순한 API 를 제공하여 쉽게 사용할 수 있습니다.

주요 지원사항은 아래와 같습니다.

#### 가상화 DOM

가로 또는 세로의 전체 스크롤 영역에서 사용자가 보고 있는 영역만을 실시간으로 렌더링합니다. 페이지의 초기 렌더링 속도를 향상시키고, 전체 퍼포먼스를 증가시킬 수 있습니다.

#### 재사용 DOM

매 순간 새로운 DOM 을 생성하는 것이 아니라, 현재 스크롤 영역에서 벗어난 기존의 DOM 을 재사용합니다. 실시간 렌더링에 따른 스크롤 성능 저하를 최소화 할 수 있습니다.

프로젝트는 [Github](https://github.com/winetree94/VanillaRecyclerView) 에서 관리되며, [NPM](https://www.npmjs.com/package/vanilla-recycler-view)을 통해 배포됩니다.

---

### 실시간 예제

- [빠른 시작(세로)](https://stackblitz.com/edit/vanilla-recycler-view-quickstart-example?file=index.js)

- [빠른 시작(가로)](https://stackblitz.com/edit/vanilla-recycler-view-quickstart-horizontal-example?file=index.js)

- [재사용 DOM 예제](https://stackblitz.com/edit/vanilla-recycler-view-reusable-example?file=index.js)

- [타입스크립트와 함께 사용](https://stackblitz.com/edit/vanilla-recycler-view-typescript-example?file=index.ts)

- [복잡한 레이아웃 구현](https://stackblitz.com/edit/vanilla-recycler-view-complex-example?file=index.ts)

- [무한 스크롤 구현](https://stackblitz.com/edit/vanilla-recycler-view-infinity-scroll-example?file=index.ts)
