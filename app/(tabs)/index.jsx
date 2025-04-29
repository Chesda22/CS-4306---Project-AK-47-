import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, View, Image } from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const Layla = require("@/assets/images/Layla.jpeg");

const CarbonCalculator = () => {
    const [electricity, setElectricity] = useState('');
    const [gasoline, setGasoline] = useState('');
    const [meatConsumption, setMeatConsumption] = useState('');
    const [publicTransport, setPublicTransport] = useState('');
    const [recycledWaste, setRecycledWaste] = useState('');

    // Layla Floating Animation
    const laylaPosition = useSharedValue(0);

    useEffect(() => {
        laylaPosition.value = withRepeat(
            withSequence(
                withTiming(-5, { duration: 1000 }), // Move up
                withTiming(5, { duration: 1000 })  // Move down
            ),
            -1, // Infinite loop
            true // Alternate directions
        );
    }, []);

    // Apply the animation using useAnimatedStyle
    const animatedLaylaStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: laylaPosition.value }],
    }));

    const calculateEmissions = () => {
        const electricityEmissions = parseFloat(electricity) * 0.92 || 0;
        const gasolineEmissions = parseFloat(gasoline) * 2.31 || 0;
        const meatEmissions = parseFloat(meatConsumption) * 3.3 || 0;
        const publicTransportEmissions = parseFloat(publicTransport) * 0.1 || 0;
        const recyclingReduction = parseFloat(recycledWaste) * 0.5 || 0;

        const totalEmissions = 
            electricityEmissions + 
            gasolineEmissions + 
            meatEmissions + 
            publicTransportEmissions - 
            recyclingReduction;

        const breakdown = `• Electricity: ${electricity} kWh × 0.92 kg CO₂ = ${electricityEmissions.toFixed(2)} kg CO₂\n` +
            `• Gasoline: ${gasoline} L × 2.31 kg CO₂ = ${gasolineEmissions.toFixed(2)} kg CO₂\n` +
            `• Meat: ${meatConsumption} kg × 3.3 kg CO₂ = ${meatEmissions.toFixed(2)} kg CO₂\n` +
            `• Public Transport: ${publicTransport} km × 0.1 kg CO₂ = ${publicTransportEmissions.toFixed(2)} kg CO₂\n` +
            `• Recycled Waste: ${recycledWaste} kg × -0.5 kg CO₂ = -${recyclingReduction.toFixed(2)} kg CO₂\n` +
            `• Total Carbon Footprint: ${totalEmissions.toFixed(2)} kg CO₂`;

        const userData = {
              electricity: parseFloat(electricity),
              gasoline: parseFloat(gasoline),
              meatMeals: parseFloat(meatConsumption),
              publicTransport: parseFloat(publicTransport),
              recycles: parseFloat(recycledWaste) > 0,};


        router.push({
          pathname: '/CarbonResult',
          params: {
            total: totalEmissions.toFixed(2),
        breakdown: JSON.stringify(userData)
              }
        });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Layla Greeting Section */}
            <View style={styles.headerContainer}>
                {/* Speech Bubble */}
                <View style={styles.speechBubble}>
                    <Text style={styles.greeting}>Hi, I'm Layla!</Text>
                    <Text style={styles.subText}>I will be your carbon calculator.</Text>
                    {/* Speech Bubble Tail */}
                    <View style={styles.bubbleTail} />
                </View>

                {/* Animated Layla Image */}
                <Animated.Image 
                    source={Layla} 
                    style={[styles.laylaImage, animatedLaylaStyle]} 
                />
            </View>

            <Text style={styles.sectionHeader}>🧮 Carbon Footprint Calculator</Text>

            <View style={styles.card}>
                <Text style={styles.inputLabel}>🔌 Electricity Usage (kWh/month)</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="Enter kWh" value={electricity} onChangeText={setElectricity} />
            </View>

            <View style={styles.card}>
                <Text style={styles.inputLabel}>⛽ Gasoline Usage (liters/month)</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="Enter liters" value={gasoline} onChangeText={setGasoline} />
            </View>

            <View style={styles.card}>
                <Text style={styles.inputLabel}>🍖 Meat Consumption (kg/month)</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="Enter kg" value={meatConsumption} onChangeText={setMeatConsumption} />
            </View>

            <View style={styles.card}>
                <Text style={styles.inputLabel}>🚇 Public Transport Usage (km/month)</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="Enter km" value={publicTransport} onChangeText={setPublicTransport} />
            </View>

            <View style={styles.card}>
                <Text style={styles.inputLabel}>♻️ Recycled Waste (kg/month)</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="Enter kg" value={recycledWaste} onChangeText={setRecycledWaste} />
            </View>

            <TouchableOpacity style={styles.calculateButton} onPress={calculateEmissions}>
                <Text style={styles.buttonText}>🚀 Calculate</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default CarbonCalculator;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#ADD8E6',
        justifyContent: 'center'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    laylaImage: {
        width: 60,  
        height: 60,
        borderRadius: 30, // Circular image
        marginLeft: 10 // Space between Layla and bubble
    },
    speechBubble: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        maxWidth: '60%',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#003366',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginRight: 10, // Space between speech bubble and Layla
    },
    bubbleTail: {
        position: 'absolute',
        bottom: -8,
        right: 15, // Align tail to Layla
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'white',
        transform: [{ rotate: '180deg' }], // Flip to point at Layla
    },
    greeting: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#003366'
    },
    subText: {
        fontSize: 14,
        color: '#003366'
    },
    sectionHeader: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 20,
        textAlign: 'center'
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#003366'
    },
    input: {
        backgroundColor: '#f0f8ff',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16
    },
    calculateButton: {
        backgroundColor: '#003366',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
