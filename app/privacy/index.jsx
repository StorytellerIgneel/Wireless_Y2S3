import { Text, StyleSheet, View } from 'react-native';
import { PageView } from '@/components';

const PrivacyPolicy = () => {
  return (
    <>
    <PageView header="Privacy Policy" type={'back'}>
      <Text style={styles.sectionTitle}>1. Information Collection</Text>
      <Text style={styles.paragraph}>
        We collect your name, email, and reading history to provide a personalized experience. We do not collect sensitive information.
      </Text>

      <Text style={styles.sectionTitle}>2. How We Use Your Data</Text>
      <Text style={styles.paragraph}>
        Your data is used to track your reading progress, manage bookmarks, and improve your overall experience within the app.
      </Text>

      <Text style={styles.sectionTitle}>3. Data Sharing</Text>
      <Text style={styles.paragraph}>
        We do not sell or share your personal data with third parties unless required by law.
      </Text>

      <Text style={styles.sectionTitle}>4. Security</Text>
      <Text style={styles.paragraph}>
        We use standard security practices to protect your data from unauthorized access or disclosure.
      </Text>

      <Text style={styles.sectionTitle}>5. Your Rights</Text>
      <Text style={styles.paragraph}>
        You can request to view, modify, or delete your personal data at any time by contacting privacy@bookreader.com.
      </Text>

      <Text style={styles.sectionTitle}>6. Changes to this Policy</Text>
      <Text style={styles.paragraph}>
        This privacy policy may be updated from time to time. Updates will be communicated via the app.
      </Text>
    </PageView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#07314A',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#222',
  },
  paragraph: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 30,
  },
});

export default PrivacyPolicy;
