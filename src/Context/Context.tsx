import React, {
  createContext,
  useState,
  useLayoutEffect,
  useEffect,
} from 'react';
import TrackPlayer, {
  Capability,
  PlaybackState,
  State,
  Track,
  useActiveTrack,
  usePlaybackState,
} from 'react-native-track-player';
import {addTrack, setupPlayer} from '../../musicPlayerServices';

// Context prop types
interface ContextProps {
  currentSong: Track | undefined;
  setPlayingSong: (song: Track | null) => void;
  currentPlayingTime: number;
  setCurrentPlayingTime: (number: number) => void;
  playPause: () => void;
  isPlaying: boolean;
  setIsPlaying: (bool: boolean) => void;
  likeToggle: (song: Track) => void;
  changeSong: (direction: 'backwards' | 'forward') => void;
  songList: Track[];
  state: PlaybackState | {state: undefined};
}

// Define the context
export const AppContext = createContext<ContextProps>({
  currentSong: undefined,
  setPlayingSong: () => null,
  setCurrentPlayingTime: () => null,
  currentPlayingTime: 0,
  playPause: () => null,
  isPlaying: false,
  setIsPlaying: () => null,
  likeToggle: () => null,
  changeSong: () => null,
  songList: [],
  state: {state: undefined},
});

// Define the ContextProvider component
export function ContextProvider({children}: {children: React.ReactNode}) {
  const currentSong: Track | undefined = useActiveTrack();
  const [currentPlayingTime, setCurrentPlayingTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const state: PlaybackState | {state: undefined} = usePlaybackState();
  const [songList, setSongList] = useState<Track[]>([]);

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
        setCurrentPlayingTime(0);
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
      default:
        break;
    }
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
    currentPlayingTime,
    setCurrentPlayingTime,
    playPause,
    isPlaying,
    setIsPlaying,
    likeToggle,
    changeSong,
    songList,
    state,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
