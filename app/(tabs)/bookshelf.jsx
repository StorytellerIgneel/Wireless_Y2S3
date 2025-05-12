import React, { useState, useCallback, useContext } from "react";
import {
  StyleSheet,
  Pressable,
  View,
  TextInput,
  Modal,
} from "react-native";
import { PageView, Button, Loading } from "@/components";
import BookshelfCard from "@/components/bookshelf/BookshelfCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter, useFocusEffect, Redirect } from "expo-router";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import UserContext from '@/context/UserContext';

export default function Bookshelf() {
  const { user } = useContext(UserContext);

  const [bookshelves, setBookshelves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingShelf, setEditingShelf] = useState(null);
  const [editInputValue, setEditInputValue] = useState("");

  const icon = useThemeColor({}, "text");
  const router = useRouter();
  const errorColor = useThemeColor({}, "error");
  const userId = user ? user.id : -1; 

  if (!user)
    return <Redirect href="/auth/login" />

  const fetchBookshelvesCallback = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    console.log(`${process.env.EXPO_PUBLIC_API_URL}/api/shelves/get_shelves`);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/shelves/get_shelves`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          response: `HTTP error! status: ${response.status}`,
        }));
        throw new Error(
          errorData.response || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.bookshelves && Array.isArray(data.bookshelves)) {
        const formattedShelves = data.bookshelves
          .map((shelfArray) => {
            if (Array.isArray(shelfArray) && shelfArray.length >= 3) {
              return {
                id: shelfArray[0].toString(),
              };
            }
            console.warn("Unexpected shelf format:", shelfArray);
            return null;
          })
          .filter((shelf) => shelf !== null);

        setBookshelves(formattedShelves);
      } else {
        setBookshelves([]);
        if (
          data.bookshelves === null ||
          (Array.isArray(data.bookshelves) && data.bookshelves.length === 0)
        ) {
          // This is a valid empty response
        } else {
          console.warn(
            "Received unexpected data.bookshelves format:",
            data.bookshelves
          );
        }
      }
    } catch (e) {
      console.error("Failed to fetch bookshelves:", e);
      setError(
        e.message || "An unexpected error occurred while fetching shelves."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBookshelvesCallback();
      return () => {};
    }, [fetchBookshelvesCallback])
  );

  const handleAddBookshelf = async () => {
    if (inputValue.trim()) {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/shelves/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, name: inputValue.trim() }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            response: `Failed to create shelf. Status: ${response.status}`,
          }));
          throw new Error(
            errorData.response ||
              `Failed to create shelf. Status: ${response.status}`
          );
        }
        await fetchBookshelvesCallback();
        setInputValue("");
        setModalVisible(false);
      } catch (apiError) {
        console.error("Failed to add shelf via API", apiError);
        setError(apiError.message || "Failed to add shelf.");
      }
    }
  };

  const deleteBookshelf = async (id) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/shelves/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, id: id }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          response: `Failed to delete shelf. Status: ${response.status}`,
        }));
        throw new Error(
          errorData.response ||
            `Failed to delete shelf. Status: ${response.status}`
        );
      }
      await fetchBookshelvesCallback();
    } catch (apiError) {
      console.error("Failed to delete shelf via API", apiError);
      setError(apiError.message || "Failed to delete shelf.");
    }
  };

  const openEditModal = (shelf) => {
    setEditingShelf(shelf);
    setEditInputValue(shelf.shelfTitle);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (editInputValue.trim() && editingShelf) {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/shelves/update`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              id: editingShelf.id,
              name: editInputValue.trim(),
            }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            response: `Failed to update shelf. Status: ${response.status}`,
          }));
          throw new Error(
            errorData.response ||
              `Failed to update shelf. Status: ${response.status}`
          );
        }
        await fetchBookshelvesCallback();
        setEditModalVisible(false);
        setEditingShelf(null);
        setEditInputValue("");
      } catch (apiError) {
        console.error("Failed to update shelf via API", apiError);
        setError(apiError.message || "Failed to update shelf.");
      }
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      key={item.id}
      android_ripple={{ color: "rgba(0, 0, 0, 0.20)", borderless: false }}
      onPress={() => router.push(`/(tabs)/non_tabs/booklist/shelf/${item.id}`)} // Corrected path
    >
      <BookshelfCard id={item.id} />
    </Pressable>
  );

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

  if (error) {
    return (
      <PageView header="My Shelf" type={"profile"}>
        <View style={styles.centeredMessageContainer}>
          <ThemedText
            style={{ color: errorColor, textAlign: "center", marginBottom: 10 }}
          >
            {error}
          </ThemedText>
          <Button title="Retry" onPress={fetchBookshelvesCallback} />
        </View>
      </PageView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PageView header="My Shelf" bodyStyle={styles.container} type={"profile"}>
        {isLoading ? (
          <Loading item={'shelves'}/> 
        ) : (
          bookshelves.length === 0 ? (
            <View style={styles.centeredMessageContainer}>
              <ThemedText>
                No bookshelves found. Add one to get started!
              </ThemedText>
            </View>
          ) : (
            <SwipeListView
              data={bookshelves}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              keyExtractor={(item) => item.id}
              rightOpenValue={-150}
              disableLeftSwipe={false}
              disableRightSwipe={true}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            />
          )
        )}
        
        {/* Modal for adding new bookshelf */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent]}>
              <ThemedText style={styles.modalTitle}>
                Add New Bookshelf
              </ThemedText>

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
                    setInputValue("");
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
                    setEditInputValue("");
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
    alignItems: "flex-end",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    height: "100%",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: 135,
  },
  editButton: {
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: 135,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#eee",
  },
  addButton2: {
    backgroundColor: "#07314A",
  },
  addButtonText: {
    color: "#fff",
  },
});
