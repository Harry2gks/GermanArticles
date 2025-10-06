import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../lib/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Home() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, backgroundColor: colors.background }}>
      <View style={{ position: 'absolute', top: 50, right: 20 }}>
        <ThemeToggle />
      </View>
      <Text style={{ fontSize: 24, fontWeight: '600', color: colors.textPrimary }}>German Articles Trainer</Text>
      <Link href="/quiz" asChild>
        <Pressable style={({ pressed }) => [
          { 
            padding: 12, 
            backgroundColor: colors.accent, 
            borderRadius: 8,
            opacity: pressed ? 0.8 : 1,
            transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }]
          }
        ]}>
          <Text style={{ color: colors.background, fontWeight: '600' }}>Start Quiz</Text>
        </Pressable>
      </Link>
    </View>
  );
}


