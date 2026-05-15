---
title: "확장성을 갖춘 손쉬운 텍스트 에디터, Edybara"
excerpt: "Edybara"
lang: "ko"
routeSlug: "edybara"
translationKey: "edybara"
publishedAt: "2024-01-08T00:00:00.000+00:00"
updatedAt: "2025-12-07T10:54:00.000+00:00"
tags: ["project", "frontend"]
featureImage: "./images/feature-image.gif"
commentsTerm: "edybara"
draft: false
---

> 💡 이 프로젝트는 현재 개발중으로, 현재 공개된 링크는 제품의 컨셉을 확인하기 위한 용도입니다. 제공되는 링크나 기능은 고지 없이 변경될 수 있습니다.

Edybara은 ProseMirror 를 기반으로 한 오픈소스 리치 텍스트 에디터입니다. ProseMirror 와 함께 사용 가능한 서식과 플러그인을 제공합니다. 프로젝트는 [Github](https://github.com/winetree94/edybara) 에서 관리되며, [공식 홈페이지](https://edybara.com) 를 통해 자세한 문서를 확인할 수 있습니다.

---

### Core Concept

ProseMirror 는 사용자가 텍스트 에디터에서 상상하는 거의 모든 것들을 만들 수 있는 강력한 도구입니다. 서식이나 UI/UX 의 거의 모든 부분을 비즈니스 요구사항에 맞춰 변경할수 있습니다.

하지만 ProseMirror 는 즉시 사용 가능한 라이브러리 보다는 에디터를 만들 수 있는 프레임워크에 가깝습니다. 그래서 실제 사용하기까지는 상당한 추가 개발이 필요하며, 에디터를 저수준에서 다룰 수 있도록 만들어진 만큼 API 가 방대하고 러닝 커브도 높은 편입니다.

Edybara 는 이 문제 지점을 해결하기 위해 존재합니다. Edybara 는 ProseMirror 를 사용할 때 Easy-To-Start 가 가능하도록 미리 정의된 서식과 플러그인을 제공합니다. 이를 통해 사용자는 ProseMirror 기반의 에디터를 빠르게 구현하고 제공할 수 있습니다.

Edybara 는 기능별로 독립적으로 개발 및 배포되며 ProseMirror 의 표준 API 엔드포인트(Schema, Plugin)를 제공합니다. 그렇기에 기존의 ProseMirror 프로젝트에서도 Edybara 의 일부 기능만을 설치해 사용할 수 있습니다.
