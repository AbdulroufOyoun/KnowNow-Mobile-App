import { useNavigation } from '@react-navigation/native';
import { Dimensions, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
// import { styles } from '../theme';

const screenWidth = Dimensions.get('window').width;
const screenHeigh = Dimensions.get('window').height;

export default function CourseCard({ data }: any) {
  const navigation = useNavigation<any>();
  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate('CoursePlayList', {
          data: data.id,
          item: data,
        })
      }>
      <View style={styles.container}>
        <View>
          <Image source={{ uri: data.image }} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.contentWrapper}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {data.name}
            </Text>
            <Text style={styles.doctor} numberOfLines={1} ellipsizeMode="tail">
              {data.doctor}
            </Text>
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
              {data.description}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.university} numberOfLines={1} ellipsizeMode="tail">
              {data.university}
            </Text>
            <Text style={styles.price} numberOfLines={1}>
              {data.price} ألف
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    height: screenHeigh * 0.22,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginHorizontal: '2%',
    borderRadius: 16,
    justifyContent: 'space-between',
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3F83BF',
    overflow: 'hidden',
  },
  image: {
    borderRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    width: screenWidth * 0.4,
    height: screenHeigh * 0.22,
  },
  collectionTitle: {
    fontSize: 25,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 6,
    paddingTop: 6,
    paddingBottom: 4,
    justifyContent: 'space-between',
    overflow: 'hidden',
    minWidth: 0,
    maxHeight: screenHeigh * 0.22,
  },
  contentWrapper: {
    flex: 1,
    overflow: 'hidden',
    maxHeight: screenHeigh * 0.15,
  },
  title: {
    textAlign: 'right',
    marginBottom: 4,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#035AA6',
  },
  doctor: {
    textAlign: 'right',
    fontSize: 13,
    color: '#8593A6',
    marginBottom: 4,
  },
  description: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    maxHeight: screenHeigh * 0.06,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#ACCAF2',
    overflow: 'hidden',
    flexShrink: 0,
    maxHeight: 36,
  },
  university: {
    flex: 1,
    textAlign: 'left',
    fontSize: 13,
    color: '#457ABF',
    marginRight: 8,
    fontWeight: '500',
    minWidth: 0,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#035AA6',
    flexShrink: 0,
  },
});
