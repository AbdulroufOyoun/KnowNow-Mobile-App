import {
  Text,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  Linking,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { showMedia } from 'router/data';

export default function AboutUsScreen() {
  const [telegramUrl, setTelegramUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  useEffect(() => {
    getUrls();
  }, []);
  const getUrls = () => {
    showMedia()
      .then((res) => {
        res.data.data.forEach((item: { id: number; name: string; url: string }) => {
          if (item.name === 'telegram' && item.url) {
            setTelegramUrl(item.url);
          } else if (item.name === 'instgram' && item.url) {
            setInstagramUrl(item.url);
          } else if (item.name === 'whatsapp' && item.url) {
            setWhatsappUrl(item.url);
          }
        });
      })
      .catch((err) => {});
  };
  const openInstagram = () => {
    if (instagramUrl) {
      Linking.openURL(instagramUrl);
    }
  };
  const openTelegram = () => {
    if (telegramUrl) {
      Linking.openURL(telegramUrl);
    }
  };
  const openWhatsapp = () => {
    if (whatsappUrl) {
      Linking.openURL(whatsappUrl);
    }
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#F5F7FA" />

      <View style={styles.headerCard}>
        <Text style={styles.mainTitle}>🎓 نبذة عنا</Text>
      </View>

      <View style={styles.introCard}>
        <Text style={styles.introText}>
          أطلقنا تطبيقنا ليكون بوابتك الذكية نحو التفوق الأكاديمي. نحن منصة تعليمية متخصصة في تقديم
          كورسات لمواد الجامعات الخاصة، مصممة بعناية لتناسب احتياجات الطلاب وتواكب أحدث المناهج.
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionText}>
          هدفنا هو تسهيل الوصول إلى المعرفة، وتقديم محتوى تعليمي مبسط، شامل، ومتاح في أي وقت ومن أي
          مكان. سواء كنت تبحث عن شرح مفصل، ملخصات مركزة، أو اختبارات تدريبية، نحن هنا لنكون رفيقك في
          رحلة النجاح.
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionText}>
          نؤمن بأن التعليم ليس مجرد معلومات، بل تجربة متكاملة. لذلك، نعمل باستمرار على تطوير
          المحتوى، وتحسين تجربة المستخدم، وتوفير دعم فني وتعليمي مميز.
        </Text>
      </View>

      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>📱 تواصل معنا</Text>
        <Text style={styles.contactText}>
          ابقَ على اتصال وتابع آخر التحديثات والعروض عبر حساباتنا على وسائل التواصل الاجتماعي:
        </Text>
        <View style={styles.socialIconsContainer}>
          <TouchableWithoutFeedback onPress={openInstagram} disabled={!instagramUrl}>
            <View style={[styles.iconContainer, !instagramUrl && styles.iconDisabled]}>
              <FontAwesome
                name="instagram"
                size={40}
                color={instagramUrl ? '#E4405F' : '#8593A6'}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={openTelegram} disabled={!telegramUrl}>
            <View style={[styles.iconContainer, !telegramUrl && styles.iconDisabled]}>
              <FontAwesome name="telegram" size={40} color={telegramUrl ? '#0088cc' : '#8593A6'} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={openWhatsapp} disabled={!whatsappUrl}>
            <View style={[styles.iconContainer, !whatsappUrl && styles.iconDisabled]}>
              <FontAwesome name="whatsapp" size={40} color={whatsappUrl ? '#25D366' : '#8593A6'} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
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
  headerCard: {
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
  mainTitle: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 24,
    color: '#035AA6',
    lineHeight: 32,
  },
  introCard: {
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
    borderLeftColor: '#ACCAF2',
  },
  introText: {
    textAlign: 'right',
    fontSize: 16,
    color: '#666',
    lineHeight: 26,
  },
  sectionCard: {
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
  sectionText: {
    textAlign: 'right',
    fontSize: 16,
    color: '#666',
    lineHeight: 26,
  },
  contactCard: {
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
    marginBottom: 20,
  },
  contactTitle: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 22,
    color: '#035AA6',
    marginBottom: 12,
  },
  contactText: {
    textAlign: 'right',
    fontSize: 16,
    color: '#666',
    lineHeight: 26,
    marginBottom: 20,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#ACCAF2',
  },
  iconDisabled: {
    opacity: 0.5,
  },
});
