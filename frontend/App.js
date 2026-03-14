import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MessageBubble from './components/MessageBubble';
import styles from './styles/chatStyles';

// CONFIGURATION – Replace with your production URL when deploying

const API_URL = 'http://192.168.1.6:3000/chat';
// For Android emulator use: 'http://10.0.2.2:3000/chat'
// For physical device use machine's LAN IP, e.g. 'http://192.168.1.5:3000/chat'

const LOADING_ID = '__loading__';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  const sendMessage = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed || sending) return;

    setInputText('');
    const userMessage = {
      id: generateId(),
      role: 'user',
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);

    const loadingMessage = {
      id: LOADING_ID,
      role: 'bot',
      text: '',
      loading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);
    setSending(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed }),
      });

      const data = await response.json().catch(() => ({}));

      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => m.id !== LOADING_ID);
        const replyText =
          data.success && typeof data.reply === 'string'
            ? data.reply
            : `Error: ${data.error || response.status || 'Invalid response'}`;
        return [
          ...withoutLoading,
          {
            id: generateId(),
            role: 'bot',
            text: replyText,
          },
        ];
      });
    } catch (err) {
      const errorMessage =
        err.message || 'Network error. Is the backend running?';
      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => m.id !== LOADING_ID);
        return [
          ...withoutLoading,
          {
            id: generateId(),
            role: 'bot',
            text: `Error: ${errorMessage}`,
          },
        ];
      });
    } finally {
      setSending(false);
    }
  }, [inputText, sending]);

  const renderItem = useCallback(({ item }) => {
    return (
      <MessageBubble
        id={item.id}
        role={item.role}
        text={item.text}
        loading={item.loading === true}
      />
    );
  }, []);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat</Text>
        </View>

        <FlatList
          ref={flatListRef}
          style={styles.chatList}
          contentContainerStyle={styles.chatListContent}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onContentSizeChange={() => {
            if (messages.length) flatListRef.current?.scrollToEnd({ animated: true });
          }}
          onLayout={() => {
            if (messages.length) flatListRef.current?.scrollToEnd({ animated: false });
          }}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={2000}
            editable={!sending}
          />
          <TouchableOpacity
            style={[styles.sendButton, sending && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={sending}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
