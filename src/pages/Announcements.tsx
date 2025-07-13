import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Announcements.scss'
import { Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnnouncementInterface, getAnnouncementList } from '@/service/announcement.ts';
import dayjs from 'dayjs';
import useLanguageStore from '@/store/global.ts';
const Announcements = ()=>{
  const intl = useIntl()
  const navigate = useNavigate()
  const {language} = useLanguageStore()
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
          const title = item?.[`title_${language}`] || item.title
          const content = item?.[`content_${language}`] || item.content
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
                <h3>{title}</h3>
                <p>{content}</p>
              </div>
            </div>
          </>
        })
      }


    </div>
  </Layouts>
}
export default Announcements