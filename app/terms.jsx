import { PageView } from '@/components';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

const LegalScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <PageView header="Terms & Conditions">
        <Text style={styles.title}>Terms & Conditions</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to BookReader! By using this app, you agree to the following terms and conditions. Please read them carefully.
        </Text>

        <Text style={styles.sectionTitle}>2. Use of the App</Text>
        <Text style={styles.paragraph}>
          You agree to use BookReader for lawful purposes only. You may not engage in any activity that interferes with or disrupts the app’s services.
        </Text>

        <Text style={styles.sectionTitle}>3. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          All content in BookReader, including but not limited to text, graphics, logos, and software, is the property of BookReader or its content providers and is protected by intellectual property laws.
        </Text>

        <Text style={styles.sectionTitle}>4. Termination</Text>
        <Text style={styles.paragraph}>
          We may terminate or suspend your access to the app without prior notice or liability for any reason.
        </Text>

        <Text style={styles.sectionTitle}>5. Modifications</Text>
        <Text style={styles.paragraph}>
          We reserve the right to update or modify these terms at any time. Continued use of the app constitutes acceptance of the new terms.
        </Text>

        <Text style={styles.sectionTitle}>6. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions about these terms, contact us at support@bookreader.com.
        </Text>

        {/* Divider */}
        <View style={styles.divider} />

        <Text style={styles.title}>Privacy Policy</Text>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
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

export default LegalScreen;
