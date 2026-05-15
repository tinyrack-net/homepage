---
title: "사용자의 펜 입력을 자연스럽게, Vector Optimizer"
excerpt: "Vector Optimizer"
lang: "ko"
routeSlug: "vector-optimizer"
translationKey: "vector-optimizer"
publishedAt: "2023-01-16T00:00:00.000+00:00"
updatedAt: "2025-12-07T10:54:52.000+00:00"
tags: ["project", "frontend"]
featureImage: "./images/feature-image.gif"
commentsTerm: "vector-optimizer"
draft: false
---

> 💡 이 프로젝트는 Public Archive 상태로 더 이상 유지보수되지 않습니다.

Vector Optimizer 는 벡터 최적화 유틸리티입니다. 점들의 상관관계를 파악하고 이를 최적화하여 자연스러운 곡선을 만들어줍니다. 프로젝트는 [Github](https://github.com/winetree94/VectorOptimizer) 에서 관리되며, [NPM](https://www.npmjs.com/package/vector-optimizer)을 통해 배포됩니다. [Live Preview](https://winetree94.github.io/VectorOptimizer) 를 통해 프로젝트를 직접 사용해볼 수 있습니다.

> 이 프로젝트는 [Bobby Fraser's 'Vector Optimizer' C# Project](https://gitlab.com/burningmime/curves) 를 Javascript / Typescript 로 재구현한 것입니다.

---

### Core Concept

먼저, 사용자가 브라우저에서 펜이나 마우스를 사용해 무언가를 그리는 기능을 제공한다고 가정해봅시다. 보통은 사용자의 커서 움직임을 추적하여 점들을 기록하게 되고 점들은 아래와 같이 기록됩니다.

![](./images/raw-input-points.png)

사용자가 원하는 결과는 점이 아니라 하나의 선일 것입니다. 그림을 완성하기 위해 이 점들을 직선으로 잇는다면 결과는 아래와 같이 표현됩니다.

![](./images/straight-line-connection.png)

이는 어느 정도는 볼만 합니다. 하지만 몇가지 문제가 발생합니다.

- 점과 선의 수가 너무 많아서 그림의 데이터 크기가 커집니다. 이는 저장 비용의 증가입니다.

- 벡터 연산이 크게 증가하므로 복잡한 그림을 그릴수록 성능이 저하됩니다.

- 사용자는 곡선을 그렸음에도 곡선이 아닌 삐뚤삐뚤한 선이 만들어집니다.

Vector Optimizer 는 위 문제를 해결합니다. 먼저 사용자가 그린 점들의 상관관계를 파악하고, 이를 최적화하여 일정한 간격으로 점을 줄입니다. 이 과정에서 선형 보간법(Linear Interpolation)을 사용합니다. 최적화된 점의 모습은 다음과 같습니다.

![](./images/optimized-points.png)

그리고 이전 과정을 바탕으로 가장 최적화된 3차 베지어 곡선(Cubic Bézier Curve)을 찾아 최종적인 그림을 완성합니다. 완성된 그림은 다음과 같습니다.

![](./images/optimized-bezier-curve.png)

최종 결과를 보면 선의 개수가 크게 감소했으면서도 사용자가 그린 곡선을 잘 표현하고 있음을 볼 수 있습니다. 필요하다면 최적화 정도를 조절하여 사용자의 입력을 더욱 자연스럽게 표현할 수 있습니다.
