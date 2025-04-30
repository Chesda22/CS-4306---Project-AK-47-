import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { sendToGPT } from '../../utils/chatAPI';

const ClimateChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    const reply = await sendToGPT(input);
    setMessages([...newMessages, { role: 'assistant', text: reply }]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌿 Ask Me Anything</Text>

      <ScrollView style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <Text key={idx} style={msg.role === 'user' ? styles.userMsg : styles.botMsg}>
            {msg.role === 'user' ? '🧍 ' : '🤖 '} {msg.text}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a question..."
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ClimateChatBot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F3F',
    padding: 16,
    paddingTop: 60,
  },
  header: {
    fontSize: 20,
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  chatBox: {
    flex: 1,
    marginBottom: 12,
  },
  userMsg: {
    color: '#00ccff',
    marginBottom: 10,
  },
  botMsg: {
    color: '#FFD700',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
});
