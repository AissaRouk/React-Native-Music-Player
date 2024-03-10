import {useContext} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {AppContext} from '../Context/Context';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import {greyColor} from '../Styles/GenericStyles';
import formatDuration from '../Utils/formatDuration';

export default function SongModalComponent({
  onCloseButtonPress,
}: {
  onCloseButtonPress: () => void;
}) {
  const {
    setCurrentPlayingTime,
    currentPlayingTime,
    currentSong,
    isPlaying,
    playPause,
    changeSong,
  } = useContext(AppContext);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingTop: 20,
      }}>
      {/* Header */}
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => onCloseButtonPress()}>
          <Text style={styles.headerText}>X</Text>
        </TouchableOpacity>
        <Text style={{fontWeight: '600', ...styles.headerText}}>
          Current song
        </Text>
        <Text style={styles.headerText}>List</Text>
      </View>

      {/* ContentView */}
      <View style={styles.contentViewHeader}>
        <Image
          source={
            currentSong?.artwork
              ? {uri: currentSong.artwork}
              : require('../assets/images/NoteImage.jpeg')
          }
          style={styles.songImage}
          resizeMode="contain"
        />
        <Text style={styles.songName}>{currentSong?.title}</Text>
        <Text style={styles.songArtist}>{currentSong?.artist}</Text>
      </View>

      {/* Timeline bar */}
      <View style={{minWidth: 350, marginTop: 10}}>
        <View>
          <Slider
            maximumValue={currentSong?.duration}
            value={currentPlayingTime}
            style={{height: 45}}
            minimumTrackTintColor="black"
            maximumTrackTintColor="#000000"
            onValueChange={number => setCurrentPlayingTime(number)}
            step={1}
          />
          <View style={styles.sliderTimeView}>
            <Text>00:00</Text>
            <Text>{formatDuration(currentPlayingTime)}</Text>
          </View>
        </View>

        <View style={styles.controlButtonsView}>
          {/* Previous button */}
          <TouchableOpacity onPress={() => changeSong('backwards')}>
            <Icon name="controller-jump-to-start" size={55} />
          </TouchableOpacity>

          {/* Play/Pause buttons */}
          <TouchableOpacity onPress={() => playPause()}>
            <FontAwesome
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={85}
              color={'black'}
              style={{marginHorizontal: 45}}
            />
          </TouchableOpacity>

          {/* Forward button */}
          <TouchableOpacity onPress={() => changeSong('forward')}>
            <Icon name="controller-next" size={55} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerText: {
    fontSize: 18,
  },
  contentViewHeader: {
    alignItems: 'center',
    marginVertical: 30,
  },
  songImage: {
    height: 300,
    width: 300,
    borderRadius: 30,
    shadowColor: 'black',
  },
  songName: {marginTop: 20, fontSize: 30, fontWeight: '600'},
  songArtist: {
    marginTop: 10,
    fontSize: 18,
    color: greyColor,
    fontWeight: '500',
  },
  sliderTimeView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  controlButtonsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
});
