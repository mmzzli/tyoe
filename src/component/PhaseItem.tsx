import { useIntl } from 'react-intl';
import Iconfont from '@/component/Iconfont.tsx';
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';

 export interface PhaseItemProps {
  phase: number,
  duration: number,
  usdtPrice: number,
  maxSlots: number,
  currentSlots: number,
  nowTime:number,
  lastTime:number,
   active: boolean
}

const WhitePhaseItem:React.FC<PhaseItemProps>  = ({ usdtPrice,maxSlots,currentSlots,nowTime,lastTime }) => {
  const intl = useIntl()

  const [diff,setDiff] = useState({
    day:0,
    hour:0,
    minute:0,
    second:0
  })


  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const diffFn = () => {
      const now = Math.floor(Date.now() / 1000); // 当前秒级时间戳
      let diffSec = lastTime - now;
  
      if (diffSec <= 0) {
        setDiff({ day: 0, hour: 0, minute: 0, second: 0 });
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = undefined;
        }
        return;
      }
  
      const day = Math.floor(diffSec / (24 * 60 * 60));
      diffSec %= 24 * 60 * 60;
  
      const hour = Math.floor(diffSec / (60 * 60));
      diffSec %= 60 * 60;
  
      const minute = Math.floor(diffSec / 60);
      const second = diffSec % 60;
  
      setDiff({ day, hour, minute, second });
    };
  
    diffFn(); // 立即执行一次
    timerRef.current = setInterval(diffFn, 1000);
  
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [lastTime]); // 只依赖 lastTime


  const progressPercent = (currentSlots)/maxSlots * 100

  return <>
    <div className="tabs-container-item">
      <div className="left">
        <Iconfont icon={'icon-daojishi'}></Iconfont>
        {intl.formatMessage({ id: "whitelist.countdown" })}
      </div>
      <div className="right">
        {intl.formatMessage({ id: 'whitelist.cutdown.time', }, {
          day: diff.day,
          time: `${diff.hour.toString().padStart(2, '0')}:${diff.minute.toString().padStart(2, '0')}:${diff.second.toString().padStart(2, '0')}`
        })}
      </div>
    </div>

    <div className="tabs-container-item">
      <div className="left">
        <Iconfont icon={'icon-meijin'}></Iconfont>
        {intl.formatMessage({ id: "whitelist.current.price" })}
      </div>
      <div className="right">
        ${usdtPrice}
      </div>
    </div>

    <div className="tabs-container-item">
      <div className="left">
        {intl.formatMessage({ id: "whitelist.remaining.slots" })}
      </div>
      <div className="right">
        {maxSlots - currentSlots}
      </div>
    </div>

    <div className="progress-container">
      <div className="tabs-container-item">
        <div className="left">
          {intl.formatMessage({ id: "whitelist.subscription.progress" })}
        </div>
      </div>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
      </div>
      <div className="number">
        {progressPercent.toFixed(1)}%
      </div>
    </div>



  </>
}
export default WhitePhaseItem