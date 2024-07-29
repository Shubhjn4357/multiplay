import { useCallback, useEffect, useRef, useState } from 'react';
import SuspensePlayer from './suspensePlayer';

const YouTubePlayer = ({ videoId, onRemove, id ,className}) => {
  const playerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

   // Function to create the YouTube player
   const createPlayer = useCallback(() => {
    if (window.YT && playerRef.current) {
      setPlayer(new window.YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          'playsinline': 1,
          'autoplay': 1,
          'mute': 1,
        },
        events: {
          onReady: (event) => {
            setIsPlayerReady(true);
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              // Optionally handle the end of video
              console.log('Video ended');
            }
          },
        },
      }));
    } else {
      console.error('YouTube API not loaded or player element not found');
    }
  }, [videoId]);

// Load YouTube IFrame API script if not already loaded
useEffect(() => {
  const loadYouTubeAPI = () => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
    } else {
      createPlayer();
    }
  };

  loadYouTubeAPI();

  // Clean up player on component unmount
  return () => {
    if (player) {
      player.destroy();
      setPlayer(null);
    }
  };
}, [createPlayer]);


  return (
    <div className={`relative group m-2 aspect-video w-full rounded-lg overflow-hidden ${className}`}>
      {!isPlayerReady && <SuspensePlayer />}
      <div id={`player-${id}`} ref={playerRef} className='size-full' />
      <button
        className="absolute top-0 right-0 bg-red-500 text-white font-bold p-1 px-2 size-6 text-xs rounded-full opacity-0 group-hover:opacity-100"
        onClick={() => onRemove(id)}
      >
        X
      </button>
      
    </div>
  );
};

export default YouTubePlayer;
