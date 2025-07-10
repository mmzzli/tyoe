import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.scss'
import App from './App.tsx'


const setRem = () => {
  const baseSize = 16; // 基础字体大小
  const htmlFontSize = window.innerWidth / 750 * baseSize; // 假设设计稿宽度为 375px
  document.documentElement.style.fontSize = `${htmlFontSize}px`;
};

// 初始化
setRem();

// 监听窗口大小变化
window.addEventListener('resize', setRem);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
