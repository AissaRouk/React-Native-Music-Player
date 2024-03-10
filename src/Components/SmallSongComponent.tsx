import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import TrackPlayer, {Track} from 'react-native-track-player';
import {useContext} from 'react';
import {AppContext} from '../Context/Context';
const blackTheme = '#171C26';
const greyColor = '#A4AAB7';

interface SmallSongComponentProps {
  currentSong: Track;
  onComponentPress: () => void;
}

/**
 *
 * @returns Small mini controller which is situated in the bottom of the main page
 */
export default function SmallSongComponent({
  currentSong,
  onComponentPress,
}: SmallSongComponentProps) {
  const {isPlaying, playPause} = useContext(AppContext);

  return (
    <View style={styles.smallView}>
      <Image
        source={
          currentSong.artwork
            ? {uri: currentSong.artwork}
            : require('../assets/images/NoteImage.jpeg')
        }
        style={styles.smallViewImage}
        resizeMode="contain"
      />
      <TouchableOpacity style={{flex: 1}} onPress={() => onComponentPress()}>
        <View>
          <Text style={{color: '#FFFF'}}>{currentSong.title}</Text>
          <Text style={{color: greyColor}}>{currentSong.artist}</Text>
        </View>
        {/* Play/Pause button */}
        <View
          style={{
            position: 'absolute',
            right: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            // onPress={() => {
            //   likeToggle(currentSong), console.log('clicked!!');
            // }}
            style={{
              marginRight: 10,
              padding: 5,
            }}>
            <Icon
              // name={currentSong.like ? 'heart' : 'heart-outlined'}
              name="heart"
              size={25}
              color={'#FFFF'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#FFFF',
              borderRadius: 5,
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => playPause()}>
            <Icon
              name={isPlaying ? 'controller-paus' : 'controller-play'}
              size={25}
              style={{marginHorizontal: 5}}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  smallView: {
    height: 80,
    backgroundColor: blackTheme,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: 'black',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  smallViewImage: {
    height: '100%',
    width: 80,
    left: 0,
    borderRadius: 9,
    marginRight: 10,
  },
  smallViewText: {
    color: 'white',
  },
});
