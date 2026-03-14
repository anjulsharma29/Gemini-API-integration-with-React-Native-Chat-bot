import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import styles, { colors } from '../styles/chatStyles';

/**
 * Renders a single chat message or loading indicator.
 * @param {Object} props
 * @param {string} props.id - Unique message id
 * @param {"user" | "bot"} props.role - Sender of the message
 * @param {string} props.text - Message content (empty when loading)
 * @param {boolean} [props.loading] - If true, shows animated loading dots
 */
export default function MessageBubble({ id, role, text, loading }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const isUser = role === 'user';

  useEffect(() => {
    if (!loading) return;
    const animate = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 150);
    const a3 = animate(dot3, 300);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [loading, dot1, dot2, dot3]);

  const opacity = (anim) =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.35, 1],
    });

  return (
    <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleBot,
          loading && styles.bubbleLoading,
        ]}
      >
        {loading ? (
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Animated.View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.loadingDot,
                opacity: opacity(dot1),
              }}
            />
            <Animated.View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.loadingDot,
                opacity: opacity(dot2),
              }}
            />
            <Animated.View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.loadingDot,
                opacity: opacity(dot3),
              }}
            />
          </View>
        ) : (
          <Text
            style={[styles.messageText, isUser && styles.messageTextUser]}
            selectable
          >
            {text}
          </Text>
        )}
      </View>
    </View>
  );
}
