// timeFunctions.js
import TrackPlayer from 'react-native-track-player';

export const goTo = async (number: number) => {
  if (number >= 0) await TrackPlayer.seekTo(number);
};
