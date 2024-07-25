'use client';
import { useState } from 'react';
import YouTubePlayer from './youtubePlayer';


const extractVideoId = (url) => {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\/)?([a-zA-Z0-9_-]{11})|(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/);
  return match ? (match[1] || match[2]) : null;
};

const YouTubePlayerManager = () => {
  const [players, setPlayers] = useState([]);
  const [url, setUrl] = useState('');
  const [multiplyer, setMultiplyer] = useState('1');
  
  const removePlayer = (id) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  const addMultiPlayer = () => {
    const videoId = extractVideoId(url);
    const newPlayers = [];
    if (videoId && !isNaN(parseInt(multiplyer)) && parseInt(multiplyer) > 0) {
      for (let i = 0; i < parseInt(multiplyer); i++) {
        newPlayers.push({ id: Date.now() + i, videoId });
      }
      setPlayers([...players, ...newPlayers]);
    } else {
      alert('Invalid YouTube URL or multiplier');
    }
  };

  return (
    <div className='p-4 ring ring-stone-700 rounded-md'>
      <div className='sticky top-2 bg-white/20 backdrop-blur-lg rounded-md p-4 my-4'>
        <h1 className='text-2xl font-bold text-center'>Welcome to My Server Task</h1>
        <h1 className='text-sm text-muted font-bold text-center my-4'>Multiple YouTube Video Players</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            className='input text-center text-black outline-none rounded-md w-full p-2'
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube Video URL"
          />
          <input
            type="number"
            value={multiplyer}
            className='input text-center text-black outline-none rounded-md w-20 p-2'
            onChange={(e) => setMultiplyer(e.target.value)}
            placeholder="Enter Multiplier"
          />
        </div>
        <button className='bg-blue-500 text-white font-bold py-2 px-4 w-full my-2 rounded-md' onClick={addMultiPlayer}>Play Video</button>
      </div>
      <div className='grid grid-cols-4 gap-4'>
        {players.map(player => (
          <YouTubePlayer
            key={player.id}
            id={player.id}
            videoId={player.videoId}
            onRemove={removePlayer}
          />
        ))}
      </div>
    </div>
  );
};

export default YouTubePlayerManager;
