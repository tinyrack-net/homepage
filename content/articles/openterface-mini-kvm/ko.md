---
title: "또 다른 작은 오픈소스 KVM, Openterface"
excerpt: "이 제품은 제조사로부터 무상으로 대여받았습니다.\n본 리뷰는 제조사의 가이드라인 없이 진솔하게 진행됨을 알려드립니다.\n\n일전에 유튜브에 Sipeed NanoKVM 이란 KVM 제품의 리뷰 영상을 올렸었는데, 얼마 뒤 한 메일이 도착했어요.\n\nI hope this message finds you well. My name is Billy Wang, founder of TecxArtisan and product manager of Openterface. I’m reaching out to introduce our latest Open-source gadget, the Openterface Mini-KVM, a KVM-over-USB gadget we’ve been developing for the past year. We’d love the opportunity to send you an Openterface Mini-KVM Toolkit for your review. We are keen"
lang: "ko"
routeSlug: "openterface-mini-kvm"
translationKey: "openterface-mini-kvm"
featureImage: "./images/1013207.JPG"
updatedAt: "2025-06-09T01:54:52.000+09:00"
publishedAt: "2025-05-19T16:38:16.000+09:00"
commentsTerm: "6828d3c2b90f9500013b4d02"
tags:
  - "news"
  - "hardware"
---
> 이 제품은 제조사로부터 무상으로 대여받았습니다.<br>
> 본 리뷰는 제조사의 가이드라인 없이 진솔하게 진행됨을 알려드립니다.

