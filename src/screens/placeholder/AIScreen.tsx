import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { aiService, type AIMessage } from '../../services/api/aiService';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function AIScreen() {
  const { userId } = useAuthStore();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<AIMessage>>(null);

  const headerStats = useMemo(() => {
    const total = messages.length;
    return `${total} mensaje${total === 1 ? '' : 's'} en contexto`;
  }, [messages.length]);

  const sortByTime = useCallback((arr: AIMessage[]) => {
    return [...arr].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, []);

  const loadHistory = useCallback(
    async (isRefresh = false) => {
      if (!userId) { setLoading(false); setRefreshing(false); return; }
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        setError(null);
        const history = await aiService.getHistory(userId, 50, 0);
        setMessages(sortByTime(history.messages));
      } catch (e) {
        const message = e instanceof Error ? e.message : 'No se pudo cargar el historial';
        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [sortByTime, userId]
  );

  useEffect(() => {
    loadHistory().catch(() => undefined);
  }, [loadHistory]);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!userId) return;
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setError(null);
    setInput('');

    try {
      const newItem = await aiService.sendMessage(userId, text);
      setMessages((prev) => sortByTime([...prev, newItem]));
    } catch (e) {
      const message = e instanceof Error ? e.message : 'No se pudo enviar el mensaje';
      setError(message);
      setInput(text);
    } finally {
      setSending(false);
    }
  }, [input, sending, sortByTime, userId]);

  const handleClearHistory = useCallback(() => {
    if (!userId) return;
    Alert.alert('Limpiar chat', 'Se eliminara todo tu historial con la IA.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await aiService.deleteHistory(userId);
            setMessages([]);
          } catch (e) {
            const message = e instanceof Error ? e.message : 'No se pudo limpiar el historial';
            setError(message);
          }
        },
      },
    ]);
  }, [userId]);

  const renderItem = ({ item }: { item: AIMessage }) => (
    <View style={styles.messagePair}>
      <View style={[styles.bubble, styles.userBubble]}>
        <Text style={styles.userLabel}>Tu</Text>
        <Text style={styles.userText}>{item.userMessage}</Text>
      </View>

      <View style={[styles.bubble, styles.aiBubble]}>
        <View style={styles.aiHeaderRow}>
          <Ionicons name="sparkles" size={14} color={colors.gold} />
          <Text style={styles.aiLabel}>TasteMap IA</Text>
        </View>
        <Text style={styles.aiText}>{item.aiResponse}</Text>
        <Text style={styles.timeText}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
    </View>
  );

  if (!userId) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <Ionicons name="person-outline" size={52} color={colors.gold} />
          <Text style={styles.emptyTitle}>Inicia sesión</Text>
          <Text style={styles.emptySubtitle}>
            Debes iniciar sesión para acceder al asistente IA.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      <ScreenContainer noPadding>
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="sparkles" size={24} color={colors.orange} />
              <Text style={styles.title}>Asistente IA</Text>
            </View>

            <Pressable onPress={handleClearHistory} style={styles.clearButton}>
              <Ionicons name="trash-outline" size={15} color={colors.textMuted} />
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Cuentame que antojo tienes y te recomiendo lugares segun tu gusto.
          </Text>
          <Text style={styles.stats}>{headerStats}</Text>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.gold} size="large" />
            <Text style={styles.loadingText}>Cargando conversacion...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.listContent,
              messages.length === 0 ? styles.listContentEmpty : null,
            ]}
            onRefresh={() => {
              loadHistory(true).catch(() => undefined);
            }}
            refreshing={refreshing}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={34} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>Inicia una conversacion</Text>
                <Text style={styles.emptySubtitle}>
                  Ejemplo: "quiero una hamburguesa caliente cerca de mi"
                </Text>
              </View>
            }
          />
        )}

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.orange} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu antojo..."
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            editable={!sending}
            multiline
            maxLength={280}
          />
          <Pressable
            style={[styles.sendButton, (!input.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <Ionicons name="send" size={17} color={colors.background} />
            )}
          </Pressable>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
  },
  headerCard: {
    margin: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: colors.card,
    padding: spacing.lg,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.serif,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.body,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  stats: {
    marginTop: spacing.sm,
    color: colors.gold,
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.body,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.round,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  clearButtonText: {
    color: colors.textMuted,
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.body,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontFamily: typography.fontFamily.serif,
    fontWeight: typography.weight.bold,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.body,
    textAlign: 'center',
  },
  messagePair: {
    gap: spacing.sm,
  },
  bubble: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '90%',
    borderColor: 'rgba(201,169,110,0.35)',
    backgroundColor: 'rgba(201,169,110,0.12)',
  },
  aiBubble: {
    alignSelf: 'stretch',
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: colors.cardAlt,
  },
  userLabel: {
    color: colors.gold,
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.body,
    marginBottom: spacing.xs,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  aiLabel: {
    color: colors.gold,
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.body,
  },
  userText: {
    color: colors.textPrimary,
    fontSize: typography.size.base,
    fontFamily: typography.fontFamily.body,
    lineHeight: 21,
  },
  aiText: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.body,
    lineHeight: 22,
  },
  timeText: {
    marginTop: spacing.sm,
    alignSelf: 'flex-end',
    color: colors.textMuted,
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.body,
  },
  errorBox: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.3)',
    backgroundColor: 'rgba(255,107,53,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  errorText: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.body,
  },
  inputWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: colors.bottomNavBackground,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.base,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: radius.round,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
