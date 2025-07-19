import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Lp.scss';
import { useEffect, useState } from 'react';
import { List, PullRefresh } from 'react-vant';
import { getLpList, LpListItemInterface } from '@/service/home.ts';
import dayjs from 'dayjs';
import { BigNumber } from 'bignumber.js';
import Iconfont from '@/component/Iconfont.tsx';

const LP = ()=>{
  const intl = useIntl();
  // const navigator = useNavigate()
  const tabs = [
    {
      value:-1,
      label:intl.formatMessage({id:'common.all'}),
    },
    {
      value:1,
      label:intl.formatMessage({id:'lp.type.add'})
    },
    {
      value:2,
      label:intl.formatMessage({id:'lp.type.transfer'})
    },
    {
      value:3,
      label:intl.formatMessage({id:'lp.type.remove'})
    }
  ]
  const iconMap:any = {
    '1':{
      color:'#4ade80',
      icon:<Iconfont icon={'icon-tianjia'} />,
      label:intl.formatMessage({id:'lp.type.add'})

    },
    '2':{
      color:"#FF2020",
      icon:<Iconfont icon={'icon-zhuanyi'} />,
      label:intl.formatMessage({id:'lp.type.remove'})

    },
    '3':{
      color:"#266DFF",
      icon:<Iconfont icon={'icon-yichu'} />,
      label:intl.formatMessage({id:'lp.type.transfer'})

    }
  }


  const [myLp,setMyLp] = useState(0)
  const [type,setType] = useState(tabs[0].value)

  const [list,setList] = useState<LpListItemInterface[]>([])
  const [finished, setFinished] = useState<boolean>(false)
  const [,setTotal] = useState(0)
  const [page,setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  // 请求数据
  const fetchRecords = async (pageNum:number, isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const params:any = { page: pageNum,type }
      const res = await getLpList(params)
      setTotal(res.total)
      setMyLp(res.mynumber)
      const newList = isRefresh ? res.list : [...list, ...res.list]
      setList(newList)
      setFinished(newList.length >= res.total)
      setPage(pageNum + 1)
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  // 下拉刷新
  const onRefresh = async () => {
    if (loading) return;
    setFinished(false)
    setPage(1)
    setList([])
    await fetchRecords(1, true)
  }

  // 分页加载
  const onLoad = async () => {
    if (loading || finished) return;
    await fetchRecords(page)
  }

  // 切换tab时刷新
  useEffect(() => {
    onRefresh()
  }, [type]);

  return <Layouts title={intl.formatMessage({ id: 'nav.lp' })}>

    <div className="lp-info card bd">
      <Iconfont icon={'icon-rise'}/>
      <div className="title">{intl.formatMessage({id:'lp.total'})}</div>
      <div className="value">{BigNumber(myLp).toFormat()} LP</div>
    </div>

    <div className="card lp-detail">
      <div className="top">
        <div className="title">
          {intl.formatMessage({ id: 'lp.records' })}
        </div>
      </div>

      <div className="tabs">
        {
          tabs.map((item, index) => {
            return <div className={`tab-item ${item.value === type ? 'active' : ''}`} key={index}
                        onClick={() => setType(item.value)}>
              {item.label}
            </div>;
          })
        }
      </div>
      <div className="record-list">
        <PullRefresh onRefresh={onRefresh}>
          <List finished={finished} onLoad={onLoad} className="record-list">
        {
          list.map((item, ) => {
            return <div className="record-list-item" key={item.id}>
              <div className="left">
                <div className="coin">
                  {iconMap[item.type].icon}
                </div>
                <div className="box">
                  <div className="up">{iconMap[item.type].label}</div>
                  <div className="time">{dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</div>
                </div>
              </div>
              <div className="right">
                <div style={{color: iconMap[item.type].color}} >{BigNumber(item.amount).toFormat()} LP</div>
              </div>
            </div>;
          })
        }
          </List>
        </PullRefresh>

      </div>
    </div>
  </Layouts>
}
export default LP