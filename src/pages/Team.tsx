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

      </div>


      <div className="card team-invite">


      </div>
    </div>
  </Layouts>
}
export default Assets