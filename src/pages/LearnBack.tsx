import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Learn.scss';
import { useEffect, useMemo, useState } from 'react';
import { stakeLearnBack, StakeLearnInterface } from '@/service/staking.ts';
import useLanguageStore from '@/store/global.ts';

const Learn = ()=>{
  const intl = useIntl();
  const [data,setData] = useState<StakeLearnInterface|null>(null)
  const languageStore = useLanguageStore()



  const fetchData = async ()=>{
    const res = await stakeLearnBack()
    console.log(res);
    setData(res)
  }

  useEffect(() => {
    fetchData();
  }, []);

  const content = useMemo(() => {
    if(data && languageStore.language){
      return data[`content_${languageStore.language}`] || data.content
    }
    return ''
  }, [data,languageStore.language]);

  return <Layouts title={intl.formatMessage({ id: 'staking.footer.learn.back' })}>
    <div className={"learn-container"}>
      {content}
    </div>
  </Layouts>
}
export default Learn