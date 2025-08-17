import { useIntl } from 'react-intl';
import Iconfont from '@/component/Iconfont.tsx';
import * as React from 'react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
export interface PhaseItemProps {
  phase: number,
  duration: number,
  priceUSD: number,
  totalSlots: number,
  availableSlots: number,
  countdown: string,
}

const WhitePhaseItem:React.FC<PhaseItemProps>  = ({ countdown,priceUSD,totalSlots,availableSlots }) => {
  const intl = useIntl()
  const [diff,setDiff] = useState({
    day:0,
    hour:0,
    minute:0,
    second:0
  })

  const [timer ,setTimer ] = useState<any>(null)

  const diffFn = ()=>{
    const now = dayjs();
    const target = dayjs(countdown);

    // 总秒数
    let diffSec = target.diff(now, 'second');

    if (diffSec <= 0) {
      clearInterval(timer);
      setDiff({ day: 0, hour: 0, minute: 0, second: 0 });
      return;
    }

    const day = Math.floor(diffSec / (24 * 60 * 60));
    diffSec %= 24 * 60 * 60;

    const hour = Math.floor(diffSec / (60 * 60));
    diffSec %= 60 * 60;

    const minute = Math.floor(diffSec / 60);
    const second = diffSec % 60;

    setDiff({ day, hour, minute, second });
  }

  useEffect(() => {
    diffFn()
    setTimer(setInterval(()=>diffFn,1000))
    return ()=>{
      clearInterval(timer)
    }
  }, [countdown]);

  const progressPercent = (totalSlots-availableSlots)/totalSlots * 100

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
        ${priceUSD}
      </div>
    </div>

    <div className="tabs-container-item">
      <div className="left">
        {intl.formatMessage({ id: "whitelist.remaining.slots" })}
      </div>
      <div className="right">
        ${totalSlots - availableSlots}
      </div>
    </div>

    <div className="progress-container">
      <div className="tabs-container-item">
        <div className="left">
          {intl.formatMessage({ id: "whitelist.subscription.progress" })}
        </div>
      </div>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${30}%` }}></div>
      </div>
      <div className="number">
        {progressPercent.toFixed(1)}%
      </div>
    </div>

    <div className="phase-records">
      <div className="phase-records-title">{intl.formatMessage({ id: 'whitelist.participation.records' })}</div>
      <div className="lists">
        <div className="list-item">
          <div className="address">
            0x131...13141
          </div>
          <div className="time">
            2025-08-01 00:00:00
          </div>
        </div>
        <div className="list-item">
          <div className="address">
            0x131...13141
          </div>
          <div className="time">
            2025-08-01 00:00:00
          </div>
        </div>
        <div className="list-item">
          <div className="address">
            0x131...13141
          </div>
          <div className="time">
            2025-08-01 00:00:00
          </div>
        </div>
        <div className="list-item">
          <div className="address">
            0x131...13141
          </div>
          <div className="time">
            2025-08-01 00:00:00
          </div>
        </div>
        <div className="list-item">
          <div className="address">
            0x131...13141
          </div>
          <div className="time">
            2025-08-01 00:00:00
          </div>
        </div>
        <div className="list-item">
          <div className="address">
            0x131...13141
          </div>
          <div className="time">
            2025-08-01 00:00:00
          </div>
        </div>
        <div className="list-item">
          <div className="address">
            0x131...13141
          </div>
          <div className="time">
            2025-08-01 00:00:00
          </div>
        </div>
        <div className="list-item">
          <div className="address">
            0x131...13141
          </div>
          <div className="time">
            2025-08-01 00:00:00
          </div>
        </div>
        <div className="list-item">
          <div className="address">
            0x131...13141
          </div>
          <div className="time">
            2025-08-01 00:00:00
          </div>
        </div>
        <div className="list-item">
          <div className="address">
            0x131...13141
          </div>
          <div className="time">
            2025-08-01 00:00:00
          </div>
        </div>


      </div>
    </div>

    <div className="controls">
      <button>{intl.formatMessage({ id: "whitelist.subscribe" })}</button>
      <button>{intl.formatMessage({ id: "whitelist.claim" })}</button>
    </div>
  </>
}
export default WhitePhaseItem