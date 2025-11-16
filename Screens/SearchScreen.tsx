import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
// import { findMovies } from '../data';
import Loading from '../Components/loading';
import { SearchCourses } from '../router/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CourseCard from '../Components/CourseCard';

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    getUser();
  }, [token]);
  const getUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    setToken(userData ? (JSON.parse(userData).token ?? null) : null);
  };
  const searchCourses = (title: any) => {
    if (title !== '') {
      setLoading(true);
      SearchCourses(token, title)
        .then((response) => {
          setResults(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data: ', error);
        });
    } else {
      setResults([]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar translucent barStyle="dark-content" backgroundColor="#035AA6" />
        <View style={styles.headerContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#8593A6" style={styles.searchIcon} />
            <TextInput
              placeholder="ابحث عن دورة..."
              placeholderTextColor="#8593A6"
              onChangeText={(text) => searchCourses(text)}
              style={styles.textInput}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('Drawer')}
              style={styles.closeButton}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Loading />
          </View>
        ) : results.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            style={styles.scrollView}>
            <Text style={styles.resultsText}>النتائج ( {results.length} )</Text>
            <View>
              <FlatList
                data={results}
                renderItem={({ item }) => <CourseCard data={item} />}
                keyExtractor={(item: any) => item.id}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              source={require('../assets/images/family-enjoying-picnic.png')}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>ابدأ البحث عن الدورات</Text>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerContainer: {
    backgroundColor: '#ACCAF2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 12,
    paddingHorizontal: 16,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: '#3F83BF',
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#035AA6',
    textAlign: 'right',
    paddingVertical: 4,
  },
  closeButton: {
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#3F83BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  resultsText: {
    color: '#035AA6',
    marginRight: 16,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'right',
  },
  separator: {
    height: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  resultItem: {
    marginBottom: 16,
  },
  resultImage: {
    borderRadius: 24,
  },
  resultTitle: {
    marginRight: 8,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 300,
    height: 300,
    opacity: 0.6,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: '#8593A6',
    fontWeight: '500',
    textAlign: 'center',
  },
});
