# refactoring

## 0 Markdown ##

Markdown은 텍스트 기반의 마크업 언어로 HTML로 변환이 가능하다.
특수기호와 문자를 이용한 매우 간단한 구조의 문법을 사용하여 웹에서도 보다 빠르게 컨텐츠를 작성하고 보다 직관적으로 인식할 수 있다.

### 1 장점 ###
```
1. 간결하다.
2. 별도의 도구 없이 작성가능하다.
3. 다양한 형태로 변환이 가능하다.
4. 텍스트로 저장되기 때문에 용량이 적어 보관이 용이하다.
5. 텍스트 파일이기 때문에 버전관리시스템을 이용하여 변경이력을 관리할 수 있다.
6. 지원하는 프로그램과 플랫폼이 다양하다.
```

### 2 단점 ###

>    1. 표준이 없다.
>    2. 표준이 없기 때문에 도구에 따라서 변환방식이나 생성물이 다르다.
>    3. 모든 HTML마크업을 대신하지 못한다.

---------------------------------------------------------

## 01 리팩터링 첫 번째 예시 ##
----------------------------------------
프로그램이 잘 작동하는 상황에서 그저 코드가 '지저분하다'는 이유로 불평하는 것은 프로그램의 구조를 너무 미적인 기준으로만 판단하는 건 아닐까? 컴파일러는 코드가 깔끔하든 지저분하든 개의치 않으니 말이다. 하지만 그 코드를 수정하려면 사람이 개입되고, 사람은 코드의 미적 상태에 민감하다.

**설계가 나쁜 시스템은 수정하기 어렵다.**

원하는 동작을 수행하도록 하기위해 수정해야 할 부분을 찾고, 기존 코드와 잘 맞물려 작동하게 할 방법을 강구하기가 어렵기 때문이다. 무엇을 수정할지 찾기 어렵다면 실수를 저질러서 버그가 생길 가능성도 높아진다.
*코드를 수정할 때면 먼저 프로그램의 작동 방식을 더 쉽게 파악할 수 있도록 코드를 여러 함수와 프로그램 요소로 재구성한다.* 프로그램의 구조가 빈약하다면 대체로 구조부터 바로잡은 뒤에 기능을 수정하는 편이 작업하기가 훨씬 수월하다.

> **프로그램이 새로운 기능을 추가하기에 편한 구조가 아니라면, 먼저 기능을 추가하기 쉬운 형태로 리팩터링하고 나서 원하는 기능을 추가한다.**

이 코드에서 사용자의 입맛에 맞게 수정할 부분을 몇 개 발견했다. 가장 먼저 청구내역을 HTML로 출력하는 기능이 필요하다. 
이 변경이 어느 부분에 영향을 줄지 생각해보자. 우선 (HTML태그를 삽입해야 하니) 청구 결과에 문자열을 추가하는 문장 각각을 조건문으로 감싸야한다. 그러면 statement()함수의 복잡도가 크게 증가한다. 이런 상황이라면 대부분 *이 함수의 복사본을 만들고 복사본에서 HTML을 출력하는 식으로 처리할 것이다.*
이때 복사하는 일 자체는 그리 부담되지 않지만, 나중에 수많은 문제를 일으킬 여지가 있다. 청구서 작성 *로직을 변경할 때마다 기존 함수와 HTML버전 함수 모두를 수정하고, 항시 일관되게 수정했는지도 확인해야 한다.* 로직을 변경할 일이 절대 없다면 이렇게 복사해서 붙이는 방식도 상관없지만, 오래 사용할 프로그램이라면 중복 코드는 골칫거리가 된다.


