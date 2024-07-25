
// pages/index.js
// import { useEffect } from 'react';
import YouTubePlayerManager from '../../components/yotubeplayerManager';
export default function Home() {
  // useEffect(() => {
  //   // Make a request to the API endpoint to start the cron job
  //   fetch('/api/task', { method: 'POST' })
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  //     .catch(error => console.error(error));
  // }, []);

  return (
    <div className='relative p-4 h-screen flex flex-col justify-center items-center overflow-hidden'>    
          <YouTubePlayerManager />
    </div>
  );
}
