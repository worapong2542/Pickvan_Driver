import React from "react";
import { StyleSheet, View } from "react-native";

export default function Card_changeColor(props) {
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
        backgroundColor: '#ffcc99',
        marginHorizontal: 2,
        marginVertical: 6
    },
    cardContent: {
        marginHorizontal: 50,
        marginVertical: 20,
    },
});