이는 두 번째 변경 사항과도 관련이 있다. 
배우들은 사극, 전원극, 전원 희극, 역사 전원극, 역사 비극, 희비 역사 전원극, 장면 변화가 없는 고전극, 길이와 시간과 장소에 제약없는 자유극 등 더 많은 장르를 연기하고 싶어 한다. 언제 어떤 연극을 할지는 아직 결정하지 못했지만, 이 변경은 공연료와 적립 포인트 계산법에 영향을 줄 것이다. *어떤 방식으로 정하든 반드시 6개월 안에 다시 변경하게 될 것이다.* 새로운 요구사항은 수색 대원처럼 한두명씩이 아니라, 한 부대씩 몰려오기 마련이다.


 이처럼 연극 장르와 공연료 정책이 달라질 때마다 statement()함수를 수정해야 한다. 만약 statement()를 복사해서 별도의 htmlStatement()를 만든다면 모든 수정이 두 함수에 일관되게 반영되도록 보장해야 한다. 게다가 정책이 복잡해질수록 수정할 부분을 찾기 어려워지고 수정 과정에서 실수할 가능성도 커진다.

 **이것이 리팩터링이 필요한 이유이다.**

잘 작동하고 나중에 변경할 일이 절대 없다면 코드를 현재 상태로 놔둬도 아무런 문제가 없다. 하지만 다른 사람이 읽고 이해해야 할 일이 생겼는데 로직을 파악하기 어렵다면 뭔가 대책을 마련해야 한다.

----------------------

### 리팩터링의 첫 단계 ###
리팩터링의 첫 단계는 항상 똑같다.
*리팩터링할 코드 영역을 꼼꼼하게 검사해줄 테스트 코드들부터 마련해야 한다.* 리팩터링에서 테스트의 역할은 굉장히 중요하다. 리팩터링 기법들이 버그 발생 여지를 최소화하도록 구성됐다고는 하나 실제 작업은 사람이 수행하기 때문에 언제든 실수할 수 있다. 프로그램이 클수록 수정 과정에서 예상치 못한 문제가 발생할 가능성이 크다. 

statement()함수의 테스트는 어떻게 구성하면 될까? 이 함수가 문자열을 반환하므로, 다양한 장르의 공연들로 구성된 공연료 청구서 몇 개를 미리 작성하여 문자열 형태로 준비해둔다. 그런 다음 statement()가 반환한 문자열과 준비해둔 정답 문자열을 비교한다. 그리고 테스트 프레임워크를 이용하여 모든 테스트를 단축키 하나로 실행할 수 있도록 설정해둔다. 이 테스트는 몇 초면 끝날 것이며, 나중에 보겠지만 테스트를 수시로 한다. 

> **리팩터링하기 전에 제대로 된 테스트부터 마련한다. 테스트는 반드시 자가진단하도록 만든다.**

내가 저지른 실수로부터 보호해주는 버그 검출기 역할을 해주기 때문에 테스트에 상당히 의지해야 한다. 원하는 내용을 소스 코드와 테스트 코드 양쪽에 적어두면, 두 번 다 똑같이 실수하지 않는 한 버그 검출기에 반드시 걸린다. 이와 같은 중복 검사로 실수 가능성을 크게 줄일 수 있다. 테스트를 작성하는데 시간이 좀 걸리지만, 신경 써서 만들어두면 디버깅 시간이 줄어서 전체 작업 시간은 오히려 단축된다.

### statement() 함수 쪼개기 ###

statement()처럼 긴 함수를 리팩터링할 때는 먼저 전체 동작을 각각의 부분으로 나눌 수 있는 지점을 찾는다. 그러면 중간 즈음의 switch문이 가장 먼저 눈에 띌 것이다.   

이 switch 문을 살펴보면 한 번에 공연에 대한 요금을 계산하고 있다. 이러한 사실은 코드를 분석해서 얻은 정보다.   

이런 식으로 파악한 정보는 휘발성이 높기로 악명 높은 저장 장치인 내 머릿속에 기록되므로, 잊지 않으려면 빨리 코드에 반영해야 한다. 그러면 다음번에 코드를 볼 때, 다시 분석하지 않아도 코드 스스로가 자신이 하는 일이 무엇인지 이야기해줄 것이다.   

여기서는 코드 조각을 별도 함수로 추출하는 방식으로 앞서 파악한 정보를 코드에 반영할 것이다. 추출한 함수에는 그 코드가 하는 일을 설명하는 이름을 지어준다. amountFor(aPerformance)정도면 적당해 보인다. 이렇게 코드 조각을 함수로 추출할 때 실수를 최소화해주는 절차를 마련해뒀다. 이 절차를 따로 기록해두고, 나중에 참조하기 쉽도록 '함수 추출하기'란 이름으로 정리  

