---
title: "구글이 내게 불법 도박 사이트를 추천한다."
excerpt: "구글 피드에서 사기 사이트가 추천되는 이유"
lang: "ko"
routeSlug: "google-feed-recommends-illegal-gambling-sites-to-me"
translationKey: "google-feed-recommends-illegal-gambling-sites-to-me"
publishedAt: "2024-06-21T00:00:00.000+00:00"
updatedAt: "2025-12-06T18:00:16.000+00:00"
tags: ["blog", "web"]
featureImage: "./images/feature-image.png"
commentsTerm: "google-feed-recommends-illegal-gambling-sites-to-me"
draft: false
---

안드로이드나 모바일 크롬 브라우저를 사용하는 사람이라면 홈 화면의 구글 피드나 브라우저 메인 화면에서 추천 컨텐츠를 본 적이 있을 것입니다. 이 기능은 사용자의 검색 기록, 위치, 관심사 등을 기반으로 사용자에게 맞춤형 컨텐츠를 제공합니다. 저는 세상의 여러 소식을 접하기 위해 이 기능을 자주 사용하고 있습니다.

그런데 어느 순간부터 타임라인에 수상한 도메인의 컨텐츠가 추천되기 시작했습니다. 이런 컨텐츠들은 얼핏 보면 정상적인 컨텐츠처럼 보이기도 합니다. 저에게는 주로 프론트엔드 기술과 관련된 정보성 글로 위장한 모습이었습니다.

하지만 글을 클릭해 보니 제목과는 전혀 관계없는 불법 도박 사이트로 리다이렉트됩니다. 처음엔 신고 후 다시는 눈에 띄지 않을거라 생각했는데 한달이 넘도록 계속해서 가짜 컨텐츠가 추천되고 있었습니다.

그래서 추천 기능을 꺼버릴까 고민하던 중에 문득 생각이 들었습니다. "이런 가짜 사이트는 어떻게 구글을 속이고 사용자에게 제공될 수 있는 걸까?"

본문은 제 궁금증을 해결하기 위한 고민과 실험의 과정을 다루고 있습니다. 사기 사이트가 어떤 과정을 통해 우리의 추천 컨텐츠에 노출되는지를 한 단계씩 살펴보고, 마지막으로는 이를 방지할 방법이 없는지 제 생각을 전달드리겠습니다.

---

## _사기 사이트의 동작 원리 알아내기_

![](./images/scam-site-desktop-access-failure.png)

사기 사이트의 동작 원리를 파악하기 위해서 먼저 해당 사이트에 접속해 개발자 도구를 사용하려 했습니다. 사이트의 HTML 구조와 자바스크립트 동작을 확인하면 도움이 될 것 같았기 때문입니다.

하지만 이런 사기 사이트들은 데스크탑 브라우저에서 접근이 불가능했습니다. 이 뿐 아니라 '구글 피드'를 통하지 않는 어떠한 환경에서도 접속이 불가능했습니다. 다음은 제가 접속을 시도한 환경들입니다.

- 데스크탑 브라우저: 404 오류
- Postman: 404 오류

- 구글 피드에서 복사한 URL 을 모바일 브라우저에 붙여넣기: 404 오류
- 구글 피드에서 클릭하여 접근: 성공

모든 상황에서 접속한 URL은 동일했습니다. 구글 피드에서만 접속이 가능한 이유는 모르겠지만, 우선은 이 서버가 다음 그림과 같이 일반적인 브라우저의 요청은 거절하고 있다는 사실을 기억하고 가겠습니다.

![](./images/scam-site-browser-filtering-diagram.png)

---

## _HTTP 헤더가 핵심이다._

위에서처럼 일반 브라우저를 차단하는 문제는 아마도 저처럼 분석을 시도하는 사용자들을 막기 위한 보안 장치로 예상됩니다. 생각보다 쉽지 않은 여정이 될 것 같지만, 여기서 알 수 있는 두가지 사실이 있습니다.

- 이 서버는 Nginx 를 사용합니다.
- 이 서버는 구글 피드에서 접근하는 상황은 분명하게 감지합니다.

Nginx 는 요청 URL과 Method가 같더라도 HTTP 요청의 헤더에 따라 다른 결과를 보낼 수 있습니다. 아마 구글 피드에서 페이지가 넘어온 경우는 특별한 헤더 값이 있을 것이고, 이 서버는 그 값이 있는 경우에만 사기 사이트로 이동하는 HTML을 반환할 것이라 예상할 수 있습니다.

