import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { sendToGPT } from '../../utils/chatAPI';

const bgImage = { uri: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?fit=crop&w=800&q=80' };

const ClimateChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const reply = await sendToGPT(input);
    const botMsg = { role: 'assistant', text: reply };
    setMessages(prev => [...prev, botMsg]);

    setTimeout(() => {
      scrollRef?.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  return (
    <ImageBackground source={bgImage} style={styles.bg}>
      <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.overlay}>
          <Text style={styles.header}>🌿 Ask Layla (AI)</Text>

          <ScrollView style={styles.chatBox} ref={scrollRef}>
            {messages.map((msg, index) => (
              <View key={index} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.botBubble]}>
                <Text style={styles.bubbleText}>
                  {msg.role === 'user' ? '🧍' : '🤖'} {msg.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask about climate..."
              placeholderTextColor="#ccc"
              style={styles.input}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
              <Text style={styles.sendText}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default ClimateChatBot;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: 'cover'
  },
  wrapper: {
    flex: 1
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 31, 63, 0.85)',
    paddingHorizontal: 16,
    paddingTop: 60
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 10
  },
  chatBox: {
    flex: 1,
    marginBottom: 12
  },
  bubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '85%'
  },
  userBubble: {
    backgroundColor: '#007ACC',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#FFD700',
    alignSelf: 'flex-start'
  },
  bubbleText: {
    color: '#001F3F',
    fontSize: 15
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15
  },
  sendBtn: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20
  },
  sendText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001F3F'
  }
});
