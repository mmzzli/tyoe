import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import { formatAddress, formatNumber } from '@/utils/common.ts';
import { Search, XCircle } from 'lucide-react';
import './Team.scss';
import { useEffect, useState } from 'react';
import { getMyTeams } from '@/service/team.ts';
import Iconfont from '@/component/Iconfont.tsx';
import dayjs from 'dayjs';

const Assets = ()=>{
  const intl = useIntl();
  const [search,setSearch] = useState('')
  const [team,setTeam] = useState<any>({})

  const [filterList,setFilterList] = useState([])

  useEffect(() => {
    if(!search.trim())return setFilterList(team.firstList||[])
    setFilterList(team.firstList.filter((item:any)=>{
      return item?.id?.toString().includes(search) || item?.account?.includes(search)
    }))
  }, [team.firstList,search]);

  useEffect(()=>{
    const fetchData = async ()=>{
      const res = await getMyTeams()
      console.log(res);
      setTeam(res)
    }
    fetchData()
  },[])
  return <Layouts title={intl.formatMessage({id:'nav.team'})}>
    <div className="team-container">
      <div className="card team-info">
        <div className="top">
          <div className="left">
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" alt="" />
          </div>
          <div className="right">
            <div className="address">{
              formatAddress(team?.userInfo?.account||'')
            }</div>
            <div className="uid">UID {team?.userInfo?.id}</div>
            <div className="status">
              {team?.userInfo?.grade ? (
                <Iconfont icon={'icon-zhaungtai1'}/>
              ) : (
                <XCircle size={20} color="#f87171" />
              )}
              <span style={
                { color: team?.userInfo?.grade ? '#3ED474' : '#f87171' }
              }>
                {team?.userInfo?.grade ? intl.formatMessage({id:'team.effective'}) :intl.formatMessage({id:'team.ineffective'})}
              </span>
            </div>
          </div>
        </div>
        <div className="middle">
          <div className="item" style={{ backgroundColor: '#FFEFE7' }}>
            <Iconfont icon={'icon-tuanduiyeji'}/>

            <div className="label">
              {intl.formatMessage({ id: 'team.performance' })}
            </div>
            <div className="value">
              {formatNumber(team.userInfo?.totalmoney||0)} LP
            </div>
          </div>

          <div className="item" style={{ backgroundColor: '#E7F8FB' }}>
            <Iconfont icon={'icon-tuanduiyeji'}/>

            <div className="label">
              {intl.formatMessage({ id: 'team.district.performance' })}
            </div>
            <div className="value">
              {formatNumber(team.userInfo?.minmoney||0)} LP
            </div>
          </div>

          <div className="item" style={{ backgroundColor: '#E9F0FF' }}>
            <Iconfont icon={'icon-zhituiyouxiao'}/>

            <div className="label">
              {intl.formatMessage({ id: 'team.direct.users' })}
            </div>
            <div className="value">
              {formatNumber(team.userInfo?.dayFirst||0)}
            </div>
          </div>

          <div className="item" style={{ backgroundColor: '#FDFCFF' }}>
            <Iconfont icon={'icon-tuanduiyonghu'}/>


            <div className="label">
              {intl.formatMessage({ id: 'team.team.users' })}
            </div>
            <div className="value">
              {formatNumber(team.userInfo?.dayTeam||0)}
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="item">
            <div className="left">
              <Iconfont icon={'icon-fenhongbi'}/>

              <div className="label">{intl.formatMessage({ id: 'team.dividend.pool' })}</div>
            </div>
            <div className="value">
              2号分红池
            </div>
          </div>

          <div className="item">
            <div className="left">
              <Iconfont icon={'icon-fenhongbi'}/>
              <div className="label">{intl.formatMessage({ id: 'team.dividend.ratio' })}</div>
            </div>
            <div className="value">
              {team?.userInfo?.gradeintfee}%
            </div>
          </div>
        </div>
      </div>


      <div className="card team-invite">
        <div className="title">
          {intl.formatMessage({ id: 'team.direct.list' })} ({team?.firstLen})
        </div>

        <div className="search-box">
          <input type="text" onInput={(e:any)=>{setSearch(e.target.value)}} />
          <Search size={20} color="#666666" />
        </div>

        <div className="list">
          {
            (filterList||[]).map((item:any)=> {
              return <div className="list-item" key={item.id}>
                <div className="top">
                  <div className="left">
                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" alt="" />
                  </div>
                  <div className="right">
                    <div className="address">
                      <div>{
                        formatAddress(item?.account)
                      }</div>
                      <div>{item?.grade ? (
                        <Iconfont icon={'icon-zhaungtai1'}/>
                      ) : (
                        <>
                        <XCircle size={16} color="#f87171" />
                        </>
                      )}</div>
                    </div>
                    <div className="uid">UID {item.id}</div>
                    <div className="time">
                      {intl.formatMessage({ id: 'team.registration.time' })}: {dayjs(item.create_time).format('YYYY.MM.DD')}
                    </div>
                  </div>
                </div>
                <div className="middle">
                  <div className="item-label">
                    <div className="label">
                      {intl.formatMessage({ id: 'team.performance' })}
                    </div>
                    <div className="value">{formatNumber(item?.teamtotal||0)} LP</div>
                  </div>

                  <div className="item-label">
                    <div className="label">
                      {intl.formatMessage({ id: 'team.team.users' })}
                    </div>
                    <div className="value">{item?.dayTeam||0}</div>
                  </div>

                  <div className="item-label">
                    <div className="label">
                      {intl.formatMessage({ id: 'team.dividend.pool' })}
                    </div>
                    <div className="value">{item?.wp_grade}</div>
                  </div>

                  <div className="item-label">
                    <div className="label">
                      {intl.formatMessage({ id: 'team.dividend.ratio' })}
                    </div>
                    <div className="value">{item?.gradeintfee}%</div>
                  </div>
                </div>
              </div>
            })
          }


        </div>
      </div>
    </div>
  </Layouts>
}
export default Assets