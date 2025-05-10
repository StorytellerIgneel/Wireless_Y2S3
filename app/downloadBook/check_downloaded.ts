import * as FileSystem from 'expo-file-system';

export const readFilesFromDocumentDirectory = async () => {
  try {
    // Get the path to the document directory
    const path = FileSystem.documentDirectory + "downloadedBooks/";
    const dirInfo = await FileSystem.getInfoAsync(path);

    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(path, { intermediates: true }); // create the directory if it doesn't exist
    }

    else if (dirInfo.exists) {
    // Read the contents of the directory
        if (path !== null){
            const files = await FileSystem.readDirectoryAsync(path);
            // Log the files (you can return this array or use it as needed)
            console.log(files);

            return files;
        }
        else{
            console.log('Document directory not found');
            return [];
        }
    }
  } catch (error) {
    console.error('Error reading files:', error);
    return [];
  }
};

// Usage
readFilesFromDocumentDirectory().then(fileNames => {
  console.log('Files in Document Directory:', fileNames);
});