먼저 별도 함수로 빼냈을 때 유효범위를 벗어나는 변수, 즉 새 함수에서는 곧바로 사용할 수 없는 변수가 있는지 확인한다. 이번 예에서는 perf, play, thisAmount가 여기 속한다. perf와 play는 추출한 새 함수에서도 필요하지만 값을 변경하지 않기 때문에 매개변수로 전달하면 된다. 한편 thisAmout는 함수 안에서 값이 바뀌는데, 이런 변수는 조심해서 다뤄야 한다. 이번 예에서는 이런 변수가 하나뿐이므로 이 값을 반환하도록 작성했다. 또한 이 변수를 초기화하는 코드도 추출한 함수에 넣었다. 

>> commit 106349d097710e253561cc444249c5cce44a2f31  
>> extraction switch from statement function
--------------------------------

이제 sttement()에서는 thisAmount 값을 채울 때 방금 추출한 amountFor()함수를 호출한다.

>> commit d0480b82a37859ceca3e34e4cbd0a42e137b14ed  
>> insult extraction function

이렇게 수정하고 나면 컴파일하고 테스트해서 실수한 게 없는 확인한다.
아무리 간단한 수정이라도 리팩터링 후에는 항상 테스트하는 습관을 들이는 것이 바람직하다. 
한 가지를 수정할 때마다 테스트하면, 오류가 생기더라도 변경 폭이 작기 때문에 살펴볼 범위도 좁아서 문제를 찾고 해결하기가 훨씬 쉽다.
**이처럼 조금씩 변경하고 매번 테스트하는 것은 리팩터링 절차의 핵심이다.**
한 번에 너무 많이 수정하려다 실수를 저지르면 디버깅하기 어려워서 결과적으로 작업 시간이 늘어난다. 조금씩 수정하여 피드백 주기를 
짧게 가져가는 습관이 이러한 재앙을 피하는 길이다.

**리팩터링은 프로그램 수정을 작은 단계로 나눠 진행한다. 그래서 중간에 실수하더라도 버그를 쉽게 찾을 수 있다.**

----------------------------------------------------

함수를 추출하고 나면 추출된 함수 코드를 자세히 들여다보면서 지금보다 명확하게 표현할 수 있는 간단한 방법은 없는지 검토한다. 가장 먼저 변수의 이름을 더 명확하게 바꿔보자. 가령 thisAmount를 result로 변경할 수 있다.

>> commit 536c04d7e0279eb8b4484a91c8fe5dc009ed2289  
>> change function variable name ( thisAmount => result )

함수의 반환 값에는 항상 result라고 이름을 쓰면 그 역할을 쉽게 알 수 있다.

----------------------------------------------------

다음은 첫 번째 인수인 perf를 aPerformance로 리팩터링해보자.

>> mit 08322d031584bd042d58e54d3a934392baed511e  
>> chang variable name ( perf => aPerformance )

js와 같은 동적 타입언어를 사용할 때는 타입이 드러나게 작성하면 도움이 된다. 그래서 매개변수 이름에 접두어로 타입 이름을 적는데, 지금처럼 매개변수의 역할이 뚜렷하지 않을 때는 부정 관사(a/an)를 붙인다.

**컴퓨터가 이해하는 코드는 바보도 작성할 수 있다. 사람이 이해하도록 작성하는 프로그래머가 진정한 실력자다.**

좋은 코드라면 하는 일이 명확히 드러나야 하며, 이때 변수 이름은 커다란 역할을 한다. 그러니 명확성을 높이기 위한 이름 바꾸기에는 조금도 망설이지 말기 바란다.
그리고 정적 타입언어를 사용한다면, 여러분이 미처 발견하지 못한 부분까지 찾아줄 것이다. 

---------------------------------------------------

다음은 play매개변수의 이름을 바꿀 차례다. 그런데 이 변수는 좀 다르게 처리해야 한다.

