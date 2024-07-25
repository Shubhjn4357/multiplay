'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import SuspensePlayer from './suspensePlayer';


const YouTubePlayer = ({ videoId, onRemove, id }) => {
  const playerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const createPlayer = useCallback(() => {
    const onPlayerReady = (event) => {
      setIsPlayerReady(true);
      event.target.playVideo();
    };
    const onPlayerStateChange = (event) => {
      if (event.data === window.YT.PlayerState.PLAYING) {
        setIsPlayerReady(true);
        event.target.playVideo();
      }
    };


    if (window.YT && !player) {
      setPlayer(new window.YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          'playsinline': 1,
          'autoplay': 1,
          'mute': 1
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      }));
    }
  }, [videoId, player]);
  useEffect(() => {
   

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      if (player) {
        player.destroy();
        setPlayer(null); // Reset player state when unmounting
      }
    };
  }, [createPlayer, player]);
  
  return (
    <div className='relative group m-2 aspect-video w-full rounded-lg overflow-hidden'>
      {!isPlayerReady && <SuspensePlayer />}
      <div id={`player-${id}`} ref={playerRef} className='size-full' />
      <button className="absolute top-0 right-0 bg-red-500 text-white font-bold p-1 px-2 size-6 text-xs rounded-full opacity-0 group-hover:opacity-100" onClick={() => onRemove(id)}>X</button>
    </div>
  );
};

export default YouTubePlayer;
