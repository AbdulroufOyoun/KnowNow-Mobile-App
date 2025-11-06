import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CoursePlayList from '../Components/CoursePlayList';
import {
  Text,
  View,
  Platform,
  StatusBar,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import CollectionList from '../Components/CollectionList';
import { showCollections } from '../router/data';

const Tab = createMaterialTopTabNavigator();
const screenHeigh = Dimensions.get('window').height;

const MyStatusBar = ({ backgroundColor }: any) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <View>
      <StatusBar translucent backgroundColor={backgroundColor} barStyle="light-content" />
    </View>
  </View>
);

export default function AllCollectionsScreen() {
  const route = useRoute();
  const [collections, setCollections] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const { token = null }: any = route.params || {};
  const navigation = useNavigation();
  useEffect(() => {
    getCollections(page);
  }, [token]);

  const getCollections = (pageNumber: any) => {
    showCollections(token, pageNumber, 10)
      .then((response) => {
        setCollections((prevCollections) => [...prevCollections, ...response.data.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLoadMore = () => {
    setPage(page + 1);
    showCollections(page);
  };
  return (
    <ScrollView style={{ flex: 1 }}>
      <MyStatusBar backgroundColor="#474747" />

      <View style={styles.overlay}>
        <View>
          <View style={styles.background}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row' }}>
              <Ionicons name="chevron-back" size={28} color="white" />
              <Text style={{ fontSize: 20, color: 'white' }}> رجوع </Text>
            </TouchableOpacity>
            <View>
              <Text style={{ fontSize: 20, color: 'white', textAlign: 'right' }}>اخر العروض</Text>
            </View>
          </View>
        </View>
      </View>
      <FlatList
        data={collections}
        renderItem={({ item }) => <CollectionList data={item} />}
        keyExtractor={(item: any, index) => `${item.id}-${index}`} // Ensure uniqueness                showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // Make sure scrolling is enabled
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Adjust sensitivity
      />
    </ScrollView>
  );
}

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  background: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(108, 107, 107, 0.6)', // Adds a semi-transparent overlay
    padding: 15,
    margin: 10,
    borderRadius: 25,
    borderWidth: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: '#303030',
    height: APPBAR_HEIGHT,
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