amountFor()의 매개변수를 살펴보면서 이 값들이 어디서 오는지 알아보면, aPerformance는 루프 변수에서 오기 때문에 반복문을 한 번 돌 때마다 자연스레 값이 변경된다. 하지만 play는 개별 공연(aPerformance)에서 얻기 때문에 애초에 매개변수로 전달할 필요가 없다. 그냥 amoutFor()안에서 다시 계산하면 된다. 
긴 함수를 쪼갤 때마다 play 같은 변수를 최대한 제거한다. 이런 임시 변수들 때문에 로컬 범위에 존재하는 이름이 늘어나서 추출 작업이 복잡해지기 때문이다. 

먼저 대입문(=)의 우변을 함수로 추출한다.
>> commit 49d0711556f14bb504933cf8fe01066e1f313101
>> extract assignment statement (play)

그리고 추출된 함수를 변수 인라인하기를 적용한다.
>> commit 37d77197d534139b968eb75f8298007dec54305c
>> Inline Variable (play)

변수를 인라인한 덕분에 amountFor()에 함수 선언 바꾸기를 적용해서 play 매개변수를 제거할 수 있게 되었다. 
이 작업은 두 단계로 진행한다. 먼저 새로만든 playFor()를 사용하도록 amountFor()를 수정한다.
>> commit 0d9e38996f1ad18d187d75efc9b642a1d471fe9a  
>> remove play variable


----------------------------------------------

이전 코드는 루프를 한 번 돌 때마다 공연을 조회했ㄴㄴ데 반해 리팩터링한 코드에서는 세 번이나 조회한다. 뒤에서 리팩터리과 성능의 관계를 자세히 설명하겠지만, 일단 지금은 이렇게 변경해도 성능에 큰 영향은 없다. 

**설사 심각하게 느려지더라도 제대로 리팩터링된 코드베이스는 그렇지 않은 코드보다 성능을 개선하기가 훨신 수월하다.**

지역 변수를 제거해서 얻는 가장 큰 장점은 추출 작업이 훨씬 쉬워진다는 것이다. 유효범위를 신경 써야 할 대상이 줄어들기 때문이다.



amountFor()에 전달할 인수를 모두 처리했으니, 다시 이 함수를 호출하는 코드로 돌아가보면 여기서 amountFor()는 임시 변수인 thisAmount에 값을 설정하는데 사용되는데, 그 값이 다시 바뀌지는 않는다. 따라서 변수 인라인하기를 적용한다.

>> commit 71b48d34502591894c04f698214867737b154de9  
>> inline function amountFor

----------------------------------------------

앞에서 play 변수를 제거한 결과 로컬 유효범위의 변수가 하나 줄어서 적립 포인트 계산 부분을 추출하기가 훨씬 쉬워졌다.

처리해야 할 변수가 아직 두 개 더 남아 있다. 여기서도 perf는 간단히 전달만 하면 된다. 하지만 volumeCredits는 반복문을 돌 때마다 값을 누적해야 하기 때문에 살짝 더 까다롭다. 이 상황에서 최선의 방법은 추출한 함수에서 volumeCredits의 복제본을 초기화한 뒤 계산 결과를 반환토록 하는 것이다.

------------------------------------------------


임시 변수는 나중에 문제를 일으킬 수 있다. **임시 변수는 자신이 속한 루틴에서만 의미가 있어서 루틴이 길고 복잡해지기 쉽다.** 따라서 다음으로 할 리팩터링은 이런 변수들을 제거하는 것이다. 그중에서 format 이 가장 만만해 보인다. format은 임시 변수에(함수 포인터처럼) 함수를 대입한 형태인데, 나는 함수를 직접 선언해 사용하도록 바꾸는 편이다. 


>>commit 810b46a5b0c73a35573eac8e99ba36bcac59e745  
>>remove temp var


그런데 format이라는 이름은 이 함수가 하는 일을 충분히 설명해주지 못한다. 템플릿 문자열 안에서 사용될 이름이라서 "formatAsUSD"라고 하기에는 또 너무 장황하다. 이 함수의 핵심은 화폐 단위 맞추기다. 그래서 그런 느낌을 살리는 이름을 골라서 바꿔준다.

>>commit a8d2b9173cab0c7a38c8e718920edfb064a1084e  
>>name change format to usd


