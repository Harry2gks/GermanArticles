import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, Animated, Easing, Platform } from 'react-native';
import { useTheme } from '../lib/ThemeContext';
import { getShadows } from '../lib/theme';
import { ThemeToggle } from '../components/ThemeToggle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nextReview, CardState } from '../lib/srs';
// Load data from the merged data.json file with single "words" array
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadRawLines(): string[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data = require('../data.json') as any;
    // New structure: { "words": [...] }
    if (data.words && Array.isArray(data.words)) {
      return data.words;
    }
    // Fallback to old structure for backward compatibility
    if (Array.isArray(data)) {
      return data;
    }
    // Legacy structure with separate arrays
    return [ ...(data?.A1 ?? []), ...(data?.A2 ?? []), ...(data?.B1 ?? []), ...(data?.B2 ?? []), ...(data?.C1 ?? []), ...(data?.C2 ?? []) ];
  } catch {
    return [];
  }
}
const bigData = loadRawLines();

type Noun = { id: string; word: string; gender: 'der' | 'die' | 'das'; translation?: string; plural?: string; category?: string };
const STORAGE_KEY = 'progress:v1';

function parseLineToNoun(line: string, index: number): Noun | null {
  // Expected: article:german:translation, synonyms/explanation
  const trimmed = line.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(':');
  if (parts.length < 2) return null;
  const article = String(parts[0]).toLowerCase();
  const word = parts[1];
  if (!word) return null;
  const gender = article.startsWith('der') ? 'der' : article.startsWith('die') ? 'die' : 'das';
  const rawTrans = parts[2] ?? '';
  const translation = String(rawTrans).split(',')[0]?.trim() || '';
  return { id: `${gender}:${word}:${index}`, word, gender, translation };
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildNouns(): Noun[] {
  const source = bigData as unknown as string[] | undefined;
  if (!source || source.length === 0) return [];
  const parsed = source.map((line, i) => parseLineToNoun(line, i)).filter(Boolean) as Noun[];
  return shuffle(parsed);
}

// More reliable platform detection
const isWeb = Platform.OS === 'web' || (typeof window !== 'undefined' && window.document);
const isMobile = !isWeb;

export default function Quiz() {
  const { colors, theme } = useTheme();
  const shadows = getShadows(theme);
  const [progress, setProgress] = useState<Record<string, CardState>>({});
  const [nouns, setNouns] = useState<Noun[]>(buildNouns());
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const current = nouns[idx];

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(JSON.parse(raw));
    })();
  }, []);

  useEffect(() => {
    const next = buildNouns();
    if (next.length > 0) {
      setNouns(next);
      setIdx(0);
      setSelected(null);
    }
  }, []);

  const choices = useMemo(() => ['der', 'die', 'das'].sort(() => Math.random() - 0.5), [idx]);

  async function save(p: Record<string, CardState>) {
    setProgress(p);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }

  function commitGradeAndAdvance(g: 0 | 1 | 2) {
    if (!current) return;
    const prev = progress[current.id] ?? { id: current.id, interval: 1, ease: 2.5, streak: 0, nextDue: 0 };
    const updated = nextReview(prev, g);
    const next = { ...progress, [current.id]: updated };
    void save(next);
    setSelected(null);
    setIdx((i) => (i + 1) % nouns.length);
  }

  function onChoicePress(choice: 'der' | 'die' | 'das') {
    if (!current) return;
    const isCorrect = choice === current.gender;
    setSelected(choice);
    if (isCorrect) {
      // brief delay to show green highlight
      setTimeout(() => commitGradeAndAdvance(2), 350);
    } else {
      // wrong: highlight wrong (red) and correct (green), then auto-advance after 1.2s
      setTimeout(() => commitGradeAndAdvance(1), 1200);
    }
  }

  if (!current) return null;

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', gap: 24, backgroundColor: colors.background }}>
      <View style={{ position: 'absolute', top: 50, right: 20 }}>
        <ThemeToggle />
      </View>
      <Text style={{ fontSize: 36, fontWeight: '700', textAlign: 'center', color: colors.textPrimary }}>{current.word}</Text>
      {!!current.translation && (
        <Text style={{ fontSize: 18, textAlign: 'center', color: colors.textSecondary }}>{current.translation}</Text>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
        {choices.map((c) => {
          const isCorrect = c === current.gender;
          const isSelected = selected === c;
          // Base styles
          let bg = colors.surface;
          let shadowColor = 'transparent';
          let shadowRadius = 0;
          let shadowOpacity = 0;
          
          // Platform-specific feedback styling
          if (isWeb) {
            // Web: Use background color for feedback (no box shadows in light mode)
            if (selected) {
              if (isSelected && isCorrect) {
                bg = colors.correct; // Green background
              } else if (isSelected && !isCorrect) {
                bg = colors.wrong; // Red background
              } else if (!isSelected && isCorrect && selected !== current.gender) {
                bg = colors.correct; // Green background for correct answer
              }
            }
          } else {
            // Mobile: Use background color for feedback
            if (selected) {
              if (isSelected && isCorrect) {
                bg = colors.correct; // Green background
              } else if (isSelected && !isCorrect) {
                bg = colors.wrong; // Red background
              } else if (!isSelected && isCorrect && selected !== current.gender) {
                bg = colors.correct; // Green background for correct answer
              }
            }
          }
          
          return (
            <Animated.View
              key={c}
              style={{ 
                transform: [{ scale: isWeb ? 1 : (isSelected ? 0.98 : 1) }], 
                borderRadius: 8 
              }}
            >
              <Pressable
                onPress={() => {
                  // Mobile: Use scale animation
                  if (isMobile) {
                    Animated.sequence([
                      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, easing: Easing.out(Easing.quad), useNativeDriver: true }),
                      Animated.timing(scaleAnim, { toValue: 1, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }),
                    ]).start();
                  }
                  
                  if (selected && selected !== current.gender && !isCorrect) {
                    setSelected(c);
                    return;
                  }
                  if (isCorrect && selected && selected !== current.gender) {
                    setSelected(c);
                    setTimeout(() => commitGradeAndAdvance(1), 250);
                    return;
                  }
                  onChoicePress(c as 'der' | 'die' | 'das');
                }}
                style={({ pressed }) => [
                  { 
                    paddingVertical: 10, 
                    paddingHorizontal: 16, 
                    backgroundColor: bg, 
                    borderRadius: 8,
                    // Hover effect for web only
                    ...(isWeb && {
                      cursor: 'pointer',
                      transitionProperty: 'transform, box-shadow',
                      transitionDuration: '150ms',
                    } as any)
                  },
                  // Pressed state - different for each platform
                  pressed && isMobile && {
                    transform: [{ scale: 0.95 }]
                  }
                ]}
                {...(isWeb && {
                  onHoverIn: (e: any) => {
                    const t = (e?.target as unknown as HTMLElement) || null;
                    if (t) {
                      t.style.transform = 'translateY(-2px)';
                    }
                  },
                  onHoverOut: (e: any) => {
                    const t = (e?.target as unknown as HTMLElement) || null;
                    if (t) {
                      t.style.transform = 'translateY(0)';
                    }
                  }
                })}
              >
                <Text style={{ color: colors.textPrimary, fontSize: 18, fontFamily: 'sans-serif' }}>{c}</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
      <Pressable 
        onPress={() => commitGradeAndAdvance(1)} 
        style={({ pressed }) => [
          { 
            alignSelf: 'center', 
            marginTop: 8,
            // Hover effect for web only
            ...(isWeb && {
              cursor: 'pointer',
              transitionProperty: 'transform',
              transitionDuration: '200ms',
              transitionTimingFunction: 'ease-out',
            } as any)
          },
          // Pressed state - jump up animation for mobile
          pressed && isMobile && {
            transform: [{ translateY: -3 }]
          }
        ]}
        onHoverIn={(e: any) => {
          if (isWeb) {
            const t = (e?.target as unknown as HTMLElement) || null;
            if (t) {
              t.style.transform = 'translateY(-3px)';
            }
          }
        }}
        onHoverOut={(e: any) => {
          if (isWeb) {
            const t = (e?.target as unknown as HTMLElement) || null;
            if (t) {
              t.style.transform = 'translateY(0)';
            }
          }
        }}
      >
        <Text style={{ color: colors.textSecondary, fontFamily: 'sans-serif' }}>I am not sure</Text>
      </Pressable>
    </View>
  );
}

