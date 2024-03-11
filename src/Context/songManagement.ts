// songManagement.js
import TrackPlayer, {Track} from 'react-native-track-player';

export const setPlayingSong = async (
  song: Track | null,
  songList: Track[],
  setIsPlaying: (bool: boolean) => void,
) => {
  try {
    if (!song) {
      await TrackPlayer.stop();
      setIsPlaying(false);
      return;
    }

    const songExists = songList.some(item => item.id === song.id);
    if (!songExists) {
      console.error('Song not found in the songList');
      return;
    }

    await TrackPlayer.skip(song.id - 1);
    await TrackPlayer.play();
    setIsPlaying(true);
  } catch (error) {
    console.error('Error setting playing song:', error);
  }
};

export const changeSong = async (direction: 'backwards' | 'forward') => {
  if (direction == 'forward') await TrackPlayer.skipToNext();
  else await TrackPlayer.skipToPrevious();
};

// Load all the songs found and the new ones
export const loadSongList = async (
  setSongList: (songList: Track[]) => void,
) => {
  const TrackList: Track[] = await TrackPlayer.getQueue();
  if (TrackList.length > 0) {
    setSongList(TrackList);
  }
};

// Time functions
export const loadLastCurrentSong = async () => {
  const lastCurrentSong = await TrackPlayer.getActiveTrack();

  // if (lastCurrentSong) {
  //   setCurrentSong(lastCurrentSong);
  // }
};
