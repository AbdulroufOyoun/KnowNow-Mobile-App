import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { showSpecializationYears } from 'router/data';

export default function YearScreen() {
  const route = useRoute();
  const { token = null, specialization_id = null } = (route as any).params || {};

  const [years, setYears] = useState<any>([]);
  const getYears = () => {
    showSpecializationYears(token, specialization_id)
      .then((response) => {
        setYears(response.data.data);
      })
      .catch(() => {
        // Error fetching years
      });
  };
  useEffect(() => {
    getYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigation = useNavigation<any>();
  const getYearName = (name: number) => {
    switch (name) {
      case 1:
        return 'السنة الأولى';
      case 2:
        return 'السنة الثانية';
      case 3:
        return 'السنة الثالثة';
      case 4:
        return 'السنة الرابعة';
      case 5:
        return 'السنة الخامسة';
      default:
        return `السنة رقم ${name}`;
    }
  };

  const Card = ({ id, name }: { id: number; name: any }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Chapter', {
          token: token,
          specialization_id: specialization_id,
          year: name,
        });
      }}
      activeOpacity={0.8}
      style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>{getYearName(name)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#F5F7FA" />
      <FlatList
        data={years}
        renderItem={({ item }) => <Card id={item.id} name={item.year} />}
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
