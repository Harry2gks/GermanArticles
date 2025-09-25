import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../lib/theme';

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: '600', color: colors.textPrimary }}>German Articles Trainer</Text>
      <Link href="/quiz" asChild>
        <Pressable style={{ padding: 12, backgroundColor: colors.surface, borderRadius: 8 }}>
          <Text style={{ color: colors.textPrimary }}>Start Quiz</Text>
        </Pressable>
      </Link>
    </View>
  );
}


