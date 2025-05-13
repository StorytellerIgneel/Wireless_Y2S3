import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserContext from '@/context/UserContext';  // Assuming UserContext is used for user state management
import { PageView } from '@/components';

const FAQs = [
  {
    question: 'How do I start reading a book?',
    answer: 'To start reading a book, go to the book details page and click on "Start Reading".',
  },
  {
    question: 'How can I bookmark a page?',
    answer: 'To bookmark a page, click on the bookmark icon at the bottom of book details page.',
  },
  {
    question: 'Can I change the font size?',
    answer: 'Yes, you can change the font size through the settings in the reader screen.',
  },
  {
    question: 'How do I change the theme of the reader?',
    answer: 'You can change the theme in the reader settings or the settings to switch between different modes.',
  },
];

export default function FAQ() {
  const { user } = useContext(UserContext);
  const [activeIndex, setActiveIndex] = useState(null);

  // Function to handle the toggling of question answers
  const toggleAnswer = (index) => {
    setActiveIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <PageView header="FAQ" type={'back'}>
      <View style={styles.container}>
          {FAQs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity style={styles.question} onPress={() => toggleAnswer(index)}>
                <Text style={styles.questionText}>{faq.question}</Text>
                <Ionicons 
                  name={activeIndex === index ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="black" 
                />
              </TouchableOpacity>
              {activeIndex === index && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </PageView>     
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  faqItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  question: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  answerContainer: {
    paddingVertical: 10,
    paddingLeft: 20,
  },
  answer: {
    fontSize: 14,
    color: '#555',
  },
  messageContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  message: {
    fontSize: 14,
    color: '#ff0000',
    textAlign: 'center',
  },
});
