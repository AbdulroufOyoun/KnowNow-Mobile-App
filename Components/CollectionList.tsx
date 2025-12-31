import { useNavigation } from '@react-navigation/native';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeigh = Dimensions.get('window').height;

export default function CollectionList({ data, token }: any) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.seeAll}>
          {' '}
          <Text style={styles.oldPrice}>{data.oldPrice}</Text>{' '}
          <Text style={{ color: 'red' }}> {data.price} ألف </Text>{' '}
        </Text>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Collection', { item: data, token: token })}>
          <Text style={styles.title}>{data.name}</Text>
        </TouchableWithoutFeedback>
      </View>
      {/* Movie row */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {data.courses.map((item: any) => (
          <TouchableWithoutFeedback
            key={item.id}
            onPress={() =>
              navigation.navigate('CoursePlayList', {
                data: item.id,
                item: item,
              })
            }>
            <View style={styles.movieItem}>
              <Image
                source={{ uri: item.image }}
                style={[
                  styles.movieImage,
                  { width: screenWidth * 0.33, height: screenHeigh * 0.22 },
                ]}
              />
              <Text style={styles.movieTitle}>
                {item.name.length > 14 ? item.name.slice(0, 14) + '...' : item.name}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 10,
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: '#8593A6',
    fontSize: 15,
    marginRight: 8,
  },
  newPrice: {
    color: '#035AA6',
    fontSize: 17,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#035AA6',
    flex: 1,
    textAlign: 'right',
  },
  seeAll: {
    fontSize: 18,
  },
  scrollContainer: {
    paddingHorizontal: 15,
    marginHorizontal: '1%',
  },
  movieItem: {
    marginRight: 16,
  },
  movieImage: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ACCAF2',
  },
  movieTitle: {
    marginRight: 10,
    marginTop: 5,
    textAlign: 'right',
    height: 25,
    fontSize: 13,
    color: '#457ABF',
    fontWeight: '500',
  },
});
