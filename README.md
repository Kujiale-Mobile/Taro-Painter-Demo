# Taro-Painter-Demo

如何在 taro 框架中使用 Painter 的 Demo

painter 已发布基于 taro2.x 的 npm 包，因此不再需要使用 submodule 引入原生组件的方式

如何引入包：

```powershell
npm i mina-painter
```

或

```powershell
yarn add mina-painter
```

如何使用组件：

```jsx
import Painter from 'mina-painter'

...

<Painter
  customStyle='margin-left:40rpx'
  palette={template}
  onImgOK={onImgOK} />
```
