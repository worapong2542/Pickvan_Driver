import React from "react";
import { StyleSheet, View } from "react-native";

export default function Card(props) {
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                {props.children}
            </View>
        </View>   
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 6,
        backgroundColor: '#E8F3F3',
        marginHorizontal: 2,
        marginVertical: 6
    },
    cardContent: {
        marginHorizontal: 75,
        marginVertical: 20,
    },
});