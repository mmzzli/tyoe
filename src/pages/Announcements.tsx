import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Announcements.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnnouncementInterface, getAnnouncementList } from '@/service/announcement.ts';
import dayjs from 'dayjs';
import useLanguageStore from '@/store/global.ts';
import Iconfont from '@/component/Iconfont.tsx';

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
    <div className="announcement-container pv20" >
      {
        announcements.map((item)=>{
          const title = item?.[`title_${language}`] || item.title
          const content = item?.[`content_${language}`] || item.content
          return <>
            <div className="card " key={item.id} onClick={() => {
              navigate(`/announcement-detail?id=${item.id}`);
            }}>
              <div className="top">
                <h3>{title}</h3>
                <Iconfont className={'icon-right-arrow'} icon={'icon-right'} />
              </div>
              <div className="bottom">
                <p>{content}</p>
              </div>
              <div className="announcement-footer">
                <div className={'time'}>
                  <Iconfont icon={'icon-calendar'}></Iconfont>
                  {dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div className="right">
                  <span>重要</span>
                </div>
              </div>
            </div>
          </>
        })
      }


    </div>
  </Layouts>
}
export default Announcements;