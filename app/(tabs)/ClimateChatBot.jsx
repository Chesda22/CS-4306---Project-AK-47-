import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { sendToGPT } from '../../utils/chatAPI';

const ClimateChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setLoading(true);

    try {
      const reply = await sendToGPT(input);
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: '⚠️ Error getting response.' }]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🤖 Ask Layla – Climate Assistant</Text>
      <ScrollView style={styles.chatArea}>
        {messages.map((msg, i) => (
          <Text
            key={i}
            style={[styles.message, msg.sender === 'user' ? styles.user : styles.bot]}
          >
            {msg.sender === 'user' ? '🧑 ' : '🌿 '} {msg.text}
          </Text>
        ))}
        {loading && <ActivityIndicator color="#FFD700" />}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask about carbon, emissions, tips..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ClimateChatBot;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: '#001F3F' },
  header: { fontSize: 20, fontWeight: 'bold', color: '#FFD700', textAlign: 'center', marginBottom: 12 },
  chatArea: { flex: 1, paddingHorizontal: 20, marginBottom: 10 },
  message: { fontSize: 16, marginBottom: 10, lineHeight: 22 },
  user: { color: '#00ccff', alignSelf: 'flex-end' },
  bot: { color: '#ffffff', alignSelf: 'flex-start' },
  inputRow: {
    flexDirection: 'row', padding: 10,
    borderTopWidth: 1, borderTopColor: '#FFD700',
    backgroundColor: '#003366'
  },
  input: {
    flex: 1, backgroundColor: '#fff', borderRadius: 8,
    paddingHorizontal: 10, fontSize: 16
  },
  button: {
    marginLeft: 10, backgroundColor: '#FFD700',
    paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 8
  },
  buttonText: { fontWeight: 'bold', color: '#001F3F' }
});