일전에 유튜브에 [Sipeed NanoKVM](https://youtu.be/xJJvupLO9uM?si=ZdVAuVIvlGXQTKVr&ref=tinyrack.net) 이란 KVM 제품의 리뷰 영상을 올렸었는데, 얼마 뒤 한 메일이 도착했어요.

> I hope this message finds you well. My name is Billy Wang, founder of TecxArtisan and product manager of Openterface. I’m reaching out to introduce our latest Open-source gadget, the [Openterface Mini-KVM](https://openterface.com/?ref=tinyrack.net), a KVM-over-USB gadget we’ve been developing for the past year. We’d love the opportunity to **send you an Openterface Mini-KVM Toolkit for your review**. We are keen on exploring the opportunity that you can support our open-source development by introducing this handy KVM-over-USB gadget to a wider audience.

TecxArtisan 란 회사에서 Openterface 라는 오픈소스 USB KVM을 만들었는데 한번 리뷰해 보지 않겠냐는 내용이었는데요. 광고료를 받는 것도 아니고 리뷰의 가이드라인이 정해져 있는 것도 아니여서 흔쾌히 수락하게 되었어요.

* * *

# 패키징과 외관

![](./images/1013194.JPG)

배송 받은 패키지는 위와 같아요. 우선 Openterface 와 케이블이 들어있는 본품 키트와 별매인 VGA to HDMI 컨버터 키트로 나뉘어져 있는 모습인데요. 컨버터 키트는 HDMI 포트가 없는 오래된 장비에 유용할 수 있는데 저는 그런 장비가 없어서 이번에는 본품의 키트만 사용했어요.

![](./images/1013197.JPG)

![](./images/1013199.JPG)

Openterface 본품 키트는 다음의 구성을 가지고 있어요.

- 가방
- 제품 본체
- Openterface 와 호스트 연결용 USB 케이블
- Openterface 와 타겟 연결용 USB 케이블
- Openterface 와 타겟 연결용 HDMI 케이블
- 기타
    -   본체의 확장 핀을 제어할 수 있는 여분의 교체용 캡
    -   퀵 스타트 가이드
    -   각종 스티커

먼저, USB 방식의 KVM은 특성상 케이블이 주렁주렁 달릴 수 밖에 없는데 단일 가방으로 깔끔하게 가지고 다닐 수 있게 구성한 것은 마음에 든 부분이에요.

호스트 연결용 케이블의 경우 20Gbps 의 고대역폭 케이블이 동봉되어 있는데 이 정도의 대역폭 까지는 필요 없어 보여서 좀 의아했어요. 근데 뭐 있어서 나쁠 건 없겠죠?

![](./images/1013200.JPG)

![](./images/1013201.JPG)

Openterface 본체의 경우 메탈 재질로 되어 있고 각종 인증 마크와 다이어그램이 삽입되어 있어요. 주황색의 상하단 케이블 가이드는 3D 프린터 사출물로 보이는데 상당히 깔끔하게 출력되어 있어서 딱히 불만은 없었어요. 특별히 심미성이 뛰어난 디자인은 아니지만 용도를 생각해보면 적당한 디자인이라 생각해요.

![](./images/1013204.JPG)

사용을 위해 연결을 구성하면 이런 모습이에요. USB는 C타입과 A타입에서 모두 사용할 수 있도록 변환 젠더가 구성되어 있어요.

* * *

# 가격

![](./images/image-4.png)

Openterface 는 현재 크라우드 펀딩 방식으로 판매하고 있는데, 일단 제가 좋아하는 방식은 아니에요. 크라우드 펀딩의 단점은 이제는 이미 많은 분들이 아시겠지만 제품이 제대로 만들어지지 않거나 배송을 차일피일 미루는 경우가 있거든요.

하지만 다행히도 Openterface 는 현재까지는 실제 제품을 잘 생산해서 구매자에게 전달하고 있는 것으로 보여요. 그래도 더 나은 소비자 보호를 위해서 앞으로는 일반적인 판매 경로(아마존, 알리 익스프레스 등)로 이동하는게 좋다고 생각해요.

현재 Openterface 는 세가지 키트 구성으로 판매되고 있는데, 옵션별 구성과 가격은 다음과 같아요.

- 제품 본체만: $89
- 가방 및 케이블이 동봉된 키트: $115
- VGA to HDMI 컨버터 키트: $25

일단 본체 단품과 키트 구성의 가격의 차이가 크지 않아서 저라면 키트를 구매할 것 같기는 한데 전체적으로 꽤 비싸다고 생각해요. 작은 업체에다 수요가 많지 않은 분야라 가성비가 좋기는 힘들다 생각하지만 그럼에도 가격이 높은 편이에요.

경쟁 모델이라 볼 수 있는 [NanoKVM USB](https://wiki.sipeed.com/hardware/en/kvm/NanoKVM_USB/introduction.html?ref=tinyrack.net) 모델이 얼마 전 비슷한 키트 구성으로 한화 약 77,000원 정도에 출시했는데요. 이것과 비교하면 두배 정도 차이가 나니 기능적 우위가 없다면 이걸 선택하긴 어렵겠다는 생각이 들었어요.

* * *

# 오픈소스

![](./images/image-5.png)

Openterface 는 완전한 오픈소스 하드웨어/소프트웨어를 지향해요. 그래서 누구나 제품 개선에 기여할 수 있고, 설계도를 받아 자신만의 제품을 만들 수도 있어요. 모든 소스는 [깃허브](https://github.com/TechxArtisanStudio?ref=tinyrack.net)에 공개되어 있어요.

이런 접근 방식은 제조사가 폐업하더라도 하드웨어/소프트웨어 지원을 커뮤니티에서 지속할 수 있고, 제품의 보안성도 투명하게 공개되기 때문에 사용자에게 더 높은 신뢰감을 줄 수 있다는 장점이 있어요.

하지만 이렇게 하면 타사에서 클론 제품을 만들어져도 제조사에서 대응이 어려워지게 돼요. 그래서 보통은 오픈소스란 결정을 쉽게 내리진 않는데요. 그래서 동일하게 오픈소스 하드웨어를 표방한 NanoKVM 조차도 제품의 인지도가 올라간 이후에나 소스를 공개했었어요.

이렇게 보면 오픈소스란 제조사의 천사같은 행동이라고 생각할 수도 있겠지만 사실 그렇지 않은 경우도 꽤 있어요. 완성도가 낮은 소프트웨어를 오픈소스로 올려두고 소비자가 알아서 개선해서 쓰라는 느낌이 들 때도 있거든요.

아직 Openterface 의 소프트웨어를 직접 사용하기 전이지만, 다행히 개발 활동은 활발해 보여요. 이런 제품은 소프트웨어 지원이 중요해서 앞으로도 적극적으로 개발이 진행되었으면 하는 바램이에요.

* * *

# 소프트웨어

![](./images/image-6.png)

이제 사용을 해봐야겠죠? Openterface의 소프트웨어는 크게 맥/윈도우/리눅스용으로 나뉘어 제공돼요. 제 맥은 이 Openterface 로 고쳐야 되는 상황이라 이번에는 윈도우와 리눅스의 사용 경험만을 말씀드릴게요.

## 윈도우

윈도우의 경우 포터블 버전과 설치 버전을 제공하고 있는데 저는 설치형을 사용했어요.

![](./images/screenshot-2025-05-18-035247.png)

우선 아쉬운 건 설치 파일에 적절한 인증서가 없어서 스마트 스크린 필터 경고가 노출된다는 점이에요. 요즘은 인증서가 있더라도 평판이 쌓이기 전까진 경고가 뜨겠지만, 적어도 인증서는 발급해서 설치 파일에 적용해야 한다고 생각해요.

![](./images/screenshot-2025-05-18-111033-1.png)

설치를 마치고 최초 실행에서는 드라이버 설치 과정이 진행되고, 재부팅 후 재실행하면 특별한 과정 없이 바로 동작했어요. FHD 해상도의 디스플레이를 보고 키보드와 마우스 동작을 바로 전달할 수 있었고, 바이오스를 진입해서 제어하는 행동도 잘 동작했어요.

![](./images/screenshot-2025-05-18-111638.png)

설정 중엔 본체의 펌웨어 업데이트 기능이 있는데 이것도 잘 동작했어요.

조금 특이했던 건 `Mouse Dance` 라는 기능이 있다는 건데, 이건 자동으로 마우스를 랜덤하게 움직여주는 기능이에요. 이런 기능은 재택 근무시 회사의 유휴 상태 감지 시스템을 회피하기 위해서나 슬립 모드로 들어가는걸 방지하기 위해 사용하는데 재밌는 부분이었어요.

## 사용 경험

우선 제가 KVM에게 기대하는 바를 말씀드리자면, 저는 KVM에게 저지연이나 고화질은 바라지 않아요. KVM은 시스템의 문제 상황에서 비상 솔루션이라 생각하기 때문에 절대적으로 '연결 안정성'이 중요하다고 생각하거든요.

만약 게임이나 원격 데스크탑 등의 목적이라면 KVM은 목적에 맞지 않을 가능성이 높아요. 이런 경우는 Parsec이나 RDP 같은 소프트웨어 기반 솔루션이 더 성능이 좋을 거예요.

그래서 제가 Openterface 에게 기대하는 것은 어떻게 연결을 하든 일단 제대로 동작할 수 있는가에요. 그래서 다음의 상황들을 테스트 해봤어요.

- 중간에 호스트 케이블 재연결 => 동작
- 타겟의 마우스/키보드 USB 케이블 재연결 => 동작
- 타겟의 디스플레이 케이블 재연결 => 동작
- 타겟의 케이블들만 꽂인 상태에서 호스트 연결 => 동작
- 호스트만 연결된 상태에서 타겟 케이블들 연결 => 동작
- 전원이 꺼진 상태에서 연결 후 부팅했을 때 바이오스 진입 => 동작
- 전원 켜진 상태에서 연결 후 재부팅했을 때 바이오스 진입 => 동작

테스트 환경이 너무 당연한 기능이라 생각하실 수 있지만, 생각보다 이게 잘 안되는 제품들이 있어요. KVM은 여러 선이 복잡하게 연결되어야 하는데, 특별한 순서로 연결해야만 제대로 동작한다면 너무 피곤해지거든요.

Openterface 의 경우 제 테스트 상황에서는 모두 잘 동작했어요. 그래서 적어도 윈도우에서 만큼은 확실히 제대로 된 소프트웨어를 제공한다고 생각해요.

## 리눅스 지원

다음으로 살펴본 것은 리눅스 지원이에요. 저는 메인 OS가 리눅스(Ubuntu 24.04)이기 때문에 리눅스에서의 동작 여부가 가장 중요했거든요. 우선은 [공식 홈페이지](https://openterface.com/app/?ref=tinyrack.net)에서 받은 패키지로 설치하고 [깃허브](https://github.com/TechxArtisanStudio/Openterface_QT?ref=tinyrack.net)의 설치 가이드를 따랐어요. 가이드에는 설치와 함께 다음의 명령어를 통해 적절한 의존성과 권한을 설정하라고 안내되어 있어요.

```bash
# Setup the QT 6.4.2 or laterruntime and other dependencies
sudo apt install -y \
   libqt6core6 \
   libqt6dbus6 \
   libqt6gui6 \
   libqt6network6 \
   libqt6multimedia6 \
   libqt6multimediawidgets6 \
   libqt6serialport6 \
   libqt6svg6 \
   libusb-1.0-0-dev

# Setup the dialout permission for Serial port
sudo usermod -a -G dialout $USER

# Setup the hidraw permission
echo 'SUBSYSTEM=="usb", ATTRS{idVendor}=="534d", ATTRS{idProduct}=="2109", TAG+="uaccess"' | sudo tee /etc/udev/rules.d/51-openterface.rules
sudo udevadm control --reload-rules
sudo udevadm trigger
```

여기서 먼저 아쉬운 건 패키지 설치 외에도 시스템에 이런 저런 수정을 가해야 한다는 점이에요. 저는 소프트웨어가 설치 후 바로 실행될 수 있을 정도로 사용성이 쉽길 바랬거든요.

![](./images/image-7.png)

그런데 이런 저런 시도를 해보다 결국은 리눅스에서의 Openterface 사용을 포기했어요. 잠깐씩 연결이 가능할 때도 있었지만 대부분의 상황에서 다음과 같은 문제가 발생해 실제 사용이 어려웠어요.

- 설명대로 진행해도 Serial 관련 권한 오류 발생, root 권한으로 실행해야 동작
- 옵션을 이리 저리 변경해도 화면 출력 불가
- 펌웨어 업데이트 기능 동작 불가
- 사용중 앱 크래시

그래서 현시점에서는 리눅스 지원이 제대로 되고 있다고 보기는 힘들어요. 이 부분은 더 많은 개선이 필요하다고 생각해요.

* * *

# 정리

![](./images/1013206.JPG)

지금까지의 모습으로 봤을 때 Openterface 가 KVM의 가치는 충분히 잘 담았다 생각해요. 제 테스트에서는 연결 안정성도 충분했고, 적어도 윈도우에서 만큼은 제대로된 소프트웨어를 제공했어요. 맥에서도 잘 동작한다면 적어도 메이저 호스트 OS에서는 큰 문제 없이 사용할 수 있을 것이라 기대해요.

![](./images/screenshot-2025-05-19-161527-1.png)

하지만 개선할 점도 많았어요. 전체 화면에서 화면이 잘리는 등 사소한 버그들이 꽤 있었고 리눅스 소프트웨어는 정상적으로 사용이 어려웠어요. 앞으로 개선되겠지만, 소비자가 제품을 받기 이전에 해결하는게 더 좋았을 것이라 생각해요.

가장 큰 문제는 가격이에요. 신생 업체라 완성도는 부족할 수 있다고 생각하지만 NanoKVM 같은 완성형 제품과 비교했을 때 확실한 우위를 찾기가 어려웠어요. 좀 더 오픈소스에 가깝다는 장점만으로는 부족하다 생각해요.

전체적으로 아쉬운 쪽에 더 가까운 제품이긴 했지만 그럼에도 이런 도전을 하는 기업이 있다는 건 정말 반가운 일이에요. 저렴한 서버 장비를 만드는 기업들이 많지 않거든요. 앞으로는 더 발전해서 재밌는 물건들을 많이 선보이길 기대해볼게요.
