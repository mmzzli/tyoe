import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import { formatAddress, formatNumber } from '@/utils/common.ts';
import { Award, CheckCircle, Search, TrendingUp, Users, XCircle } from 'lucide-react';
import './Team.scss'
import { useEffect, useState } from 'react';
import { getMyTeams } from '@/service/team.ts';

const Assets = ()=>{
  const intl = useIntl();
  const [search,setSearch] = useState('')
  const [team,setTeam] = useState<any>({})

  useEffect(()=>{
    const fetchData = async ()=>{
      const res = await getMyTeams()
      console.log(res);
      setTeam(res)
    }
    fetchData()
  },[])
  const isEffective = true
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
                <CheckCircle size={16} color="#3ED474" />
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
            <TrendingUp size={20} color="#FD6816" />
            <div className="label">
              {intl.formatMessage({ id: 'team.performance' })}
            </div>
            <div className="value">
              {formatNumber(team.userInfo?.totalmoney||0)} LP
            </div>
          </div>

          <div className="item" style={{ backgroundColor: '#E7F8FB' }}>
            <TrendingUp size={20} color="#22B9D6" />
            <div className="label">
              {intl.formatMessage({ id: 'team.district.performance' })}
            </div>
            <div className="value">
              {formatNumber(team.userInfo?.minmoney||0)} LP
            </div>
          </div>

          <div className="item" style={{ backgroundColor: '#E9F0FF' }}>
            <Users size={20} color="#256DFF" />

            <div className="label">
              {intl.formatMessage({ id: 'team.direct.users' })}
            </div>
            <div className="value">
              {formatNumber(team.userInfo?.dayFirst||0)}
            </div>
          </div>

          <div className="item" style={{ backgroundColor: '#FDFCFF' }}>
            <Users size={20} color="#8B5CF6" />

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
              <Award size={20} color="#F5A400" />
              <div className="label">{intl.formatMessage({ id: 'team.dividend.pool' })}</div>
            </div>
            <div className="value">
              2号分红池
            </div>
          </div>

          <div className="item">
            <div className="left">
              <Award size={20} color="#F5A400" />
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
          {intl.formatMessage({ id: 'team.direct.list' })} ({team?.userInfo?.firstLen})
        </div>

        <div className="search-box">
          <input type="text" onInput={(e:any)=>{setSearch(e.target.value)}} />
          <Search size={20} color="#666666" />
        </div>

        <div className="list">
          {
            (team?.firstList||[]).map((item:any)=> {
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
                        <CheckCircle size={16} color="#4ade80" />
                      ) : (
                        <XCircle size={16} color="#f87171" />
                      )}</div>
                    </div>
                    <div className="uid">UID {item.id}</div>
                    <div className="time">
                      {intl.formatMessage({ id: 'team.registration.time' })}: {item.create_time}
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