이름짓기는 중요하면서도 쉽지 않은 작업이다. 긴 함수를 작게 쪼개는 리팩터링은 이름을 잘 지어야만 효과가 있다. 이름이 좋으면 함수 본문을 읽지 않고도 무슨일을 하는지 알 수 있다. 


### volumeCredits 변수 제거하기 ###

다음으로 살펴볼 변수는 volumeCredits다. 이 변수는 반복문을 한 바퀴 돌 때마다 값을 누적하기 때문에 리팩터링하기가 더 까다롭다. 따라서 먼저 반복문 쪼개기로 volumeCredits값이 누적되는 부분을 따로 빼낸다. 

그리고 문장 슬라이드하기를 적용해서 volumeCredits변수를 선언하는 문장을 반복문 바로 앞으로 옮긴다.

>>commit 11d060c9b26ebd3232a189829f0d72af26601a1c   
>>volumCredits variable collect(correct)


volumeCredits값 갱신과 관련한 문장들을 한데 모아두변 임시변수를 질의 함수로 바꾸기가 수월해진다. 이번에도 역시 volumeCredits값 계산 코드를 함수로 추출하는 작업부터 한다. 함수추출이 끝나면, volumeCredits변수를 인라인 한다.

>>commit b83407c16d8c8e5acb9d6d65f0d14149f048eea2  
>>inline volumeCredits function


여기서 잠깐 성능에 관해서 생각해보자.

반복문을 쪼개서 성능이 느려지지는 않을까 걱정할 수 있다. 하지만 이 정도 중복은 성능에 미치는 영향이 미미할 때가 많다. 실제로 이번 경우는 리팩터링 전과 후의 실행 시간을 측정해보면 차이를 거의 느끼지 못할 것이다. 경험 많은 프로그래머조차 코드의 실제 성능을 정확히 예측하지 못한다. 똑똑한 컴파일러는 최신 캐싱 기법 등으로 무장하고 있어서 우리의 직관을 대부분 초월하는 결과를 내어주기 때문이다. 또한 소프트웨어 성능은 대체로 코드의 몇몇 작은 부분에 의해 결정되므로 그 외의 부분은 수정한다고 해도 성능 차이를 체감할 수 없다. 


하지만 '대체로 그렇다' 와 '항상 그렇다'는 엄연히 다르다. 때로는 리팩터링이 성능에 상당한 영향을 주기도 한다. 그런 경우라도 개의치 않고 리팩터링 한다. 잘 다듬어진 코드라야 성능 개선 작업도 훨씬 수월하기 때문이다. 리팩터링 과정에서 성능이 크게 떨어졌다면 리팩터링 후 시간을 내어 성능을 개선한다. 이 과정에서 리팩터링된 코드를 예전으로 되돌리는 경우도 있지만, 대체로 리팩터링 덕분에 성능 개선을 더 효과적으로 수행할 수 있다. 결과적으로 더 깔끔하면서 더 빠른 코드를 얻게 된다. 


따라서 리팩터링으로 인한 성능 문제에 대해서는 '특별한 경우가 아니라면 일단 무시하라'는 것이다. 리팩터링 때문에 성능이 떨어진다면, 하던 리팩터링을 마무리하고 나서 성능을 개선하자.

---------------------------------------------------

다음으로 totalAmout도 앞에서와 똑같은 절차로 제거한다. 먼저 반복문을 쪼개고, 변수 초기화 문장을 옮긴 다음, 함수를 추출한다. 물론 각 단계 끝에서는 항상 컴파일-테스트-커밋한다. 여기서 한 가지 문제가 있다. 추출할 함수의 이름으로는 "totalAmout"가 가장 좋지만, 이미 같은 이름의 변수가 있어서 쓸 수 없다. 그래서 일단 아무 이름인 "appleSauce"를 붙여준다(컴파일-테스트-커밋)

>>commit 07bc801a62a4fe3c2f73019c1198041bdfa38211   
>>change totalAmount


이제 함수 이름을 좀더 의미있게 고쳐준다.

>>commit afc5f304b7ac44949e8423742b7f995e0dd50047   
>>change variable name 


**중간 점검**


