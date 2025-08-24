import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Team.scss';
import { useEffect, useState } from 'react';
import { getMyTeams, TeamInterface, TeamMember } from '@/service/team.ts';
import dayjs from 'dayjs';
import { formatAddress } from '@/utils/common.ts';
import BigNumber from 'bignumber.js'
import { List, PullRefresh } from 'react-vant';

const Assets = ()=>{
  const intl = useIntl();
  const [team,setTeam] = useState<TeamInterface|null>(null)
  const [page,setPage] = useState(1)
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState<boolean>(false)
  const [,setTotal] = useState(0)

  const [list,setList] = useState<TeamMember[]>([])

  const fetchData = async (pageNum:number=1, isRefresh = false)=>{
    if (loading) return;
    setLoading(true);
    try {
      const res = await getMyTeams({page:pageNum,limit:10})
      setTeam(res)
      setTotal(res.total)
      const newList = isRefresh ? res.firstList : [...list, ...res.firstList]
      setList(newList)
      setFinished(newList.length >= res.total)
      setPage(pageNum + 1)
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }

  }

  useEffect(()=>{
    fetchData()
  },[])


  // 下拉刷新
  const onRefresh = async () => {
    if (loading) return;
    setFinished(false)
    setPage(1)
    setTeam(null)
    await fetchData(1, true)
  }

  // 分页加载
  const onLoad = async () => {
    if (loading || finished) return;
    await fetchData(page)
  }
  return <Layouts title={intl.formatMessage({id:'nav.team'})}>
    <div className="team-container">
      <div className="card team-info">
        <div className="common-title">{intl.formatMessage({ id: 'team.user.title' })}</div>
        <div className="team-list">
          <div className="item">
            <div className="left">
              <i className="iconfont icon-user purple"></i>{intl.formatMessage({ id: 'team.user.address' })}
            </div>
            <div className="right">{formatAddress(team?.userInfo.account||'')}</div>
          </div>
          <div className="item">
            <div className="left">
              <i className="iconfont icon-star warning"></i>{intl.formatMessage({ id: 'team.user.whitelist' })}
            </div>
            <div className={`right ${team?.userInfo.whitesta === 0? 'warning': 'success'}`}>{ team?.userInfo.whitesta  === 0 ? intl.formatMessage({ id: 'team.user.whitelist.status.no.auth' }) :intl.formatMessage({ id: 'team.user.whitelist.status.authed' })}</div>
          </div>
          <div className="item">
            <div className="left">
              <i className="iconfont icon-gift success"></i>{intl.formatMessage({ id: 'team.user.airdrop' })}
            </div>
            <div className={`right ${team?.userInfo.freesta === 0 ? 'warning' : 'success'}`}>{team?.userInfo.freesta  === 0 ? intl.formatMessage({ id: 'team.user.airdrop.status.no.auth' }) : intl.formatMessage({ id: 'team.user.whitelist.status.authed' })}</div>
          </div>
          <div className="item">
            <div className="left">
              <i className="iconfont icon-calendar info"></i>{intl.formatMessage({ id: 'team.user.resgister.time' })}
            </div>
            <div className="right">{dayjs(team?.userInfo.create_time).format('YYYY-MM-DD')}</div>
          </div>
        </div>
        <div className="total">
          <div className="item">
            <div className="top">{intl.formatMessage({ id: 'team.user.staking.balance' })}</div>
            <div>{BigNumber(team?.userInfo.pledgenum||0).toFormat()} TYOE</div>
          </div>
          <div className="item">
            <div className="top">{intl.formatMessage({ id: 'team.invite.balance' })}</div>
            <div>{BigNumber(team?.userInfo.pledgeteam || 0).toFormat()} TYOE</div>
          </div>
        </div>
      </div>


      <div className="card team-invite">
          <div className="common-title">{intl.formatMessage({ id: 'team.tui.title' })}</div>
        <div className="team-invite-number">
          {intl.formatMessage({ id: 'team.tui.number' },{num:team?.firstLen||0})}
        </div>
        <div className="team-invite-list">
          {
            <PullRefresh onRefresh={onRefresh}>
              <List finished={finished} onLoad={onLoad} className={'team-invite-list'}>
                {list?.map((item)=> {
                  return <div className="item" key={item.id}>
                    <div className="top">
                      <div className="left">{formatAddress(item.account)}</div>
                      <div className="right">{dayjs(item.create_time).format('YYYY-MM-DD')}</div>
                    </div>
                    <div className="bottom">
                      <div className="bottom-item">
                        <i className={`iconfont icon-star ${item.whitesta== 0 ?' ' : 'warning'}`}></i>
                        <div>{item.whitesta== 0 ? intl.formatMessage({id:'team.tui.normal'}):intl.formatMessage({ id: 'team.tui.whitelist' })}</div>
                      </div>
                      <div className="bottom-item">
                        <i className={`iconfont icon-star ${item.freesta== 0 ?' ' : 'success'}`}></i>
                        <div>{item.freesta== 0 ? intl.formatMessage({id:'team.tui.airdrop.empty'}):intl.formatMessage({ id: 'team.tui.airdrop.success' })}</div>
                      </div>
                      <div className="bottom-item">
                        <i className="iconfont icon-coins-02"></i>
                        <div>{BigNumber(item.pledgenum||0).toFormat()} TYOE</div>
                      </div>
                    </div>
                  </div>
                })
                }
              </List>
            </PullRefresh>
          }
        </div>

      </div>
    </div>
  </Layouts>
}
export default Assets