import {
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import SearchBar from '../Components/SearchBar';
import {useContext, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import SongComponent from '../Components/SongComponent';
import {Track} from 'react-native-track-player';
import {AppContext} from '../Context/Context';

export default function SearchScreen({navigation}: any) {
  const [searchResults, setSearchResults] = useState<readonly any[] | null>([]);

  const {setPlayingSong, songList} = useContext(AppContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={25} style={{marginRight: 10}} />
        </TouchableOpacity>
        <SearchBar
          data={[]}
          mainContainerViewStyle={{flex: 1}}
          onSearchResultsChange={results => setSearchResults(results)}
          autofocus={true}
          fields={['title', 'artist']}
          idField={'id'}
          suggestionShown={false}
        />
      </View>
      {searchResults?.length && searchResults?.length > 0 && (
        <ScrollView>
          {searchResults.map((item: Track) => (
            <SongComponent
              key={item.id}
              item={item}
              setCurrentSong={() => setPlayingSong(item)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 20,
  },
  cancelButton: {},
});
