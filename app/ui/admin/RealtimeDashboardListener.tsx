"use client";

import { useEffect } from "react";
import mqtt from "mqtt";
import { useRouter } from "next/navigation";

export default function RealtimeDashboardListener() {
    const router = useRouter();
    const MQTT_WS_URL = process.env.NEXT_PUBLIC_MQTT_URL || "wss://broker.hivemq.com:8884/mqtt";
    const MQTT_USER = process.env.NEXT_PUBLIC_MQTT_USER;
    const MQTT_PASSWORD = process.env.NEXT_PUBLIC_MQTT_PASSWORD;

    useEffect(() => {
        const client = mqtt.connect(MQTT_WS_URL, {
            username: MQTT_USER,
            password: MQTT_PASSWORD,
            clean: true,
            connectTimeout: 4000,
        });

        const TOPIC_UPDATE = "cocobase/dashboard/update";

        client.on("connect", () => {
            console.log("Dashboard Listener Connected");
            client.subscribe(TOPIC_UPDATE);
        });

        client.on("message", (topic, message) => {
            if (topic === TOPIC_UPDATE) {
                console.log("Dashboard update received, refreshing data...");
                router.refresh(); // Triggers server component re-fetch
            }
        });

        return () => {
            client.end();
        };
    }, [router, MQTT_WS_URL, MQTT_USER, MQTT_PASSWORD]);

    return null; // This component renders nothing
}
