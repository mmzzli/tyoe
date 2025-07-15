import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import { copyText, formatAddress, formatNumber } from '@/utils/common.ts';
import './Node.scss';
import { useEffect, useState } from 'react';
import { getNodeInfo, getNodeRecordsList, NodeInfoInterface, NodeRecordInterface } from '@/service/node.ts';
import dayjs from 'dayjs';
import Iconfont from '@/component/Iconfont.tsx';
import useLanguageStore from '@/store/global.ts';
import { List, PullRefresh } from 'react-vant';
import {BigNumber} from 'bignumber.js'

const Node = ()=>{
  const intl = useIntl();
  const [data,setData] = useState<NodeInfoInterface>()
  const {language} = useLanguageStore()

  useEffect(()=>{
    const fetchData = async ()=>{
      const res = await getNodeInfo()
      console.log(res);
      setData(res)
    }
    fetchData()
  },[])

  const [list,setList] = useState<NodeRecordInterface[]>([])
  const [finished, setFinished] = useState<boolean>(false)
  const [,setTotal] = useState(0)
  const [page,setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  // 请求数据
  const fetchRecords = async (pageNum:number, isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const params:any = { page: pageNum }
      const res = await getNodeRecordsList(params)
      setTotal(res.total)
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


  return <Layouts title={intl.formatMessage({id:'nav.node'})}>
    <div className="node-container bg-gray-container">
      <div className="card  node-info bd">
        <div className="top">
          <Iconfont icon={'icon-jiedian'}/>
          <div className={"node-info-title"}>
            {intl.formatMessage({ id: 'node.genesis' })}
            {/*   intl.formatMessage({id:'node.normal'})*/}
          </div>
        </div>
        <div className="info-content">
          <div className="h4">{intl.formatMessage({ id: 'node.total.dividends' })}</div>
          <div className="value">${formatNumber(data?.nodeInfo?.totalmoney||0)}</div>
        </div>
        <div className="middle">
          <div className="left">
            <Iconfont icon={'icon-shijiankaishishijian'}/>
            {intl.formatMessage({ id: 'node.expiry' })}
          </div>
          <div className="right">{dayjs(data?.nodeInfo?.endtimestr).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
        <div className="node-info-details">
          <div className="text">{intl.formatMessage({ id: 'node.contract' })}</div>
          <div className="node-info-details-value">
            <div className="left">{formatAddress(data?.nodeInfo?.payTokenAddress||'')}</div>
            <Iconfont icon={'icon-fuzhi'} onClick={()=>{
              copyText(data?.nodeInfo?.payTokenAddress||'')
            }}/>
          </div>
        </div>
      </div>

      <div className="card node-fee">
        <div className="card-title">
          <div className="text">{intl.formatMessage({ id: 'node.fees' })}</div>
        </div>
        <div className="table">
          <div className="table-row-th">
            <div className="th">{intl.formatMessage({ id: 'node.type' })}</div>
            <div className="th">{intl.formatMessage({ id: 'node.price' })}</div>
            <div className="th">{intl.formatMessage({ id: 'node.duration' })}</div>
            <div className="th">{intl.formatMessage({ id: 'node.purchase.limit' })}</div>
          </div>
          {
            data?.nodeList?.map((item,index)=>{
              const title = item[`title_${language}`] || item.title
              return <div className="table-row-td" key={index}>
                <div className="td">{title}</div>
                <div className="td">${item.price}</div>
                <div className="td">{item.day}{intl.formatMessage({ id: 'staking.days.unit' })}</div>
                <div className="td">${item.totalGet}</div>
              </div>
            })
          }
        </div>
      </div>


      <div className="card node-records">
        <div className="card-title">
          <div className="text">{intl.formatMessage({ id: 'node.dividend.records' })}</div>
        </div>
        <div className="record-list">
          <PullRefresh onRefresh={onRefresh}>
            <List finished={finished} onLoad={onLoad} className="record-list">
              {
                list.map((item)=> {

                  return <div className="record-list-item" key={item.id}>
                    <div className="left">
                      <div className="coin">
                        <i className="iconfont icon-jijinzhiya"></i>
                      </div>
                      <div className="box">
                        <div className="up">Da Lat</div>
                        <div className="time">{dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</div>
                      </div>
                    </div>
                    <div className="right">
                      <div className={`up ${Number(item.statusint) === Number(0) ?'price-rise':'price-down'}`}>{Number(item.statusint) === Number(0) ? '+' :'-'}{BigNumber(item.amount).toFormat()}</div>
                      <div className="down">{intl.formatMessage({id:'withdraw.balance'})}：{BigNumber(item.oldamount).toFormat()}</div>
                    </div>
                  </div>
                })
              }

            </List>
          </PullRefresh>
        </div>
      </div>

    </div>
  </Layouts>
}
export default Node