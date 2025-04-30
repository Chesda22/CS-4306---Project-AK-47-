import { Text, View, StyleSheet, ImageBackground, ScrollView } from 'react-native';

const Layla = require("@/assets/images/Layla.jpeg"); 

const CarbonBrain = () => {  
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ImageBackground 
                source={Layla}
                resizeMode="cover"
                style={styles.headerImage}
            >
                <Text style={styles.headerText}> Carbon Brain Carbon Calculator </Text>
            </ImageBackground>

            <View style={styles.infoContainer}>
                <Text style={styles.title}>How Carbon Emissions Are Calculated:</Text>

                <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Electricity Usage:</Text> Measured in kWh, with an emission factor of **0.92 kg CO₂ per kWh**, depending on energy sources.</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Gasoline Consumption:</Text> Measured in liters, with an emission factor of **2.31 kg CO₂ per liter**, accounting for combustion emissions from fuel.</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Meat Consumption:</Text> Measured in kg, with an estimated factor of **3.3 kg CO₂ per kg of meat**, varying by type (beef has a higher footprint than poultry).</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Total Carbon Footprint:</Text> Sum of emissions from electricity, gasoline, and meat consumption, providing an estimate of monthly CO₂ output.</Text>
            </View>
        </ScrollView>
    );
}

export default CarbonBrain;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#ADD8E6', // Light blue background color
        paddingBottom: 20
    },
    headerImage: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10
    },
    infoContainer: {
        padding: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    bulletPoint: {
        fontSize: 16,
        marginBottom: 8
    },
    bold: {
        fontWeight: 'bold'
    }
});
