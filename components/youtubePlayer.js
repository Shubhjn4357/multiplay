// components/YouTubePlayer.js
'use client'
import { useEffect, useRef } from 'react';

const YouTubePlayer = ({ videoId, onRemove, id }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    const onPlayerReady = (event) => {
      event.target.playVideo();
    };

    const onPlayerStateChange = (event) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        event.target.playVideo();
      }
    };

    const createPlayer = () => {
      new window.YT.Player(playerRef.current, {
        videoId,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
        host: 'http://multiplay.vercel.app/api/proxy',
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      tag.onload = () => {
        window.YT.ready(createPlayer);
      };
    } else {
      createPlayer();
    }
  }, [videoId]);

  return (
    <div className='m-2 aspect-video w-full rounded-lg overflow-hidden'>
      <div id={`player-${id}`} ref={playerRef} className='size-full' />
      <button onClick={() => onRemove(id)}>Remove</button>
    </div>
  );
};

export default YouTubePlayer;
