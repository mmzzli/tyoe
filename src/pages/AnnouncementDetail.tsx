import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Announcements.scss';
import { Calendar, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnnouncementInterface, getAnnouncementDetailById } from '@/service/announcement.ts';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const AnnouncementDetail = ()=>{
  const intl = useIntl()
  const location = useLocation();
  const query = new URLSearchParams(location.search)
  const id= query.get('id')
  const [announcement,setAnnouncement] = useState<AnnouncementInterface|null>(null)

  useEffect(()=>{
    const fetData = async () => {
      if(id){
        const data = await getAnnouncementDetailById({ id:parseInt(id) });
        console.log(data);
        setAnnouncement(data);
      }
    };
    fetData()
  },[id])
  // 查询文章
  return <Layouts title={intl.formatMessage({id:'nav.announcement.detail'})}>
      <div className="announcement-container announcement-detail-container ">
        <div className="card">
          <div className="bottom">
            <h3>{announcement?.title}</h3>
          </div>
          <div className="top">
            <div className="left">
              <Calendar size={16} color="#FC6612" />
              <span>{dayjs(announcement?.create_time).format('YYYY-MM-DD')}</span>
            </div>
            <div className="right">
              <User size={16} color="#FD6612" />
              {announcement?.author}
            </div>
          </div>
          <div className="content" dir="auto" dangerouslySetInnerHTML={{__html:announcement?.content||''}}>

          </div>
        </div>
      </div>
  </Layouts>
}
export default AnnouncementDetail