// playbackControl.js
import TrackPlayer, {PlaybackState, State} from 'react-native-track-player';

export const playPause = async (state: PlaybackState | {state: undefined}) => {
  switch (state.state) {
    case State.Playing:
      await TrackPlayer.pause();
      break;
    case State.Paused:
    case State.Ready:
    case State.Stopped:
      await TrackPlayer.play();
      break;
  }
};