그럼 이제 그 '특별한 헤더' 가 무엇인지 알아내야 합니다. 이걸 알아내는 가장 쉬운 방법은 사기 사이트에 정상적으로 접근되는 상황에서 개발자 도구로 요청의 HTTP 헤더를 확인하는 것 입니다.

하지만 앞서 말했듯, 이 사이트는 데스크톱 브라우저에서 접근할 수 없었습니다. 그래서 제가 생각한 또 다른 방법은 안드로이드 OS에서 사이트에 접속하고 라우터나 별도의 서버에서 네트워크 트래픽을 가로채는 것 입니다. 예시는 다음과 같습니다.

- 스마트폰으로 접속하고 라우터에서 해당 요청의 패킷을 분석하여 HTTP 헤더를 확인
- 안드로이드 VM의 Hosts를 수정하여 사기 사이트 도메인 요청을 로컬 Nginx 서버로 프록시

그런데 곧 이것도 불가능하다는 것을 깨달았습니다. SSL 인증서 없이는 네트워크 패킷을 확인할 수 없고, 프록시를 쓰더라도 SSL 인증서가 일치하지 않아 요청이 중단될 것이기 때문입니다.

마지막으로 시도한 방법은 안드로이드 VM과 크롬 브라우저의 원격 디버깅을 사용하는 것 입니다. 모바일 크롬의 시작 화면에서 원격 디버깅만 가능하다면, 데스크탑 브라우저처럼 네트워크 요청을 확인할 수 있을 것이라 생각했습니다.

![](./images/android-remote-debugging-network-inspection.png)

결과는 아주 잘 동작했습니다. 개발자 도구에서 사기 사이트에 정상 접근되는 요청의 `curl` 명령어를 가져올 수 있었습니다. 가져온 명령어는 다음과 같습니다.

```bash
curl 'https://alfa.sklep.pl/bucosvpltrhz/' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: en,ja;q=0.9,ko;q=0.8,en-US;q=0.7,st;q=0.6' \
  -H 'cookie: PHPSESSID=alolor9cv5glrsen734307dqkmsgegg3; fb93c=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjoie1wic3RyZWFtc1wiOntcIjUxNFwiOjE3MjE0NzM5MjYsXCIzXCI6MTcyMTQ3MzkyNixcIjUxNVwiOjE3MjE0NzQwNjQsXCIxODRcIjoxNzIxNDc0MDk1fSxcImNhbXBhaWduc1wiOntcIjE5XCI6MTcyMTQ3MzkyNixcIjFcIjoxNzIxNDczOTI2fSxcInRpbWVcIjoxNzIxNDczOTI2fSJ9.ZH6vpMkY0XkaN9vZE30j_6ZQbqk7ZbFnDUyGH6TctVw; _subid=9feaq790q009' \
  -H 'priority: u=0, i' \
  -H 'referer: https://www.google.com/' \
  -H 'sec-ch-ua: "Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?1' \
  -H 'sec-ch-ua-platform: "Android"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: none' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
```

이제는 PC에서 사기사이트 접속을 재현할 수 있습니다. HTTP 헤더를 하나하나 확인한 결과, 이 서버가 구글 피드에서 넘어온 요청인지 확인하는 부분은 `Referer: https://www.google.com/` 였습니다. 이 HTTP 헤더를 포함하여 Postman 이나 `curl` 로 요청을 시도하면 드디어 사기 사이트로 리다이렉트되는 HTML을 반환합니다.

```html
<html>
  <head>
    <script type="application/javascript">
      function process() {
        if (window.location !== window.parent.location) {
          top.location = "https://SCAM_SITE.com";
        } else {
          window.location = "https://SCAM_SITE.com";
        }
      }
      window.onerror = process;
      process();
    </script>
  </head>
  <body>
    The Document has moved <a href="SCAM_SITE.com">here</a>
  </body>
</html>
```

반환된 HTML은 정말 단순했습니다. 코드의 동작은 단순히 현재 페이지를 다른 웹 사이트(불법 도박 사이트)로 이동시키는 것 뿐입니다. 사용자의 브라우저에서 자동 라다이렉트가 지원되지 않는 경우를 위해 버튼도 하나 준비해 두었습니다.

이제 이 서버는 아래의 그림처럼 구글 피드 사용자에게 사기 컨텐츠를 반환하고 있음을 알았습니다.

![](./images/google-feed-user-redirect-flow.png)

---

## _크롤러는 어떻게 속인 것일까?_

이제 마지막 의문입니다. 위에서 사기사이트의 HTML 컨텐츠를 보면, 정말 아무것도 없이 단순히 다른 사이트로 이동하는 코드만 가지고 있습니다. 이런 사이트는 어떻게 구글 웹 크롤러에 의해 높은 평가를 받고, 사용자에게 추천되는 것일까요?

