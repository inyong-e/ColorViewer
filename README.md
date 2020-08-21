# ColorViewer

**'세상의 불편함을 크롬 익스텐션 개발로 풀어보자'** 프로젝트의 첫 번째 시리즈 작품입니다.

현재 **페이지에서 사용되는 색상 데이터를 분석 및 시각화**하여 사용자에게 제공해주는 도구입니다. 웹 페이지에서 사용되는 색상들이 어떤 색 조합을 이루고 있는지, 각 색상이 얼마나 사용되고 있는지에 대한 정보를 알 수 있습니다.

<br/>

특히 웹 디자이너가 여러 서비스의 디자인 및 스타일을 분석할 때, 이 도구가 색상 분석에 대해 큰 도움 줄 것입니다.

<br/>

다른 기능:

- 분석된 각 색상에 대해, 웹 페이지 내 사용되고 있는 위치를 표시합니다.

![image](https://user-images.githubusercontent.com/13481627/89705551-63742080-d999-11ea-91a9-24ed6e502194.png)

## Installation

1. 해당 프로젝트를 다운로드 후, 'chrome://extensions'에 접속합니다.
2. 우측 상단의 '개발자 모드'를 활성화 후,'압축 해제된 확장 프로그램을 로드합니다.' 기능을 통해 로드 하십시오.

![image](https://user-images.githubusercontent.com/13481627/89787964-60c02980-db59-11ea-93a0-69fefededf83.png)

## Usage

**색상 분석**

특정 웹 페이지에 접속 후, 브라우저 우측 상단의 'ColorViewer' 도구를 클릭하십시오. 그러면 도구는 현재 활성화 되어있는 웹 페이지에 전체를 기준으로 색상 분석을 시작합니다. 분석이 완료되면 결과를 차트로 보여줄 것입니다.

---

**색상 선택**

![image](https://user-images.githubusercontent.com/13481627/89726606-23737300-da57-11ea-8e9c-3abf120c1c24.png)

분석 후 차트가 표시될 때, 주요하지 않은 것이라 판단되는 색상은 표시되지 않고 비활성 상태로 나타나게 됩니다.

그러나 비활성화된 색상을 클릭함으로써 언제든지 활성화 및 차트에 표시할 수 있습니다.

**주요 색상 판단 원리**

- 기본적으로 전체 웹 페이지에서 차지하는 비율이 많은 순으로 총 20개까지 보여줍니다.
  - 이는 일시적으로 사용한 색상으로 인해 메인으로 사용된 색상의 인식이 저하되는 요소를 최소화 시키기 위함입니다.
- 전체 웹 페이지에서 차지하는 비율이 60% 이상일 경우, 배경 색이라 판단하여 표시하지 않습니다.
- 전체 웹 페이지에서 차지하는 비율이 1% 이하일 경우, 상위 비율의 색상들의 비해 사용 용도가 낮다고 판단하여 표시하지 않습니다.
- 그레이 스케일 색상(R=G=B)은 최대한 보여주지 않도록 하고 있습니다.
  - 그레이 스케일 색상의 경우, 웹 페이지 내 너무나 많은 픽셀 데이터를 담고 있음으로, 의미가 없는 색상 데이터가 많이 수집이 되기 때문입니다. 그러나 이 부분은 아직 문제 처리 진행 중으로 언제든 변경될 수 있습니다.

주요 색상 판단 원리에 대해 더 자세한 사항은 아래, 'Wiki' 항목의 링크를 통해 확인하실 수 있습니다.

---

**사용되는 요소 표시**

![image](https://user-images.githubusercontent.com/13481627/89726473-ec509200-da55-11ea-8702-62dcf9937fae.png)

차트의 point 색상 중 하나를 클릭하십시오. 그러면 웹 페이지 내 해당 색상이 사용되고 있는 요소가 무엇인지 알려줄 것입니다.

그러나 해당 부분은 아직 완벽히 동작하지 않는 경우가 있어 수정 중에 있습니다.

## Using Library

- https://github.com/niklasvh/html2canvas
- https://github.com/highcharts/highcharts

## Process Note

Notion

- https://www.notion.so/helloinyong/ColorViewer-0838ad47cbe44c93904c7dc06137b4f0

## Wiki

- https://github.com/inyong-e/ColorViewer/wiki/ColorViewer-%EB%8F%99%EC%9E%91-%EC%9B%90%EB%A6%AC-%EB%B0%8F-%EB%82%B4%EB%B6%80-Core-%EC%86%8C%EA%B0%9C

## Author

Inyong Jung

- https://github.com/inyong-e
- https://helloinyong.tistory.com

## License

해당 프로젝트는 Free Software Open Source이며, MIT License를 적용하고 있습니다.

다만, 해당 프로젝트 내에 사용되고 있는 라이브러리 중 **HighChart.js의 경우, 개인, 학교, 비영리 조직에 한하여 무료 사용 권한을 부여하고 있습니다.**

따라서 개인, 학교, 비영리 조직 외 사용으로 인하여 발생한 문제에 대해서는 **프로젝트의 제작자가 그 어떠한 책임도 지지 않습니다.**
