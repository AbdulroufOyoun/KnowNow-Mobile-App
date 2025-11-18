import { useNavigation } from '@react-navigation/native';

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { changePassword } from '../router/data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const currentDate = new Date();
const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

export default function ChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const navigation = useNavigation<any>();

  // Validation errors
  const [errors, setErrors] = useState({
    oldPassword: '',
    password: '',
    passwordConfirmation: '',
  });

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed.token != null && parsed.token_expire_at > formattedDate) {
          setToken(parsed.token);
        } else {
          navigation.navigate('Login');
        }
      } else {
        navigation.navigate('Login');
      }
    } catch {
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    const newErrors = {
      oldPassword: '',
      password: '',
      passwordConfirmation: '',
    };

    let isValid = true;

    // Validate old password
    if (!oldPassword.trim()) {
      newErrors.oldPassword = 'كلمة المرور القديمة مطلوبة';
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

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    Keyboard.dismiss();
    changePassword(
      {
        old_password: oldPassword,
        new_password: password,
        new_password_confirmation: passwordConfirmation,
      },
      token
    )
      .then((response) => {
        setLoading(false);
        Alert.alert('نجح', 'تم تغيير كلمة المرور بنجاح', [
          {
            text: 'حسناً',
            onPress: () => navigation.navigate('Home'),
          },
        ]);
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور';
        Alert.alert('خطأ', errorMessage);
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
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <StatusBar translucent barStyle="light-content" backgroundColor="#035AA6" />

            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <Ionicons name="lock-closed" size={60} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>تغيير كلمة المرور</Text>
              <Text style={styles.subtitle}>قم بتحديث كلمة المرور الخاصة بك</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, errors.oldPassword && styles.inputWrapperError]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color={errors.oldPassword ? '#FF6B6B' : '#8593A6'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="كلمة المرور القديمة"
                    secureTextEntry={!showOldPassword}
                    placeholderTextColor="#8593A6"
                    value={oldPassword}
                    onChangeText={(text) => {
                      setOldPassword(text);
                      if (errors.oldPassword) {
                        setErrors({ ...errors, oldPassword: '' });
                      }
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowOldPassword(!showOldPassword)}
                    style={styles.eyeIcon}>
                    <Ionicons
                      name={showOldPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color="#8593A6"
                    />
                  </TouchableOpacity>
                </View>
                {errors.oldPassword ? (
                  <Text style={styles.errorText}>{errors.oldPassword}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, errors.password && styles.inputWrapperError]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color={errors.password ? '#FF6B6B' : '#8593A6'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="كلمة المرور الجديدة"
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#8593A6"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) {
                        setErrors({ ...errors, password: '' });
                      }
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}>
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color="#8593A6"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.passwordConfirmation && styles.inputWrapperError,
                  ]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color={errors.passwordConfirmation ? '#FF6B6B' : '#8593A6'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="تأكيد كلمة المرور"
                    secureTextEntry={!showPasswordConfirmation}
                    placeholderTextColor="#8593A6"
                    value={passwordConfirmation}
                    onChangeText={(text) => {
                      setPasswordConfirmation(text);
                      if (errors.passwordConfirmation) {
                        setErrors({ ...errors, passwordConfirmation: '' });
                      }
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    style={styles.eyeIcon}>
                    <Ionicons
                      name={showPasswordConfirmation ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color="#8593A6"
                    />
                  </TouchableOpacity>
                </View>
                {errors.passwordConfirmation ? (
                  <Text style={styles.errorText}>{errors.passwordConfirmation}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleChangePassword}
                disabled={loading}
                activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>تغيير كلمة المرور</Text>
                )}
              </TouchableOpacity>
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
  },
  container: {
    flex: 1,
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
    flex: 1,
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
  inputWrapperError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
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
  eyeIcon: {
    marginLeft: 12,
    padding: 4,
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
});