해답은 역시 HTTP 헤더입니다. 구글과 같은 검색 엔진의 크롤러는 HTTP 헤더에 유니크한 User-Agent 를 가집니다. 이런 사기 사이트들은 크롤러가 접근할 때에만 정상적인 컨텐츠를 반환하고, 사용자가 접근할 때는 사기 컨텐츠를 반환하는 방식을 사용합니다.

만약 크롤러가 이런 사기 사이트를 방문할 때는 아래와 같이 정상적인 HTML 컨텐츠를 받게 됩니다.

```html
<html>
  <head>
    <meta name="title" content="최고의 자바스크립트 팁 12선" />
    <meta name="description" content="최고의 자바스크립트 팁을 알려드립니다." />
    <meta property="og:title" content="최고의 자바스크립트 팁 12선" />
    <meta
      property="og:description"
      content="최고의 자바스크립트 팁을 알려드립니다."
    />
    <meta property="og:image" content="/awesome-image.png" />
  </head>
  <body>
    <h1>최고의 자바스크립트 팁 12선</h1>
    <p>최고의 자바스크립트 팁을 알려드립니다.</p>
    ...
  </body>
</html>
```

> 여기서의 HTML 은 제가 임의로 작성한 예시입니다. 여러가지 방법을 시도했지만 이 사기 서버에서 정상적인 컨텐츠를 받을 수 있는 방법은 찾지 못했습니다. 아마도 구글이 공개한 [크롤러의 IP 대역](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)을 사용해 접근해야만 정상적인 컨텐츠를 받을 수 있을 것으로 예상하고 있습니다.

이제 이 사기 사이트는 모두를 완벽하게 속였습니다. 구글에서 높은 평가를 받는 컨텐츠가 되었고, 사용자에게 추천됩니다. 그리고 이를 보려는 사용자는 불법 도박 사이트로 리다이렉트됩니다. 완성된 그림은 아래와 같습니다.

![](./images/google-feed-crawler-cloaking-flow.png)

마지막으로 이 사기 사이트 동작하는 전체 과정을 정리해보겠습니다.

1. 사기 사이트에 구글 크롤러가 접근하면 정상 컨텐츠 반환
2. 정상 컨텐츠는 검색어 최적화, 조작을 통해 구글 검색의 상위에 랭크

3. 구글 피드 사용자들에게 이 URL과 함께 크롤링한 정상적인 이미지와 텍스트를 노출
4. 사용자가 구글 피드를 통해 접근하면 불법 사이트로 리다이렉트되는 html 을 반환

---

## _어떻게 방지할 수 있을까?_

여기까지가 제가 구글 피드에서 겪은 사기 사이트를 추적해본 결과입니다. 이 과정에서 의외였던 점은 생각보다 간단한 기술 스택으로도 이런 사이트를 만들 수 있다는 것입니다. 가짜 컨텐츠와 Nginx 만 있으면 도메인만 바꿔가면서 무한히 사기 사이트를 만들 수 있을 것 같아 보였습니다.

반면에, 구글 입장에서는 이를 막기가 쉽지 않아 보였습니다. 제가 생각한 유일한 방법은 크롤러의 정보를 숨기고 IP 대역도 랜덤하게 바꾸는 것 입니다. 이렇게 하면 사기 사이트가 크롤러를 감지할 수 없게 됩니다. 그러면 사용자가 받게되는 사기 컨텐츠를 크롤러가 받게될 것이고, 애초에 이런 사이트가 구글 검색 엔진의 상위에 랭크되는 일도 발생하지 않을 것이라 예상합니다.

하지만 이건 쉽지 않은 일입니다. 정상적인 서버에서도 크롤러의 정보가 필요한 경우가 있기 때문입니다. 서버에선 크롤러와 일반 사용자의 트래픽을 구분해야 할 때도 있고, 특정 IP 대역폭 차단이 필요할 때 크롤러를 제외하기 위해서 정보가 필요할 수도 있습니다. 그래서 현재 구글은 크롤러의 정보를 공개하고 있습니다.

그래서 절충안을 생각해보면, 크롤러의 정보는 공개하되 크롤러와 사용자가 보는 컨텐츠가 다른지 확인하는 별도의 모니터링 시스템을 구축하는 것 입니다. 소수의 익명 크롤러를 같이 돌려보고 결과를 비교하면 이런 사기 사이트를 미리 차단할 수 있지 않을까란 생각이 들었습니다.

여기서 글을 마칩니다. 이 문제를 겪어보거나 좋은 해결 방안을 가진 분이 계시다면 댓글로 생각을 공유해주세요 :)
