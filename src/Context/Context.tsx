import React, {
  createContext,
  useState,
  useLayoutEffect,
  useEffect,
} from 'react';
import TrackPlayer, {
  PlaybackState,
  Progress,
  State,
  Track,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {addTrack, setupPlayer} from '../../musicPlayerServices';
import {playPause} from './playbackControl';
import {
  changeSong,
  loadLastCurrentSong,
  loadSongList,
  setPlayingSong,
} from './songManagement';
import {goTo} from './timeFunctions';

// Context prop types
interface ContextProps {
  /** Currently playing song */
  currentSong: Track | undefined;
  /** Function to set the currently playing song */
  setPlayingSong: (song: Track | null) => void;
  /** Function to play or pause the playback */
  playPause: () => void;
  /** State indicating if the track is playing */
  isPlaying: boolean;
  /** Function to set the state of the playback */
  setIsPlaying: (bool: boolean) => void;
  /** Function to toggle the like status of a song */
  likeToggle: (song: Track) => void;
  /** Function to change the current song */
  changeSong: (direction: 'backwards' | 'forward') => void;
  /** List of tracks */
  songList: Track[];
  /** State of the playback */
  state: PlaybackState | {state: undefined};
  /** Progress of the playback */
  progress: Progress;
  /** Function to navigate to a specific time in the track */
  goTo: (number: number) => void;
  /** Function to load the song list */
  loadSongList: () => void;
  /** Function to load the last played song */
  loadLastCurrentSong: () => void;
}

// Define the context
export const AppContext = createContext<ContextProps>({
  currentSong: undefined,
  setPlayingSong: () => null,
  playPause: () => null,
  isPlaying: false,
  setIsPlaying: () => null,
  likeToggle: () => null,
  changeSong: () => null,
  songList: [],
  state: {state: undefined},
  progress: {duration: 0, position: 0, buffered: 0},
  goTo: () => null,
  loadSongList: () => null,
  loadLastCurrentSong: () => null,
});

// Define the ContextProvider component
export function ContextProvider({children}: {children: React.ReactNode}) {
  const currentSong: Track | undefined = useActiveTrack();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const state: PlaybackState | {state: undefined} = usePlaybackState();
  const [songList, setSongList] = useState<Track[]>([]);
  const progress: Progress = useProgress();

  //HOOKS
  useLayoutEffect(() => {
    setupPlayer().then(() =>
      addTrack().then(() =>
        loadSongList(setSongList).then(() => loadSongList(setSongList)),
      ),
    );
  }, []);

  //every time the state changes change the pause/play states
  useEffect(() => {
    switch (state.state) {
      case State.Playing:
        setIsPlaying(true);
        break;
      case State.Paused:
      case State.Ready:
      case State.Stopped:
        setIsPlaying(false);
        break;
      default:
        break;
    }
  }, [state]);

  // Context value containing the current playing song and function to set it
  const contextValue: ContextProps = {
    currentSong,
    setPlayingSong: (song: Track | null) =>
      setPlayingSong(song, songList, setIsPlaying),
    playPause: () => playPause(state),
    isPlaying,
    setIsPlaying,
    likeToggle: (song: Track) => likeToggle(song, songList),
    changeSong: (direction: 'backwards' | 'forward') => changeSong(direction),
    songList,
    state,
    progress,
    goTo: (number: number) => goTo(number),
    loadSongList: () => loadSongList(setSongList),
    loadLastCurrentSong: () => loadLastCurrentSong(),
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
function likeToggle(song: Track, songList: Track[]): void {
  throw new Error('Function not implemented.');
}
