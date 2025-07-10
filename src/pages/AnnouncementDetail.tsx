import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Announcements.scss';
import { Calendar, User } from 'lucide-react';
// import { useLocation } from 'react-router-dom';
import useLanguageStore from '@/store/global.ts';

const AnnouncementDetail = ()=>{
  const intl = useIntl()
  // const location = useLocation();
  // const query = new URLSearchParams(location.search)
  // const id= query.get('id')
  const language = useLanguageStore()
  const content = `Dear Users:

To improve user experience and system stability, the Da Lat Train platform will undergo system upgrade maintenance from 02:00-04:00 (UTC+8) on January 20, 2025.

During maintenance, all platform functions will be temporarily suspended, including but not limited to:
• Login and registration
• Asset inquiry and withdrawal
• LP liquidity operations
• Node-related functions
• Fund value staking

After maintenance is completed, all functions will return to normal. We apologize for any inconvenience caused during the maintenance period.

If you have any questions, please contact our customer service team.

Da Lat Train Team
January 18, 2025`
  // 查询文章
  return <Layouts title={intl.formatMessage({id:'nav.announcement.detail'})}>
      <div className="announcement-container announcement-detail-container ">
        <div className="card">
          <div className="bottom">
            <h3>Platform upgrade maintenance noticeestimated maintenance time </h3>
          </div>
          <div className="top">
            <div className="left">
              <Calendar size={16} color="#FC6612" />
              <span>2023-05-01</span>
            </div>
            <div className="right">
              <User size={16} color="#FD6612" />
              {language.language === 'zh' ? '大叻火车官方' : 'Da Lat Train Official'}
            </div>
          </div>
          <div className="content" dir="auto">
            {content}
          </div>
        </div>
      </div>
  </Layouts>
}
export default AnnouncementDetail