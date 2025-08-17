# 样式文件使用说明

## 预处理配置

项目已在 `vite.config.ts` 中配置了 SCSS 预处理，以下文件会自动注入到所有 SCSS 文件中：

- `@/style/color.scss` - 颜色变量
- `@/style/reset.scss` - 样式重置
- `@/style/mixin.scss` - 混入函数

## 使用方法

### 1. 在任何 SCSS 文件中直接使用颜色变量

```scss
.my-component {
  background-color: $primary;
  color: $text-primary;
  border: 1px solid $border;
}
```

### 2. 使用 mixin

```scss
.my-button {
  @include inner-text-shadow;
  background-color: $button-primary;
}
```

### 3. 在组件中使用

```tsx
// MyComponent.tsx
import './MyComponent.scss';

const MyComponent = () => {
  return (
    <div className="my-component">
      <button className="my-button">Click me</button>
    </div>
  );
};
```

```scss
// MyComponent.scss
.my-component {
  padding: 20px;
  background-color: $background;
  
  .my-button {
    @include inner-text-shadow;
    background-color: $button-primary;
    color: $text-white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    
    &:hover {
      background-color: $primary-dark;
    }
  }
}
```

## 可用的颜色变量

- `$primary`, `$primary-dark`, `$primary-light` - 主色调
- `$background`, `$background-secondary`, `$background-tertiary` - 背景色
- `$text-primary`, `$text-secondary`, `$text-muted`, `$text-white` - 文字颜色
- `$success`, `$warning`, `$error`, `$info` - 状态颜色
- `$button-primary`, `$button-secondary`, `$button-disabled` - 按钮颜色
- `$border`, `$divider` - 边框和分割线颜色

## 可用的 Mixin

- `@include inner-text-shadow` - 内阴影文字效果 