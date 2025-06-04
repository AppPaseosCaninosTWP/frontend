import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../../navigation/stack_navigator";
import { get_all_payments } from "../../../../service/payment_service";
import type { payment_model } from "../../../../models/payment_model";
import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";

const api_uploads_url = process.env.EXPO_PUBLIC_URL;

export default function PaymentsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [payments, set_payments] = useState<payment_model[]>([]);
    const [loading, set_loading] = useState(true);

    useEffect(() => {
        const fetch_payments = async () => {
            try {
                const data = await get_all_payments();
                set_payments(data);
            } catch (err: any) {
                Alert.alert("Error", err.message);
            } finally {
                set_loading(false);
            }
        };
        fetch_payments();
    }, []);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header_row}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back_btn}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.header_title}>Pagos</Text>
            </View>

            {payments.length === 0 ? (
                <Text style={styles.empty_text}>No tienes pagos pendientes.</Text>
            ) : (
                payments.map((p) => (
                    <TouchableOpacity
                        key={p.payment_id}
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate("PaymentDetailScreenCliente", {
                                paymentId: p.payment_id,
                            })
                        }
                    >
                        <View style={styles.card_header}>
                            <Feather name="credit-card" size={24} color="#007BFF" />
                            <Text style={styles.amount_text}>${p.amount.toLocaleString()}</Text>
                        </View>

                        <View style={styles.card_body}>
                            <Text style={styles.label}>Estado</Text>
                            <Text style={[styles.value, { color: "#007BFF" }]}>{p.status}</Text>

                            <Text style={styles.label}>Fecha</Text>
                            <Text style={styles.value}>{dayjs(p.created_at).format("DD/MM/YYYY")}</Text>
                        </View>
                    </TouchableOpacity>


                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        padding: 16,
        backgroundColor: "#fff",
        flexGrow: 1,
        justifyContent: "flex-start",
        paddingTop: 40,
        gap: 12,
    },
    header_row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    back_btn: {
        padding: 4,
        marginRight: 8,
    },
    header_title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
        textAlign: "center",
        marginLeft: 8,
    },
    empty_text: {
        textAlign: "center",
        color: "#666",
        fontSize: 16,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    pet_name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111",
    },
    detail: {
        fontSize: 14,
        color: "#555",
    },
    card_header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    card_content: {
        flexDirection: "column",
        gap: 4,
    },

    amount_text: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: "700",
        color: "#111",
    },

    card_body: {
        flexDirection: "column",
        gap: 8,
    },

    label: {
        fontSize: 13,
        color: "#888",
        fontWeight: "500",
    },

    value: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
        marginBottom: 6,
    },

});
