import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Announcements.scss'
import { Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Announcements = ()=>{
  const intl = useIntl()
  const navigate = useNavigate()
  return <Layouts title={intl.formatMessage({id:'nav.announcement'})}>
    <div className="announcement-container">
      <div className="card " onClick={()=>{
        navigate(`/announcement-detail?id=1`)
      }}>
        <div className="top">
          <div className="left">
            <Calendar size={16} color="#FC6612" />
            <span>2023-05-01</span>
          </div>
          <ChevronRight size={20} color="#151515" />
        </div>
        <div className="bottom">
          <h3>Platform upgrade maintenance noticeestimated maintenance time </h3>
          <p>To improve user experience and system stabilitythe platform will
            To improve user experience and system stabilitythe platform will
            To improve user experience and system stabilitythe platform will
            undergo system upgrade ...</p>
        </div>
      </div>

      <div className="card ">
        <div className="top">
          <div className="left">
            <Calendar size={16} color="#FC6612" />
            <span>2023-05-01</span>
          </div>
          <ChevronRight size={20} color="#151515" />
        </div>
        <div className="bottom">
          <h3>Platform upgrade maintenance noticeestimated maintenance time </h3>
          <p>To improve user experience and system stabilitythe platform will
            To improve user experience and system stabilitythe platform will
            To improve user experience and system stabilitythe platform will
            undergo system upgrade ...</p>
        </div>
      </div>
    </div>
  </Layouts>
}
export default Announcements