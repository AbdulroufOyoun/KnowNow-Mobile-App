import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { subscribe } from '../router/data';
export default function SubscribeComponent({ updateSubscriptionStatus, route }: any) {
  const navigation = useNavigation<any>();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const { courseId = null, contain, token = null } = route.params || {};
  const [subscribed, setSubscribed] = useState(contain.is_subscribed);

  const subscribeCourse = () => {
    if (code.length === 8) {
      subscribe({ collection_code: null, course_code: code, item_id: courseId }, token)
        .then((_response: any) => {
          setSubscribed(true);
          navigation.goBack();
        })
        .catch((error: any) => {
          console.log(error);
          setError(true);
          setCode('');
        });
    }
  };
  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <>
        {!subscribed ? (
          <View style={{ marginTop: 30 }}>
            <Text
              style={{ textAlign: 'right', marginHorizontal: 30, fontSize: 20, marginBottom: 10 }}>
              أدخل كود الأشتراك
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity style={styles.button} onPress={subscribeCourse}>
                <Text style={styles.buttonText}>تأكيد</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="كود التفعيل"
                placeholderTextColor="#aaa"
                value={code}
                onChangeText={(text) => setCode(text)}
              />
            </View>
            <>
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 15, padding: 15, textAlign: 'right', color: 'red' }}>
                  (الكورس يُقدَّم لمرة واحدة فقط، وفي حال عدم اجتيازه، يتطلب التسجيل من جديد بالرسوم
                  كاملة )
                </Text>
              </View>
              {error ? (
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                  <Text style={{ fontSize: 20, color: 'red' }}>كود التفعيل خطأ</Text>
                </View>
              ) : (
                <View></View>
              )}
            </>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 25 }}>أنت مشترك بالفعل</Text>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Ionicons name="shield-checkmark" size={100} color="green" />
            </View>
          </View>
        )}
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: '#ddd',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    alignItems: 'center',
    marginHorizontal: '2%',
    borderRadius: 20,
    shadowColor: 'blue',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemIndex: {
    fontSize: 20,
    backgroundColor: 'red',
    borderRadius: 100,
    marginLeft: 10,
    color: 'white',
  },
  input: {
    width: '60%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopRightRadius: 8, // Top-right corner
    borderBottomRightRadius: 8, // Bottom-right corner

    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  button: {
    width: '20%',
    height: 50,
    backgroundColor: '#0066cc',
    borderTopLeftRadius: 8, // Top-Left corner
    borderBottomLeftRadius: 8, // Bottom-right corner
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
