import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showUniversities, SignUp } from '../router/data';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [universityId, setUniversityId] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [uid, setUid] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const [universities, setUniversities] = useState<any>([]);

  // Validation errors
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    password: '',
    passwordConfirmation: '',
  });

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData && JSON.parse(userData).token) {
        navigation.navigate('MainNavigator');
      }
    })();
    (async () => {
      getUniversities();
      const uid = await getOrCreateUUID();
      setUid(uid);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const getOrCreateUUID = async () => {
    try {
      const storedUUID = await AsyncStorage.getItem('device_uuid');
      if (storedUUID) {
        return storedUUID;
      } else {
        const newUUID = generateUUID();
        await AsyncStorage.setItem('device_uuid', newUUID);
        return newUUID;
      }
    } catch (error) {
      console.error('Error getting/creating UUID:', error);
      const newUUID = generateUUID();
      try {
        await AsyncStorage.setItem('device_uuid', newUUID);
      } catch (e) {
        console.error('Error saving UUID:', e);
      }
      return newUUID;
    }
  };
  const getUniversities = () => {
    showUniversities()
      .then((response) => {
        const formatted = response.data.data.map((uni: any) => ({
          label: uni.name,
          value: uni.id,
        }));
        setUniversities(formatted);
      })
      .catch((error: any) => {
        console.log(error.message);
      });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateName = (name: string) => {
    return name.trim().length >= 2;
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      university: '',
      password: '',
      passwordConfirmation: '',
    };

    let isValid = true;

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'الأسم مطلوب';
      isValid = false;
    } else if (!validateName(name)) {
      newErrors.name = 'الأسم يجب أن يكون على الأقل حرفين';
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
      isValid = false;
    }

    // Validate phone
    if (!phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
      isValid = false;
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'رقم الهاتف يجب أن يكون بين 10 و 15 رقم';
      isValid = false;
    }

    // Validate university
    if (universityId === null) {
      newErrors.university = 'يجب اختيار الجامعة';
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      newErrors.password = 'كلمة المرور مطلوبة';
      isValid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
      isValid = false;
    }

    // Validate password confirmation
    if (!passwordConfirmation.trim()) {
      newErrors.passwordConfirmation = 'تأكيد كلمة المرور مطلوب';
      isValid = false;
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = 'كلمات المرور غير متطابقة';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    Keyboard.dismiss();
    SignUp({
      email: email,
      name: name,
      phone: phone,
      university_id: universityId,
      password: password,
      password_confirmation: passwordConfirmation,
      mobile_uuid: uid,
    })
      .then(async (response) => {
        // Save user data
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
        // Save UUID to device on successful signup
        if (uid) {
          try {
            await AsyncStorage.setItem('device_uuid', uid);
          } catch (error) {
            console.error('Error saving UUID after signup:', error);
          }
        }
        setLoading(false);
        navigation.replace('MainNavigator');
      })
      .catch((error) => {
        Alert.alert('Wrong Data', error.response.data.message);
        setLoading(false);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.title}>مستخدم جديد</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="الأسم"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors({ ...errors, name: '' });
                  }
                }}
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="رقم الهاتف"
                keyboardType="numeric"
                placeholderTextColor="#aaa"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (errors.phone) {
                    setErrors({ ...errors, phone: '' });
                  }
                }}
              />
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="البريد الالكتروني"
                keyboardType="email-address"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: '' });
                  }
                }}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>
            <View style={styles.inputContainer}>
              <RNPickerSelect
                style={{
                  inputIOS: {
                    width: '90%',
                    marginStart: '5%',
                    height: 50,
                    borderWidth: 1,
                    borderColor: errors.university ? '#FF6B6B' : '#ccc',
                    borderRadius: 8,
                    textAlign: 'right',
                    paddingHorizontal: 12,
                    marginBottom: errors.university ? 4 : 16,
                    writingDirection: 'rtl',
                    backgroundColor: '#fff',
                    color: 'black',
                  },
                  inputAndroid: {
                    width: '100%',
                    color: 'black',
                    textAlign: 'right',
                    // marginStart: '5%',
                    height: 50,
                    writingDirection: 'rtl',
                    paddingHorizontal: 12,
                    marginBottom: errors.university ? 4 : 16,
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: errors.university ? '#FF6B6B' : '#ccc',
                    borderRadius: 8,
                  },
                  inputIOSContainer: {
                    zIndex: 100,
                  },
                }}
                textInputProps={{
                  textAlign: 'right',
                }}
                darkTheme={true}
                placeholder={{
                  label: 'الجامعة',
                  value: null,
                  color: '#aaa',
                }}
                onValueChange={(value: any) => {
                  setUniversityId(value);
                  if (errors.university) {
                    setErrors({ ...errors, university: '' });
                  }
                }}
                items={universities}
              />
              {errors.university ? <Text style={styles.errorText}>{errors.university}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="كلمة المرور"
                secureTextEntry
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: '' });
                  }
                }}
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.passwordConfirmation && styles.inputError]}
                placeholder="تأكيد كلمة المرور"
                secureTextEntry
                placeholderTextColor="#aaa"
                value={passwordConfirmation}
                onChangeText={(text) => {
                  setPasswordConfirmation(text);
                  if (errors.passwordConfirmation) {
                    setErrors({ ...errors, passwordConfirmation: '' });
                  }
                }}
              />
              {errors.passwordConfirmation ? (
                <Text style={styles.errorText}>{errors.passwordConfirmation}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>انشاء الحساب</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.signupText}>
              لديك حساب بالفعل؟
              <TouchableNativeFeedback onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signupLink}>تسجيل الدخول</Text>
              </TouchableNativeFeedback>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  inputContainer: {
    width: '90%',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    color: 'black',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    marginRight: 4,
    textAlign: 'right',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#0066cc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: 17,
    color: '#555',
  },
  signupLink: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
