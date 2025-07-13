import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Announcements.scss'
import { Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnnouncementInterface, getAnnouncementList } from '@/service/announcement.ts';
import dayjs from 'dayjs';
const Announcements = ()=>{
  const intl = useIntl()
  const navigate = useNavigate()

  const [announcements,setAnnouncements] = useState<AnnouncementInterface[]>([])


  useEffect(() => {
    const fetchData = async () => {
      const data = await getAnnouncementList();
      setAnnouncements(data.list);
    };
    fetchData()
  }, []);

  return <Layouts title={intl.formatMessage({id:'nav.announcement'})}>
    <div className="announcement-container">
      {
        announcements.map((item)=>{
          return <>
            <div className="card " key={item.id} onClick={() => {
              navigate(`/announcement-detail?id=${item.id}`)
            }}>
              <div className="top">
                <div className="left">
                  <Calendar size={16} color="#FC6612" />
                  <span>{dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</span>
                </div>
                <ChevronRight size={20} color="#151515" />
              </div>
              <div className="bottom">
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </div>
            </div>
          </>
        })
      }


    </div>
  </Layouts>
}
export default Announcements