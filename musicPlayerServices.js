import TrackPlayer, {Event, RepeatMode} from 'react-native-track-player';
import {playListData} from './src/assets/constants';

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getActiveTrack().then(response => {
      console.log(JSON.stringify(response));
    });
    isSetup = true;
  } catch (error) {
    await TrackPlayer.setupPlayer();
    isSetup = true;
  } finally {
    return isSetup;
  }
}

export async function addTrack() {
  try {
    const existingQueue = await TrackPlayer.getQueue();
    const newSongs = playListData.filter(
      song => !existingQueue.find(item => item.id === song.id),
    );
    if (newSongs.length > 0) {
      await TrackPlayer.add(newSongs);
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    }
  } catch (error) {
    console.log('Error adding tracks: ', error);
  }
}

export async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });
}
