'use client';
import { useEffect, useRef, useState } from 'react';

const YouTubePlayer = ({ videoId, onRemove, id }) => {
  const playerRef = useRef(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const onPlayerReady = (event) => {
      event.target.playVideo();
    };

    const onPlayerStateChange = (event) => {
      event.target.playVideo();
      // if (event.data === window.YT.PlayerState.ENDED) {
      //   event.target.playVideo();
      // }
    };

    const createPlayer = () => {
      setPlayer(new window.YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          'playsinline': 1,
          'autoplay': 1, // Ensure autoplay parameter is set
          'mute': 1      // Ensure video starts muted
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      }));
    };

    // Load the IFrame API if it hasn't been loaded already
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // Initialize the player when the API is ready
      window.onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
    } else {
      // If API is already loaded, create the player immediately
      createPlayer();
    }

    // Clean up player on component unmount
    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [videoId]);

  return (
    <div className='relative group m-2 aspect-video w-full rounded-lg overflow-hidden'>
      <div id={`player-${id}`} ref={playerRef} className='size-full' />
      <button className="absolute top-0 right-0 bg-red-500 text-white font-bold p-1 px-2 size-6 text-xs rounded-full opacity-0 group-hover:opacity-100" onClick={() => onRemove(id)}>X</button>
    </div>
  );
};

export default YouTubePlayer;
