import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, colors, fontFamilies, Hairline, shadows, spacing, Text } from '@/components';
import { Icon } from '@/components/onboarding';
import { useTranslation, type Gender } from '@/i18n';
import { stylistChat, type ChatMessage } from '@/lib/ai';
import { pieceToClosetPiece, usePieces, useProfile } from '@/lib/hooks';

function Avatar({ size = 36 }: { size?: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Icon name="sparkle" size={size * 0.5} color={colors.gold} />
    </View>
  );
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: string }) {
  const me = role === 'user';
  return (
    <View style={[styles.row, me ? styles.rowMe : styles.rowThem]}>
      {!me ? <Avatar size={30} /> : null}
      <View style={[styles.bubble, me ? styles.bubbleMe : styles.bubbleThem]}>
        <Text variant="body" color={me ? colors.paper : colors.ink} style={styles.bubbleText}>
          {children}
        </Text>
      </View>
    </View>
  );
}

export default function StylistScreen() {
  const { t } = useTranslation();
  const s = t.stylist;
  const { data: profile } = useProfile();
  const { data: pieces } = usePieces();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const chips = [s.chip1, s.chip2, s.chip3];

  const complete = async (history: ChatMessage[]) => {
    setLoading(true);
    setError(false);
    try {
      const { reply } = await stylistChat({
        messages: history,
        analysis: profile?.analysis
          ? {
              body_type: profile.analysis.body_type,
              proportions: profile.analysis.proportions,
              skin_tone: profile.analysis.skin_tone,
              color_season: profile.analysis.color_season,
              color_palette: profile.analysis.color_palette,
            }
          : undefined,
        styleIdentity: profile?.style_identity?.name
          ? { name: profile.style_identity.name, description: profile.style_identity.description }
          : undefined,
        closet: pieces?.map(pieceToClosetPiece),
        context: { gender: (profile?.gender ?? 'unspecified') as Gender },
      });
      setMessages([...history, { role: 'assistant', content: reply }]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const send = (text: string) => {
    const value = text.trim();
    if (!value || loading) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: value }];
    setMessages(next);
    setInput('');
    void complete(next);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Avatar size={40} />
        <View style={styles.headerText}>
          <Text variant="label" style={styles.headerTitle}>
            {s.title}
          </Text>
          <Text variant="labelSm" color={colors.secondary}>
            {s.subtitle}
          </Text>
        </View>
        <View style={styles.onlineDot} />
      </View>
      <Hairline />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          <Bubble role="assistant">{s.greeting}</Bubble>
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role}>
              {m.content}
            </Bubble>
          ))}
          {loading ? <Bubble role="assistant">{s.thinking}</Bubble> : null}
          {error ? (
            <View style={styles.errorRow}>
              <Text variant="labelSm" color={colors.secondary}>
                {s.error}
              </Text>
              <Pressable onPress={() => complete(messages)} hitSlop={8}>
                <Text variant="label" color={colors.gold}>
                  {t.common.retry}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          style={styles.chipsRow}
        >
          {chips.map((c) => (
            <Chip key={c} label={c} onPress={() => send(c)} />
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={s.placeholder}
            placeholderTextColor={colors.secondary}
            style={[styles.input, { writingDirection: 'rtl' }]}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => send(input)}
            style={[styles.send, !input.trim() && styles.sendDisabled]}
            disabled={!input.trim() || loading}
          >
            <Icon name="send" size={20} color={colors.paper} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.g11, paddingHorizontal: spacing.g22, paddingTop: spacing.lg, paddingBottom: spacing.md },
  headerText: { flex: 1 },
  headerTitle: { fontFamily: fontFamilies.sansSemibold, fontSize: 16 },
  onlineDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: colors.gold },
  avatar: { backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  messages: { paddingHorizontal: spacing.g22, paddingTop: spacing.g20, gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, maxWidth: '88%' },
  rowMe: { alignSelf: 'flex-end' },
  rowThem: { alignSelf: 'flex-start' },
  // The bubble leans toward its speaker: user notches its bottom-END corner, the
  // stylist notches its bottom-START corner (beside the avatar). Matches the gallery.
  bubble: { maxWidth: 250, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 18 },
  bubbleMe: { backgroundColor: colors.ink, borderBottomEndRadius: 6 },
  bubbleThem: { backgroundColor: colors.white, borderBottomStartRadius: 6, ...shadows.card },
  bubbleText: { fontSize: 14.5, lineHeight: 21 },
  errorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.sm },
  chipsRow: { flexGrow: 0 },
  chips: { paddingHorizontal: spacing.g22, gap: spacing.g9, paddingBottom: spacing.g12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.g22, paddingBottom: spacing.g16 },
  input: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.paper,
    paddingHorizontal: 20,
    fontSize: 15,
    color: colors.ink,
  },
  send: { width: 52, height: 52, borderRadius: 999, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...shadows.pill },
  sendDisabled: { opacity: 0.4 },
});
