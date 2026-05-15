---
title: "구글 어시스턴트가 똑똑해졌으면 좋겠어, GPT Voice Assistant"
excerpt: "GPT Voice Assistant"
lang: "ko"
routeSlug: "gpt-voice-assistant"
translationKey: "gpt-voice-assistant"
publishedAt: "2023-11-10T00:00:00.000+00:00"
updatedAt: "2025-12-07T10:54:19.000+00:00"
tags: ["project", "python", "ai"]
featureImage: "./images/feature-image.png"
commentsTerm: "gpt-voice-assistant"
draft: false
---

> 💡 이 프로젝트는 Public Archive 상태로 더 이상 유지보수되지 않습니다.

GPT Voice Assistant 는 ChatGPT 와 음성으로 대화할 수 있는 작은 파이썬 프로젝트입니다. [Github](https://github.com/winetree94/GPT-Voice-Assistant) 에서 관리되며, [WIKI](https://github.com/winetree94/GPT-Voice-Assistant/wiki)를 통해 자세한 사용 방법을 확인할 수 있습니다.

> 현재는 ChatGPT 에서 자체적으로 음성 대화 기능을 제공합니다. 이제는 굳이 이 프로젝트를 사용하실 필요가 없습니다.

---

### Core Concept

저는 구글 어시스턴트의 헤비 유저입니다. 저의 집 안에서는 여러 구글 스피커(Nest Audio)가 동기화되어 매일 음악을 틀고 제 음성 명령을 수행합니다. 집안의 수많은 전자기기도 구글과 연동되어 제어되도록 구성되어 있습니다.

얼마 후 ChatGPT가 출시했습니다. ChatGPT의 자연어 처리 성능을 보니 기존의 제 구글 스피커들이 바보처럼 느껴질 지경이었습니다. 그래서 저는 이런 자연어 처리 성능을 음성 비서로 사용해보면 어떨까 하는 궁금증이 생겼습니다.

GPT Voice Assistant는 OpenAI 의 ChatGPT 를 활용한 AI 음성 비서입니다. PC의 마이크를 통해 GPT와 다양한 언어(한글, 영어 등)로 대화할 수 있습니다. 음성 인식(STT)과 음성 합성(TTS)은 Google 의 API 를 통해 처리됩니다.
