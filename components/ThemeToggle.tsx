import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../lib/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: colors.surface,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.accent,
          opacity: pressed ? 0.8 : 1,
          transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
        }
      ]}
    >
      <Text style={{ 
        color: colors.textPrimary, 
        fontSize: 16, 
        fontWeight: '600',
        marginRight: 8 
      }}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </Text>
      <Text style={{ 
        color: colors.textPrimary, 
        fontSize: 14, 
        fontWeight: '500' 
      }}>
        {theme === 'dark' ? 'Dark' : 'Light'}
      </Text>
    </Pressable>
  );
}
