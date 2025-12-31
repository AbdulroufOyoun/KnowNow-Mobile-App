import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Text, View, StyleSheet, Dimensions, ScrollView, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();
const screenHeigh = Dimensions.get('window').height;

export default function AboutCourseScreen() {
  const route = useRoute();
  const { data = [] }: any = route.params || {};

  const ItemCard = ({ data, index }: any) => {
    return (
      <View style={styles.cardContainer}>
        <Text style={styles.title}>{data.title} :</Text>
        {data.descriptions.map((item: any, idx: any) => (
          <View key={idx} style={styles.listItem}>
            <Text style={styles.text}>{item.description || item}</Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletPoint}>•</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <FlatList
        data={data}
        renderItem={({ item }: any) => <ItemCard data={item} />}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#3F83BF',
  },
  title: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 22,
    color: '#035AA6',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  bulletContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  bulletPoint: {
    fontSize: 20,
    color: '#3F83BF',
    textAlign: 'right',
  },
  text: {
    fontSize: 16,
    marginRight: 8,
    textAlign: 'right',
    color: '#666',
    flex: 1,
    lineHeight: 24,
  },
  separator: {
    height: 8,
  },
});
