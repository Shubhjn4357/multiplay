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
      if (event.data === window.YT.PlayerState.ENDED) {
        event.target.playVideo();
      }
    };

    const createPlayer = () => {
      setPlayer(new window.YT.Player(playerRef.current, {
        videoId,
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
    <div className='m-2 aspect-video w-full rounded-lg overflow-hidden'>
      <div id={`player-${id}`} ref={playerRef} className='size-full' />
      <button onClick={() => onRemove(id)}>Remove</button>
    </div>
  );
};

export default YouTubePlayer;
