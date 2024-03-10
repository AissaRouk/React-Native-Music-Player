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

// Context prop types
interface ContextProps {
  /**
   * Actual playing song
   */
  currentSong: Track | undefined;
  /**
   * Function to set the actual song
   */
  setPlayingSong: (song: Track | null) => void;
  /**
   * Function that plays or pauses
   */
  playPause: () => void;
  /**
   * State to see if the TrackPlayer is already playing
   */
  isPlaying: boolean;
  /**
   * Function to change the isPlaying state
   */
  setIsPlaying: (bool: boolean) => void;
  /**
   * Function that changes the like param
   */
  likeToggle: (song: Track) => void;
  /**
   * Function to change the actual song
   */
  changeSong: (direction: 'backwards' | 'forward') => void;
  /**
   * Track list
   */
  songList: Track[];
  /**
   * The state of the playbackUser
   */
  state: PlaybackState | {state: undefined};
  /**
   * state of the progess of the playing
   */
  progress: Progress;
  /**
   * Function to change the seconds in which we are playing
   */
  goTo: (number: number) => void;
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
});

// Define the ContextProvider component
export function ContextProvider({children}: {children: React.ReactNode}) {
  const currentSong: Track | undefined = useActiveTrack();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const state: PlaybackState | {state: undefined} = usePlaybackState();
  const [songList, setSongList] = useState<Track[]>([]);
  const progress: Progress = useProgress();

  // Load the last played song from AsyncStorage on component mount
  const loadLastPlayedSong = async () => {};

  // Load all the songs found and the new ones
  const loadSongList = async () => {
    const TrackList: Track[] = await TrackPlayer.getQueue();
    if (TrackList.length > 0) {
      setSongList(TrackList);
    }
  };

  //Save in AsyncStorage the songList
  const saveSongList = async () => {};

  // Function to set the current playing song
  const setPlayingSong = async (song: Track | null) => {
    try {
      if (!song) {
        // If song is null, stop playback
        await TrackPlayer.stop();
        setIsPlaying(false);
        return;
      }

      const songExists = songList.some(item => item.id === song.id);
      if (!songExists) {
        // Handle case where song doesn't exist in the songList
        console.error('Song not found in the songList');
        return;
      }

      // Skip to the selected song and start playback
      await TrackPlayer.skip(song.id - 1);
      await TrackPlayer.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error setting playing song:', error);
    }
  };

  //function to allow the next and back song changing functionalities
  const changeSong = async (direction: 'backwards' | 'forward') => {
    if (direction == 'forward') await TrackPlayer.skipToNext();
    else await TrackPlayer.skipToPrevious();
  };

  // Time functions
  const loadLastCurrentSong = async () => {
    const lastCurrentSong = await TrackPlayer.getActiveTrack();

    // if (lastCurrentSong) {
    //   setCurrentSong(lastCurrentSong);
    // }
  };

  const saveCurrentPlayingTime = async () => {};

  const playPause = async () => {
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

  const goTo = async (number: number) => {
    if (number >= 0) await TrackPlayer.seekTo(number);
    return;
  };

  //HOOKS

  //UseLayout effect
  useLayoutEffect(() => {
    //set up player
    setupPlayer().then(() =>
      addTrack().then(() => loadSongList().then(() => loadLastCurrentSong())),
    );
  }, []);

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

  const likeToggle = (song: Track) => {};

  // Context value containing the current playing song and function to set it
  const contextValue: ContextProps = {
    currentSong,
    setPlayingSong,
    playPause,
    isPlaying,
    setIsPlaying,
    likeToggle,
    changeSong,
    songList,
    state,
    progress,
    goTo,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
