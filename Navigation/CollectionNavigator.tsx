import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { checkSubscribeCollection } from '../router/data';
import CollectionSubscribeComponent from '../Components/CollectionSubscribeComponent';
import CourseCard from '../Components/CourseCard';
// import MyCoursesNavigation from './MyCoursesNavigation';

const Tab = createMaterialTopTabNavigator();
const screenHeigh = Dimensions.get('window').height;

const MyStatusBar = ({ backgroundColor }: any) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <View>
      <StatusBar translucent backgroundColor={backgroundColor} barStyle="light-content" />
    </View>
  </View>
);

export default function CollectionNavigator() {
  // const [token, setToken] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const route = useRoute();
  const { item = null, token = null }: any = route.params || {};
  const navigation = useNavigation();
  useEffect(() => {
    if (token && item?.id) {
      checkSubscribeCollection(token as string, item.id)
        .then((response: any) => {
          setSubscribed(response.data.data);
        })
        .catch((error: any) => {
          console.log(error.message);
        });
    }
  }, [token, item?.id]);

  // removed separate checkSubscribed to avoid exhaustive-deps warnings
  // Define the component separately
  const CollectionCoursesScreen = ({ route }: any) => {
    return (
      <ScrollView style={{ flex: 1, marginTop: 10 }}>
        <FlatList
          data={item?.courses || []}
          renderItem={({ item }) => <CourseCard data={item} />}
          keyExtractor={(item) => item.id?.toString()} // Ensuring keys are valid strings
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        />
      </ScrollView>
    );
  };
  return (
    <ScrollView style={{ flex: 1 }}>
      <MyStatusBar backgroundColor="#474747" />
      <ImageBackground
        source={{ uri: 'http://192.168.1.5:8888/Images/Courses/87494605972download.jpg' }} // Replace with your image path
        style={styles.background}>
        <View style={styles.overlay}>
          <View>
            <View style={styles.background}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ flexDirection: 'row' }}>
                <Feather name="chevron-left" size={28} color="white" />
                <Text style={{ fontSize: 20, color: 'white' }}> رجوع </Text>
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: 'center', marginTop: -70 }}>
                <Text style={{ fontSize: 40, color: 'white', textAlign: 'right' }}>
                  {item.name}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={{ flex: 1, height: 500, backgroundColor: 'red' }}>
        <Tab.Navigator
          style={{ flex: 1, backgroundColor: 'green', height: '100%' }}
          screenOptions={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
            tabBarIndicatorStyle: { backgroundColor: 'blue' },
          }}>
          <Tab.Screen
            name="Subscribe"
            options={{ tabBarLabel: 'اشتراك' }}
            initialParams={{ courseId: item.id, contain: subscribed, token: token }}
            component={CollectionSubscribeComponent}
          />
          <Tab.Screen
            name="CollectionCourses"
            options={{ tabBarLabel: 'الدورات' }}
            component={CollectionCoursesScreen} // Correct way to reference the component
          />
        </Tab.Navigator>
      </View>
    </ScrollView>
  );
}

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  background: {
    height: screenHeigh * 0.3,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adds a semi-transparent overlay
    padding: 15,
    width: '100%',
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
