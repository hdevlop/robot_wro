'use client'

import { useRobotStore } from "@/stores/robotStore";
import { useMessage, useMqtt } from "await-mqtt/client";
import { useEffect } from "react";

// Utiliser le même topic que les capteurs
const SENSORS_TOPIC = process.env.NEXT_PUBLIC_TOPICS_SENSORS;

export const useMqttRadar = () => {
    const { isConnected } = useMqtt();
    const { message: sensorMsg } = useMessage(SENSORS_TOPIC);

    const addDetectedObject = useRobotStore.use.addDetectedObject();
    const clearDetectedObjects = useRobotStore.use.clearDetectedObjects();
    const addToTerminal = useRobotStore.use.addToTerminal();

    // Log de connexion
    useEffect(() => {
        console.log('MQTT Radar - Connexion status:', isConnected);
        console.log('MQTT Radar - Topic configuré:', SENSORS_TOPIC);
        addToTerminal(`MQTT Radar - ${isConnected ? 'Connecté' : 'Déconnecté'} sur ${SENSORS_TOPIC}`);
    }, [isConnected, addToTerminal]);

    useEffect(() => {
        if (sensorMsg) {
            console.log('MQTT Radar - Message brut reçu:', sensorMsg);
            console.log('MQTT Radar - Type du message:', typeof sensorMsg);
            addToTerminal(`MQTT Radar - Message reçu: ${JSON.stringify(sensorMsg)}`);

            try {
                // Parser le message si c'est une chaîne
                let message;
                if (typeof sensorMsg === 'string') {
                    try {
                        message = JSON.parse(sensorMsg);
                        console.log('MQTT Radar - Message parsé:', message);
                    } catch (e) {
                        console.error('MQTT Radar - Erreur parsing JSON:', e);
                        return;
                    }
                } else {
                    message = sensorMsg;
                }

                // Log de la structure du message
                console.log('MQTT Radar - Structure du message:', {
                    hasType: 'type' in message,
                    type: message.type,
                    hasData: 'data' in message,
                    hasRadar: message.data && 'radar' in message.data,
                    radarData: message.data?.radar
                });

                // Vérifier si c'est un message avec des données radar
                if (message.data && message.data.radar) {
                    console.log('MQTT Radar - Données radar trouvées:', message.data.radar);
                    const { angle, distance } = message.data.radar;

                    // Vérifier que les données sont valides
                    if (typeof angle === 'number' && typeof distance === 'number' &&
                        angle >= 0 && angle <= 180 && distance >= 0) {
                        
                        console.log('MQTT Radar - Données radar valides:', { angle, distance });
                        
                        // Ajouter l'objet détecté au store
                        addDetectedObject({
                            angle,
                            distance,
                            timestamp: Date.now()
                        });

                        addToTerminal(`Radar: Objet détecté à ${angle}° - ${distance.toFixed(2)}m`);
                    } else {
                        console.error('MQTT Radar - Données radar invalides:', { angle, distance });
                        throw new Error(`Données radar invalides: angle=${angle}, distance=${distance}`);
                    }
                } else {
                    console.log('MQTT Radar - Pas de données radar dans le message');
                }
            } catch (error) {
                console.error('MQTT Radar - Erreur de traitement:', error);
                addToTerminal(`Erreur radar: ${error.message}`);
            }
        }
    }, [sensorMsg, addDetectedObject, addToTerminal]);

    // Nettoyer les objets détectés lors de la déconnexion
    useEffect(() => {
        if (!isConnected) {
            clearDetectedObjects();
            console.log('MQTT Radar - Objets détectés nettoyés (déconnexion)');
        }
    }, [isConnected, clearDetectedObjects]);

    return {
        isConnected
    };
}; 