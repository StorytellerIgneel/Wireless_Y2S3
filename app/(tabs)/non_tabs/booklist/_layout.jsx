import { Stack } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';

export default function BooklistLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[book-id]"
        options={{
          header: ({ options }) =>
            <CustomHeader title={options.title || 'Book Details'} />,
        }}
      />
      <Stack.Screen
        name="search_result"
        options={{
          header: ({ options }) =>
            <CustomHeader title={options.title || 'Booklist'} />,
        }}
      />
    </Stack>
  );
}