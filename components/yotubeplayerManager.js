'use client';
import { Suspense, useState } from 'react';
import YouTubePlayer from './youtubePlayer';
import SuspensePlayer from './suspensePlayer';
import DownloadFile from './downloadFile';

const extractVideoId = (url) => {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\/)?([a-zA-Z0-9_-]{11})|(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/);
  return match ? (match[1] || match[2]) : null;
};

const YouTubePlayerManager = () => {
  const [players, setPlayers] = useState([]);
  const [url, setUrl] = useState('');
  const [multiplyer, setMultiplyer] = useState('1');
  const [download, setDownload] = useState('');
  const randomId = () => Math.floor(Math.random() * 1000000);
  
  const removePlayer = (id) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  const addMultiPlayer = () => {
    setDownload('');
    const videoId = extractVideoId(url);
    const newPlayers = [];
    if (videoId && !isNaN(parseInt(multiplyer)) && parseInt(multiplyer) > 0) {
      for (let i = 0; i < parseInt(multiplyer); i++) {
        newPlayers.push({ id: Date.now() + randomId(), videoId });
      }
      setPlayers([...players, ...newPlayers]);
    } else {
      alert('Invalid YouTube URL or multiplier');
    }
  };
const removeAll = () => {
    setPlayers([]);
    setUrl('');
    setMultiplyer('1');
  };
const downloadVideo=()=>{
  setPlayers([]);
  setMultiplyer('1');
  const videoId = extractVideoId(url);
  if(!videoId){
    alert('Invalid YouTube URL');
    return;
  }
  else{
    setDownload(videoId)
  }
}
  return (
    <div className='p-4 ring ring-stone-700 rounded-md size-full scroll'>
      <div className='bg-white/10 backdrop-blur-lg rounded-md p-4 my-4'>
        <h1 className='text-2xl font-bold text-center'>Welcome to MultiPlay</h1>
        <h1 className='text-sm text-muted font-bold text-center my-4'>Multiple YouTube Video Players</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            className='input text-center text-black outline-none rounded-md w-full p-2'
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube Video URL"
          />
          <input
            type="number"
            value={multiplyer}
            className='input text-center text-black outline-none rounded-md w-20 p-2'
            onChange={(e) => setMultiplyer(e.target.value)}
            placeholder="Enter Multiplier"
          />
        </div>
        <div className='flex gap-2 flex-wrap my-4 mx-auto justify-center'>
          <button className='bg-blue-500 text-white font-bold py-2 px-4 w-full max-w-xs my-2 rounded-md' onClick={addMultiPlayer}>Play Video</button>
          <button className='bg-red-500 text-white font-bold py-2 px-4 w-full max-w-xs my-2 rounded-md' onClick={removeAll}>Reset</button>
          <button className='bg-green-500 text-white font-bold py-2 px-4 w-full  max-w-xs my-2 rounded-md' onClick={downloadVideo}>DownloadVideo</button>
        </div>
      </div>
      {download && <DownloadFile videoId={download} onRemove={()=>(setDownload(""))}/>}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mx-auto my-4'>
        {players.map(player => (
          <Suspense key={player.id} fallback={<SuspensePlayer/>}>
            <YouTubePlayer
              key={player.id}
              id={player.id}
              videoId={player.videoId}
              onRemove={removePlayer}
            />
          </Suspense>
        ))}
      </div>
      <p className='absolute bottom-4 left-6 text-base text-muted'>Created By <a href="https://github.com/Shubhjn4357" target="_blank" rel="noopener noreferrer">ShubhJain ❤️</a></p>
    </div>
  );
};

export default YouTubePlayerManager;
