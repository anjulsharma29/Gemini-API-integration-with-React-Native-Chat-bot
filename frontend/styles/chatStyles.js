import { StyleSheet, Platform } from 'react-native';

// Soft, minimalistic color palette
const colors = {
  background: '#f8f9fa',
  surface: '#ffffff',
  userBubble: '#dcf8c6',
  botBubble: '#ffffff',
  userText: '#1a1a1a',
  botText: '#2d2d2d',
  border: '#e8e8e8',
  inputBg: '#ffffff',
  sendButton: '#34c759',
  sendButtonDisabled: '#b0e0b0',
  loadingDot: '#34c759',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 48 : 36,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.botText,
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chatListContent: {
    paddingBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: colors.inputBg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 12,
    paddingTop: 12,
    fontSize: 16,
    color: colors.botText,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.sendButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.sendButtonDisabled,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: colors.userBubble,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 20,
  },
  bubbleBot: {
    backgroundColor: colors.botBubble,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  bubbleLoading: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.botText,
  },
  messageTextUser: {
    color: colors.userText,
  },
});

export { colors };
