import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';

export default function ChapterScreen() {
  const route = useRoute();
  const { token = null, specialization_id = null, year = null } = (route as any).params || {};

  const [years, setYears] = useState([
    { id: '1', name: 'الفصل الأول' },
    { id: '2', name: 'الفصل الثاني' },
  ]);

  const navigation = useNavigation<any>();

  const Card = ({ id, name }: { id: string; name: string }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Courses', {
          token: token,
          specialization_id: specialization_id,
          year: year,
          chapter: id,
        });
      }}
      activeOpacity={0.8}
      style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>{name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#F5F7FA" />
      <FlatList
        data={years}
        renderItem={({ item }) => <Card id={item.id} name={item.name} />}
        keyExtractor={(item: any, index: number) => item?.id?.toString() || index.toString()}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
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
  cardContent: {
    padding: 20,
  },
  cardText: {
    textAlign: 'right',
    fontSize: 18,
    fontWeight: '600',
    color: '#035AA6',
    lineHeight: 26,
  },
  separator: {
    height: 12,
  },
});
