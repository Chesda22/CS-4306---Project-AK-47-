import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { generateTips } from '../utils/tips';


const CarbonResult = () => {
    const { total, breakdown } = useLocalSearchParams();
    const userData = JSON.parse(breakdown);
    console.log("🟢 userData received in CarbonResult:", userData);
    const tips = generateTips(userData);
    console.log("🟢 Tips generated:", tips);


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Estimated Carbon Footprint</Text>

            {/* Total Carbon Footprint Box */}
            <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Total Carbon Footprint:</Text>
                <Text style={styles.totalValue}>{total} kg CO₂</Text>
            </View>

            {/* Breakdown of emissions */}
            <Text style={styles.resultText}>{breakdown}</Text>

            <Text style={styles.header}>Helpful Tips</Text>
            <View style={{ backgroundColor: '#003366', padding: 15, borderRadius: 8, marginBottom: 15 }}>
              {tips.length === 0 ? (
                <Text style={{ color: '#FFD700' }}>No tips generated. Check your input.</Text>
              ) : (
                tips.map((tip, index) => (
                  <Text key={index} style={{ color: '#FFFFFF', marginBottom: 5 }}>• {tip}</Text>
                ))
              )}
            </View>


            {/* Button to go back to the calculator */}
            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Calculate Again</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CarbonResult;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#001F3F', 
        justifyContent: 'center'
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700', 
        textAlign: 'center',
        marginBottom: 15
    },
    totalBox: {
        backgroundColor: '#FFD700', 
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF', 
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#001F3F', 
    },
    totalValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#001F3F', 
    },
    resultText: {
        fontSize: 16,
        color: '#FFFFFF', 
        textAlign: 'left',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFD700'
    },
    button: {
        backgroundColor: '#007ACC',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
