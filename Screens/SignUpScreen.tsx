import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        setTimeout(() => {
          setLoading(false);
          navigation.replace('MainNavigator');
        }, 500);
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
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}>
          <View style={styles.container}>
            <StatusBar translucent barStyle="light-content" backgroundColor="#035AA6" />

            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <Ionicons name="person-add" size={60} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>إنشاء حساب جديد</Text>
              <Text style={styles.subtitle}>انضم إلى منصة التعليم الذكية</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={22}
                    color={errors.name ? '#FF6B6B' : '#8593A6'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="الأسم"
                    placeholderTextColor="#8593A6"
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (errors.name) {
                        setErrors({ ...errors, name: '' });
                      }
                    }}
                  />
                </View>
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="call-outline"
                    size={22}
                    color={errors.phone ? '#FF6B6B' : '#8593A6'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, errors.phone && styles.inputError]}
                    placeholder="رقم الهاتف"
                    keyboardType="numeric"
                    placeholderTextColor="#8593A6"
                    value={phone}
                    onChangeText={(text) => {
                      setPhone(text);
                      if (errors.phone) {
                        setErrors({ ...errors, phone: '' });
                      }
                    }}
                  />
                </View>
                {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={22}
                    color={errors.email ? '#FF6B6B' : '#8593A6'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="البريد الالكتروني"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#8593A6"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) {
                        setErrors({ ...errors, email: '' });
                      }
                    }}
                  />
                </View>
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <View
                  style={[styles.pickerWrapper, errors.university && styles.pickerWrapperError]}>
                  <Ionicons
                    name="school-outline"
                    size={22}
                    color={errors.university ? '#FF6B6B' : '#8593A6'}
                    style={styles.inputIcon}
                  />
                  <View style={styles.pickerContainer}>
                    <RNPickerSelect
                      style={{
                        inputIOS: {
                          width: '100%',
                          height: 56,
                          textAlign: 'right',
                          paddingVertical: 0,
                          paddingRight: 0,
                          color: '#035AA6',
                          fontSize: 16,
                          writingDirection: 'rtl',
                        },
                        inputAndroid: {
                          width: '100%',
                          height: 56,
                          textAlign: 'right',
                          paddingVertical: 0,
                          paddingRight: 0,
                          color: '#035AA6',
                          fontSize: 16,
                          writingDirection: 'rtl',
                        },
                        viewContainer: {
                          flex: 1,
                        },
                        iconContainer: {
                          left: 0,
                          right: undefined,
                        },
                      }}
                      textInputProps={{
                        textAlign: 'right',
                      }}
                      darkTheme={true}
                      placeholder={{
                        label: 'الجامعة',
                        value: null,
                        color: '#8593A6',
                      }}
                      onValueChange={(value: any) => {
                        setUniversityId(value);
                        if (errors.university) {
                          setErrors({ ...errors, university: '' });
                        }
                      }}
                      items={universities}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                </View>
                {errors.university ? (
                  <Text style={styles.errorText}>{errors.university}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color={errors.password ? '#FF6B6B' : '#8593A6'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="كلمة المرور"
                    secureTextEntry
                    placeholderTextColor="#8593A6"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) {
                        setErrors({ ...errors, password: '' });
                      }
                    }}
                  />
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color={errors.passwordConfirmation ? '#FF6B6B' : '#8593A6'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, errors.passwordConfirmation && styles.inputError]}
                    placeholder="تأكيد كلمة المرور"
                    secureTextEntry
                    placeholderTextColor="#8593A6"
                    value={passwordConfirmation}
                    onChangeText={(text) => {
                      setPasswordConfirmation(text);
                      if (errors.passwordConfirmation) {
                        setErrors({ ...errors, passwordConfirmation: '' });
                      }
                    }}
                  />
                </View>
                {errors.passwordConfirmation ? (
                  <Text style={styles.errorText}>{errors.passwordConfirmation}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>إنشاء الحساب</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
                  <Text style={styles.signupLink}>تسجيل الدخول</Text>
                </TouchableOpacity>
                <Text style={styles.signupText}>لديك حساب بالفعل؟ </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    backgroundColor: '#F5F7FA',
  },
  headerSection: {
    backgroundColor: '#035AA6',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ACCAF2',
    fontWeight: '500',
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
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
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 56,
  },
  pickerWrapperError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#035AA6',
    textAlign: 'right',
    paddingVertical: 0,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    marginTop: 8,
    marginRight: 4,
    textAlign: 'right',
    fontWeight: '500',
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#035AA6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  signupText: {
    color: '#8593A6',
    fontSize: 16,
    textAlign: 'center',
  },
  signupLink: {
    color: '#035AA6',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
