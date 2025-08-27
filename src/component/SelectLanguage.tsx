import { Check } from 'lucide-react';
import { ActionSheet } from 'react-vant';
import { useState } from 'react';
import './SelectLanguage.scss';
import useLanguageStore, { language } from '@/store/global.ts';
import Iconfont from '@/component/Iconfont.tsx';

interface LanguageOption {
  code: language;
  name: string;
  flag: string;
}
const languageOptions: LanguageOption[] = [
  { code: language.tw, name: '繁體中文', flag: '🇨🇳' },
  { code: language.en, name: 'English', flag: '🇺🇸' },
  { code: language.ko, name: '한국어', flag: '🇰🇷' },
  { code: language.ja, name: '日本語', flag: '🇯🇵' },
];

const SelectLanguage = () =>{
  const [visible, setVisible] = useState(false)
  const store = useLanguageStore()
  return (
    <>
      <Iconfont onClick={()=>setVisible(true)} icon={'icon-language'}></Iconfont>
      <ActionSheet visible={visible} onCancel={()=>{setVisible(false)}}>
        <div className="languages-container">
          <div className="title">选择语言 / Select Language</div>
          <div className="languages">
            {languageOptions.map((option) => (
              <div className={['languages-item', option.code === store.language ? 'active' : ''].join(' ')} key={option.code} onClick={()=>{
                store.setLanguage(option.code)
                setVisible(false)
              }}>
                <div className="left">
                  <div className="flag">{option.flag}</div>
                  <div className="name">{option.name}</div>
                </div>
                {
                  option.code === store.language && <div className="right">
                    <Check size={20} color="#8910c9" />
                  </div>
                }
              </div>
            ))}
          </div>
        </div>
      </ActionSheet>
    </>
  )
}

export default SelectLanguage