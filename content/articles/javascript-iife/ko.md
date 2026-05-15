---
title: "자바스크립트의 즉시실행함수"
excerpt: "IIFE(Immediately Invoked Function Expression) 는 '즉시 실행 함수' 를 명칭한다. 말 그대로 선언과 동시에 실행되는 함수를 의미한다.\n\n보통 함수를 생성하고 그 함수를 즉시 실행한다고 가정하면 아래와 같이 표현할 수 있다.\n\nfunction a() {\n  console.log('hello world');\n}\na();\n\n\n만약 함수를 단 1회만 호출해야 한다면 a 라는 변수의 할당이 아까워질 수 있다. 이를 축약할 수 있는 것이 IIFE 패턴이다.\n\n(function () {\n  console.log('hello world');\n})();\n\n\nIIFE 는 선언과 동시에 실행되므로, 함수의 이름을 지정하지 않아도(함수 표현식) 오류가 발생하지 않는다. 그리고 함수의 반환값은 변수의 할당값으로 지정된다.\n\nvar a = (function () {\n  return 3;\n})();\nconsole.log(a); // 3;\n\n\nIIFE 를 사용하면 자바스크립"
lang: "ko"
routeSlug: "javascript-iife"
translationKey: "javascript-iife"
publishedAt: "2020-09-15T00:00:00.000+00:00"
updatedAt: "2025-12-06T19:15:14.000+00:00"
tags: ["blog", "frontend"]
featureImage: "./images/feature-image.png"
commentsTerm: "javascript-iife"
draft: false
---

`IIFE(Immediately Invoked Function Expression)` 는 '즉시 실행 함수' 를 명칭한다. 말 그대로 선언과 동시에 실행되는 함수를 의미한다.

보통 함수를 생성하고 그 함수를 즉시 실행한다고 가정하면 아래와 같이 표현할 수 있다.

```javascript
function a() {
  console.log('hello world');
}
a();
```

만약 함수를 단 1회만 호출해야 한다면 a 라는 변수의 할당이 아까워질 수 있다. 이를 축약할 수 있는 것이 IIFE 패턴이다.

```javascript
(function () {
  console.log('hello world');
})();
```

IIFE 는 선언과 동시에 실행되므로, 함수의 이름을 지정하지 않아도(함수 표현식) 오류가 발생하지 않는다. 그리고 함수의 반환값은 변수의 할당값으로 지정된다.

```javascript
var a = (function () {
  return 3;
})();
console.log(a); // 3;
```

IIFE 를 사용하면 자바스크립트에서 변수의 `은닉성(encapsulation)` 도 구현할 수 있다.

```javascript
/* b의 불변성이 보장되지 않는다. */
var a = {
  b: 3;
};
a.b = 5;

/* b의 불변성이 보장된다. */
var a = (function () {
  // b 변수를 외부에서 바꿀 수 없다.
  var b = 3;
	return {
    getB() {
      return b;
    }
  };
})();

console.log(a.getB()); // 3;
console.log(a.b); // undefined;
```

그래서 브라우저 라이브러리의 대부분이 이 은식성을 사용하기 위해 `(() ⇒ {})()` 라는 별 의미없어 보이는 코드로 감싸져 있는 것이다.

IIFE 는 성능 역시 개선할 수 있다. 다음의 코드를 보자

```javascript
function getSomeValue(a, b) {
	function squared(num) {
    return num * num;
  }
  function subtractOne(num) {
    return num - 1;
  }
  return squared(a) + subtractOne(b);
}

console.time('작업');
Array.from(new Array(10000000)).forEach(() => {
  getSomeValue(5, 5);
});
console.timeEnd('작업');
// 350ms;
```

위의 코드를 돌리면 약 350ms 정도(작성자 기준)의 연산 시간이 소요된다. 이를 개선하기 위해 문제를 살펴보자면, 상기 코드는 `getSomeValue` 함수의 호출때마다 `squared`, `subtractOne` 함수를 재정의하고 있다.

위 코드는 `squared`, `subtractOn` 함수를 전역 스코프 영역으로 빼는 방법도 있겠지만, 이 함수를 다른 곳에서 참조하거나 변형할 여지가 있게 되므로 이 방식은 위험하다.

이럴 때에도 IIFE 는 유용하게 사용할 수 있다.

```javascript
var getSomeValue = (function () {
  /* 이 함수는 한번만 할당되며, 외부에서 변경할 수도 없다. */
	function squared(num) {
    return num * num;
  }
  /* 이 함수는 한번만 할당되며, 외부에서 변경할 수도 없다. */
  function subtractOne(num) {
    return num - 1;
  }
  /* 실제 이 부분만 호출하여 사용하게 된다. */
  return function (a, b) {
    return squared(a) + subtractOne(b);
  }
})();

console.time('작업');
Array.from(new Array(10000000)).forEach(() => {
  getSomeValue(5, 5);
});
console.timeEnd('작업');
// 200ms;
```

자바스크립트에는 원래 클래스가 없다. 자바스크립트의 클래스 문법은 단지 문법적 설탕(syntactic sugar)에 지나지 않는다. 증거로 생성된 class 의 타입을 출력해보면 아래와 같이 나온다.

```javascript
class A {};
console.log(typeof A); // function
```

자바스크립트의 클래스 내부는 함수로 구현되어 있고, IIFE 역시 사용되어 있다. 간단한 클래스를 만들어보면 다음과 같다.

```javascript
var Person = (function () {

  function Constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  Constructor.prototype.getName = function () {
    return this.name;
  }

  Constructor.prototype.getAge = function () {
    return this.age;
  }

  return Constructor;
})();

var person = new Person('winetree94', 20);

console.log(person.getName());
console.log(person.getAge());
```

참고할만한 자료

- [MDN Web Doc](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)