여기서 잠시 지금까지 리팩터링한 결과를 살펴보자.

>>commit a0da13d3b793eeacd1d676c57822ef57516fe9b7   
>>remove useless comment  

코드 구조가 한결 나아졌다.
최상위의 statement()함수는 이제 단 일곱 줄 뿐이며, 출력할 문장을 생성하는 일만 한다. 계산 로직은 모두 여러 개의 보조 함수로 빼낸다. 결과적으로 각 계산 과정은 물론 전체 흐름을 이해하기가 훨씬 쉬워졌다.

**계산 단계와 포맷팅 단계 분리하기**

지금까지는 프로그램의 논리적인 요소를 파악하기 쉽도록 코드의 구조를 보강하는데 주안점을 두고 리팩터링했다. 리팩터링 초기 단계에서 흔히 수행하는 일이다. 복잡하게 얽힌 덩어리를 잘게 쪼개는 작업은 이름을 잘 짓는 일만큼 중요하다. 

이제 원하던 기능 변경, 즉 statement()의 HTML버전을 만드는 작업을 살펴보자. 여러 각도에서 볼 때 확실히 처음 코드보다 작업하기 편해졌다. 계산 코드가 모두 분리됐기 때문에 일곱 줄짜리 최상단 코드에 대응하는 HTML버전만 작성하면 된다.

그런데 문제가 하나 있다. 분리된 계산 함수들이 텍스트 버전인 statement()안에 중첩함수로 들어가 있는게 아닌가. 이 모두를 그대로 복사해 붙이는 방식으로 HTML버전을 만들고 싶진 않다. 텍스트 버전과 HTML버전 함수 모두가 똑같은 계산 함수들을 사용하게 만들고 싶다. 

다양한 해결책 중 여기서 가장 선호하는 방식은 단계 쪼개기다. 목표는 statement()의 로직을 두 단계로 나누는 것이다. 첫 단계에서는 statement()에 필요한 데이터를 처리하고, 다음 단계에서는 앞서 처리한 결과를 텍스트나 HTML로 표현하도록 하자. 다시 말해 첫 번째 단계에서는 두 번째 단계로 전달할 중간 데이터 구조를 생성하는 것이다. 

단계를 쪼개려면 먼저 두 번째 단계가 될 코드들을 함수 추출하기로 뽑아내야 한다. 이 예에서 두 번째 단계는 청구 내역을 출력하는 코드인데, 현재는 statement()의 본문 전체가 여기 해당한다. 

>>commit 57aad535e5e28723207e8cb26702179792bc837e  
>>extraction statement 

아무리 간단해 보여도 커밋하기 전에 테스트 하는것을 잊지 말자. 
다음으로 두 단계 사이의 중간 데이터 구조 역할을 할 객체를 만들어서 renderPlainText()에 인수로 전달한다.

그리고 renderPlainText()의 다른 두 인수인 invoice, plays를 방금 만든 중간 데이터 구조로 옮기면, 계산 관련 코드는 전부 statement()함수로 모으고 renderPlainText()는 data매개변수로 전달된 데이터만 처리하게 만들 수 있다. 

가장 먼저 고객 정보부터 중간 데이터 구조로 옮긴다.

>>commit 17e29e92f2f654c21d6c36ef286c02566d693197    
>>make object 


같은 방식으로 공연 정보도 중간 데이터 구조로 옮기면 renderPlainText()의 invoice매개변수를 삭제해도 된다. 

>>commit ebba2f134eb2c2f87b115c9d6735477f5d30e2b3   
>>insult invoice to object


이제 연극 제목도 중간 데이터 구조에서 가져오도록 한다. 이를 위해 공연 정보 레코드에 연극 데이터를 추가해야 한다.

>>commit 302dfcde8d8044ad36f9e4442827e8f5f44e4863   
>>add performance data  


여기서는 공연 객체를 복사하기만 했지만, 잠시 후 이렇게 새로만든 레코드에 데이터를 채울 것이다. 이때 복사를 한 이유는 함수로 건넨 데이터를 수정하기 싫어서다. 가변 데이터는 금방 상하기 때문에 데이터를 최대한 불변처럼 취급한다. 



