import { Text, ScrollView, StatusBar, StyleSheet, View } from 'react-native';

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#F5F7FA" />

      <View style={styles.headerCard}>
        <Text style={styles.mainTitle}>🎓 سياسة الخصوصية لتطبيق تعلم الآن</Text>
      </View>

      <View style={styles.introCard}>
        <Text style={styles.introText}>
          نحن في تعلم الآن نولي أهمية قصوى لخصوصية بياناتك الشخصية وحمايتها. تصف هذه السياسة كيف
          نجمع ونستخدم ونحمي ونكشف عن معلوماتك الشخصية عند استخدامك لتطبيقنا والخدمات التعليمية
          الجامعية التي يقدمها. باستخدامك للتطبيق، فإنك توافق على ممارسات جمع واستخدام البيانات
          الموضحة في هذه السياسة.
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>1. المعلومات التي نقوم بجمعها</Text>
        <Text style={styles.sectionText}>
          نقوم بجمع نوعين أساسيين من المعلومات لتمكين تقديم خدماتنا التعليمية وتحسينها:
        </Text>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>•</Text>
          <Text style={styles.bulletContent}>
            المعلومات الشخصية التي تقدمها مباشرة (عند التسجيل والاشتراك): تشمل الاسم الكامل، البريد
            الإلكتروني، كلمة المرور، رقم الهاتف، اسم الجامعة، الكلية، معلومات الدفع، والمحتوى الذي
            تنشئه مثل التعليقات والأسئلة.
          </Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>•</Text>
          <Text style={styles.bulletContent}>
            معلومات الاستخدام والبيانات الأكاديمية التي يتم جمعها تلقائيًا: مثل نوع الجهاز، نظام
            التشغيل، وسلوك الاستخدام داخل التطبيق، معرف الجهاز الفريد (Device UUID)، ورمز الإشعارات
            (FCM Token) لإرسال الإشعارات المهمة.
          </Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>2. كيف نستخدم معلوماتك</Text>
        <Text style={styles.sectionText}>
          نستخدم البيانات لتقديم الخدمات التعليمية، التحقق من الهوية، تسهيل الدفع، تقديم الدعم
          الفني، تحسين التطبيق، والتواصل معك بشأن الكورسات والمواعيد والتحديثات.
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>3. مشاركة وكشف المعلومات</Text>
        <Text style={styles.sectionText}>لا نبيع أو نؤجر بياناتك الشخصية. نشارك البيانات مع:</Text>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>•</Text>
          <Text style={styles.bulletContent}>
            مزودي الخدمات التقنية: نستخدم خدمات Firebase (Google) لإدارة الإشعارات والبنية التحتية
            للتطبيق. تخضع هذه البيانات لسياسة خصوصية Google.
          </Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>•</Text>
          <Text style={styles.bulletContent}>
            الخادم الخاص بنا: يتم تخزين بياناتك على خوادمنا الآمنة لتقديم الخدمة التعليمية.
          </Text>
        </View>
        <Text style={styles.sectionText}>
          نشارك البيانات فقط عند الضرورة القانونية أو لحماية حقوقنا ومستخدمي التطبيق.
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>4. أمن البيانات وحمايتها</Text>
        <Text style={styles.sectionText}>
          نتخذ إجراءات أمنية لحماية بياناتك، بما في ذلك التشفير أثناء النقل والتخزين، ونحتفظ بها فقط
          للفترة اللازمة لتقديم الخدمة أو حسب القوانين المعمول بها.
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>5. حقوق المستخدم</Text>
        <Text style={styles.sectionText}>لديك الحق في:</Text>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>•</Text>
          <Text style={styles.bulletContent}>الوصول إلى بياناتك الشخصية المحفوظة في التطبيق</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>•</Text>
          <Text style={styles.bulletContent}>تصحيح البيانات إذا كانت غير دقيقة أو غير مكتملة</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>•</Text>
          <Text style={styles.bulletContent}>طلب حذف بياناتك من خلال التواصل مع الدعم التقني</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>•</Text>
          <Text style={styles.bulletContent}>إلغاء الاشتراك في الإشعارات من إعدادات التطبيق</Text>
        </View>
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ عند محاولة تسجيل الدخول من حساب معين بجهاز اخر سيتم حظر الحساب حتى يتم التواصل مع
            الدعم التقني.
          </Text>
        </View>
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ عند التسجيل بكورس يسمح للطالب بالوصول للمحتوى الخاص به فقط لفصل واحد وفي حال طلب
            الطالب للكورس مرة اخرى يدفع الرسوم كاملة
          </Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>6. التواصل وتعديلات السياسة</Text>
        <Text style={styles.sectionText}>
          إذا كان لديك أي استفسار، يمكنك التواصل معنا عبر حسابات التواصل الاجتماعي الموجودة في صفحة
          {' "نبذة عنا" '}. نحتفظ بحق تعديل هذه السياسة من وقت لآخر، وسيتم إعلامك بأي تغييرات هامة.
        </Text>
      </View>

      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>📱 تواصل معنا</Text>
        <Text style={styles.contactText}>
          ابقَ على اتصال وتابع آخر التحديثات والعروض عبر حساباتنا على وسائل التواصل الاجتماعي.
        </Text>
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
  sectionTitle: {
    textAlign: 'right',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#035AA6',
    marginBottom: 12,
  },
  sectionText: {
    textAlign: 'right',
    fontSize: 16,
    color: '#666',
    lineHeight: 26,
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletText: {
    fontSize: 20,
    color: '#3F83BF',
    marginRight: 12,
    marginTop: 2,
  },
  bulletContent: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    color: '#666',
    lineHeight: 26,
  },
  warningBox: {
    backgroundColor: '#ACCAF2',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#457ABF',
  },
  warningText: {
    textAlign: 'right',
    fontSize: 15,
    color: '#035AA6',
    lineHeight: 24,
    fontWeight: '500',
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
  },
});
