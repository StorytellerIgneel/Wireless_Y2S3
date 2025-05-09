import React, { useState, useEffect } from "react";
import { StyleSheet, Pressable, View, TextInput, Modal, Platform, UIManager, LayoutAnimation } from "react-native";
import { PageView, Button } from "@/components";
import BookshelfCard from "@/components/bookshelf/BookshelfCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";

// Enable animations for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Sample book data - can be reused for all shelves or customized per shelf
const sampleBooks = [
  require("@/assets/images/bookImage.jpg"),
  require("@/assets/images/bookImage.jpg"),
  require("@/assets/images/bookImage.jpg"),
  require("@/assets/images/bookImage.jpg"),
  require("@/assets/images/bookImage.jpg"),
];

// Sample data for multiple bookshelves
const initialBookshelfData = [
  {
    id: "1",
    shelfTitle: "Currently Reading",
    books: sampleBooks.slice(0, 3),
    percentage: 75,
  },
  {
    id: "2",
    shelfTitle: "To Read",
    books: sampleBooks.slice(0, 4),
    percentage: 10,
  },
  {
    id: "3",
    shelfTitle: "Fantasy Collection",
    books: sampleBooks.slice(0, 2),
    percentage: 90,
  },
  {
    id: "4",
    shelfTitle: "Sci-Fi Adventures",
    books: sampleBooks,
    percentage: 45,
  },
];

export default function Bookshelf() {
  const [bookshelves, setBookshelves] = useState(initialBookshelfData);
  const [inputValue, setInputValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  // New state variables for editing
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingShelf, setEditingShelf] = useState(null);
  const [editInputValue, setEditInputValue] = useState('');
  
  const icon = useThemeColor({}, "text");
  const router = useRouter();

  const handleAddBookshelf = () => {
    if (inputValue.trim()) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const newShelf = {
        id: `${Date.now()}`,
        shelfTitle: inputValue,
        books: [],
        percentage: 0,
      };
      setBookshelves([...bookshelves, newShelf]);
      setInputValue('');
      setModalVisible(false);
    }
  };

  const deleteBookshelf = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBookshelves(bookshelves.filter(shelf => shelf.id !== id));
  };

  // New function to open edit modal
  const openEditModal = (shelf) => {
    setEditingShelf(shelf);
    setEditInputValue(shelf.shelfTitle);
    setEditModalVisible(true);
  };

  // New function to save edited bookshelf name
  const handleSaveEdit = () => {
    if (editInputValue.trim() && editingShelf) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setBookshelves(bookshelves.map(shelf => 
        shelf.id === editingShelf.id 
          ? { ...shelf, shelfTitle: editInputValue } 
          : shelf
      ));
      setEditModalVisible(false);
      setEditingShelf(null);
      setEditInputValue('');
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      key={item.id}
      android_ripple={{ color: "rgba(0, 0, 0, 0.20)", borderless: false }}
      onPress={() => router.push(`/non_tabs/booklist/shelf/${item.id}`)}
    >
      <BookshelfCard
        id={item.id}
        books={item.books}
        percentage={item.percentage}
        shelfTitle={item.shelfTitle}
      />
    </Pressable>
  );

  // Updated to include both edit and delete buttons
  const renderHiddenItem = (data) => (
    <View style={styles.hiddenContainer}>
      <Pressable
        style={styles.editButton}
        onPress={() => openEditModal(data.item)}
      >
        <Ionicons name="pencil-outline" size={24} color="white" />
      </Pressable>
      <Pressable
        style={styles.deleteButton}
        onPress={() => deleteBookshelf(data.item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </Pressable>
    </View>
  );

  return (
    <PageView header="My Shelf" bodyStyle={styles.container}>
      <SwipeListView
        data={bookshelves}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        keyExtractor={(item) => item.id}
        rightOpenValue={-150}  // Updated to make space for both buttons
        disableLeftSwipe={false}
        disableRightSwipe={true}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.buttonWrapper}>
        <Button
          type={"secondary"}
          active
          circle
          style={[styles.addButton, { color: icon }]}
          icon={"add-outline"}
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Modal for adding new bookshelf */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent]}>
            <ThemedText style={styles.modalTitle}>Add New Bookshelf</ThemedText>
            
            <TextInput
              style={styles.input}
              placeholder="Bookshelf name"
              value={inputValue}
              onChangeText={setInputValue}
              placeholderTextColor="#999"
            />
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setInputValue('');
                }}
              >
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.addButton2]}
                onPress={handleAddBookshelf}
              >
                <ThemedText style={styles.addButtonText}>Add</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* New modal for editing bookshelf name */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent]}>
            <ThemedText style={styles.modalTitle}>Edit Bookshelf</ThemedText>
            
            <TextInput
              style={styles.input}
              placeholder="Bookshelf name"
              value={editInputValue}
              onChangeText={setEditInputValue}
              placeholderTextColor="#999"
            />
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingShelf(null);
                  setEditInputValue('');
                }}
              >
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.addButton2]}
                onPress={handleSaveEdit}
              >
                <ThemedText style={styles.addButtonText}>Save</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonWrapper: {
    position: "absolute",
    width: 55,
    height: 55,
    alignSelf: "center",
    bottom: 10,
    borderRadius: 100,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  addButton: {
    marginTop: 0,
    width: 55,
    height: 55,
  },
  hiddenContainer: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: '100%',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center', 
    width: 75,
    height: 135,
  },
  editButton: {
    backgroundColor: '#3498db', 
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: 135,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  addButton2: {
    backgroundColor: '#07314A',
  },
  addButtonText: {
    color: '#fff',
  },
});
