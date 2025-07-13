import './App.scss';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { ConfigProvider } from 'react-vant';
import '@rainbow-me/rainbowkit/styles.css';
import { IntlProvider } from 'react-intl';
import useLanguageStore from '@/store/global.ts';
import { translations } from '@/lang/lang.ts';
import { useEffect } from 'react';
import { getUserInfo } from '@/service/user.ts';
import useUserStore from '@/store/user.ts';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/wagmi.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { TOKEN } from '@/utils/const.ts';


function App() {
  const languageStore = useLanguageStore()
  const userStore = useUserStore()
  const queryClient = new QueryClient();
  const token = localStorage.getItem(TOKEN)
  // 获取用户信息
  useEffect(()=>{
    const fetchData =async () =>{
      try{
        const res = await getUserInfo()
          userStore.setUser(res)
      }catch  {
        localStorage.removeItem(TOKEN)
      }
    }
    fetchData()
  },[token])
  return (
    <>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <IntlProvider locale={languageStore.language} messages={translations[languageStore.language]}>
              <ConfigProvider>
                <RouterProvider router={router}></RouterProvider>
              </ConfigProvider>
            </IntlProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
