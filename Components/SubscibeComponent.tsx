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
        .catch(() => {
          setError(true);
          setCode('');
        });
    }
  };
  return (
    <View style={styles.container}>
      <>
        {!subscribed ? (
          <View style={styles.subscribeContainer}>
            <Text style={styles.title}>أدخل كود الأشتراك</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={[styles.button, code.length !== 8 && styles.buttonDisabled]}
                onPress={subscribeCourse}
                disabled={code.length !== 8}
                activeOpacity={0.8}>
                <Text style={styles.buttonText}>تأكيد</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="كود التفعيل"
                placeholderTextColor="#8593A6"
                value={code}
                onChangeText={(text) => {
                  setCode(text);
                  setError(false);
                }}
                maxLength={8}
              />
            </View>
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                (الكورس يُقدَّم لمرة واحدة فقط، وفي حال عدم اجتيازه، يتطلب التسجيل من جديد بالرسوم
                كاملة )
              </Text>
            </View>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>كود التفعيل خطأ</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.subscribedContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={80} color="#035AA6" />
            </View>
            <Text style={styles.subscribedText}>أنت مشترك بالفعل</Text>
            <Text style={styles.subscribedSubtext}>يمكنك الآن الوصول إلى جميع محتويات الدورة</Text>
          </View>
        )}
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 20,
  },
  subscribeContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  title: {
    textAlign: 'right',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#035AA6',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: '#ACCAF2',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#035AA6',
    textAlign: 'right',
  },
  button: {
    width: 120,
    height: 56,
    backgroundColor: '#035AA6',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#8593A6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#457ABF',
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  warningText: {
    fontSize: 14,
    textAlign: 'right',
    color: '#8593A6',
    lineHeight: 22,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  subscribedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: '#ACCAF2',
    borderRadius: 60,
    padding: 20,
  },
  subscribedText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#035AA6',
    marginBottom: 12,
  },
  subscribedSubtext: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8593A6',
    lineHeight: 24,
  },
});
