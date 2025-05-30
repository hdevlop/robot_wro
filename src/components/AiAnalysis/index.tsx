import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { useRobotStore } from '@/stores/robotStore';

const analyzeWithAI = async (type: 'current' | 'emergency' | 'trend' | 'historical', sensorData: any) => {
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const BASE_URL = 'https://generativelanguage.googleapis.com';
  
  if (!GEMINI_API_KEY) {
    throw new Error('Clé API Gemini manquante. Vérifiez votre fichier .env.local');
  }

  const MODEL_NAME = 'gemini-1.5-flash';
  const MODEL_URL = `${BASE_URL}/v1beta/models/${MODEL_NAME}:generateContent`;

  try {
    console.log('Utilisation du modèle:', MODEL_NAME);
    
    console.log('Test de connexion...');
    const testPrompt = "Test de connexion - Répondez simplement 'OK' si vous recevez ce message.";
    
    const testResponse = await fetch(`${MODEL_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: testPrompt }] }],
        generationConfig: { 
          temperature: 0.1, 
          maxOutputTokens: 10
        }
      })
    });

    if (!testResponse.ok) {
      const errorData = await testResponse.json().catch(() => null);
      console.error('Détails de l\'erreur:', errorData);
      if (errorData?.error?.message?.includes('deprecated')) {
        throw new Error('Le modèle est déprécié. Veuillez mettre à jour votre clé API ou contacter le support.');
      }
      throw new Error(`Test de connexion échoué: ${testResponse.status} ${testResponse.statusText}`);
    }

    console.log('Test de connexion réussi !');
    
    // Analyse réelle
    const prompts = {
      current: `Analysez les lectures actuelles des capteurs : Température: ${sensorData.temperature}°C, CO: ${sensorData.co}ppm, Qualité de l'air: ${sensorData.airQuality}. Fournissez une évaluation de sécurité et des recommandations.`,
      emergency: `URGENT : Analyse d'urgence nécessaire. Température: ${sensorData.temperature}°C, CO: ${sensorData.co}ppm. Devons-nous évacuer ? Actions immédiates requises.`,
      trend: `Analyse des tendances : Analysez les modèles de Température: ${sensorData.temperature}°C, CO: ${sensorData.co}ppm au fil du temps. Prédisez les 30 prochaines minutes.`,
      historical: `Analyse historique : Comparez les lectures actuelles Température: ${sensorData.temperature}°C, CO: ${sensorData.co}ppm avec les valeurs de référence typiques.`
    };

    const response = await fetch(`${MODEL_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompts[type] }] }],
        generationConfig: { 
          temperature: 0.1, 
          maxOutputTokens: 400
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Erreur d'analyse: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
    }

    const result = await response.json();
    
    if (!result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Format de réponse invalide de l\'API');
    }

    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Erreur d\'analyse:', error);
    throw new Error(`Échec de l'analyse: ${error.message}`);
  }
};

// Ajout des styles pour la barre de défilement personnalisée
const customScrollbarStyles = `
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 0, 0, 0.3) rgba(20, 0, 0, 0.9);
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(20, 0, 0, 0.9);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 0, 0, 0.3);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 0, 0, 0.5);
  }

  @media (max-width: 640px) {
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
  }
`;

export const AIAnalysisDialog: React.FC = () => {
  const {
    aiAnalysis,
    sensors,
    openAnalysisDialog,
    closeAnalysisDialog,
    setIsAnalyzing,
    setAnalysisResult,
    clearAnalysisResult
  } = useRobotStore();

  const handleAnalysis = async (type: 'current' | 'emergency' | 'trend' | 'historical') => {
    setIsAnalyzing(true);
    clearAnalysisResult();
    
    try {
      const result = await analyzeWithAI(type, sensors);
      if (!result) {
        throw new Error('No analysis result received');
      }
      setAnalysisResult(result, type);
    } catch (error) {
      console.error('Analysis Error:', error);
      setAnalysisResult(`Analysis failed: ${error.message || 'Unknown error occurred'}`, type);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'current': return <Brain className="w-4 h-4" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      case 'historical': return <Clock className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getAnalysisColor = (type: string) => {
    switch (type) {
      case 'current': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'emergency': return 'bg-red-500/30 text-red-500 border-red-500/50';
      case 'trend': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'historical': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <>
      <style>{customScrollbarStyles}</style>
      <Dialog open={aiAnalysis.isDialogOpen} onOpenChange={closeAnalysisDialog}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] flex flex-col p-4 sm:p-6 bg-gray-900/95 border-red-500/30 backdrop-blur-sm">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl text-red-500">
              <Brain className="w-5 h-5 text-red-500" />
              AI Environmental Analysis
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              Choose analysis type for current sensor data
            </DialogDescription>
          </DialogHeader>

          {/* Current Sensor Data Summary */}
          <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 flex-shrink-0 border border-red-500/20">
            <h4 className="font-medium mb-2 text-sm sm:text-base text-red-500">Current Readings:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-300">
              <span>Temperature: <strong className="text-red-500">{sensors.temperature}°C</strong></span>
              <span>Humidity: <strong className="text-red-500">{sensors.humidity}%</strong></span>
              <span>CO Level: <strong className="text-red-500">{sensors.co} ppm</strong></span>
              <span>Air Quality: <strong className="text-red-500">{sensors.airQuality}</strong></span>
            </div>
          </div>

          {/* Analysis Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 flex-shrink-0">
            <Button
              onClick={() => handleAnalysis('current')}
              disabled={aiAnalysis.isAnalyzing}
              className={`flex items-center gap-2 h-10 sm:h-12 text-xs sm:text-sm border ${getAnalysisColor('current')} hover:bg-red-500/30 transition-colors`}
              variant="outline"
            >
              <Brain className="w-4 h-4" />
              Current Analysis
            </Button>

            <Button
              onClick={() => handleAnalysis('emergency')}
              disabled={aiAnalysis.isAnalyzing}
              className={`flex items-center gap-2 h-10 sm:h-12 text-xs sm:text-sm border ${getAnalysisColor('emergency')} hover:bg-red-500/40 transition-colors`}
              variant="outline"
            >
              <AlertTriangle className="w-4 h-4" />
              Emergency Check
            </Button>

            <Button
              onClick={() => handleAnalysis('trend')}
              disabled={aiAnalysis.isAnalyzing}
              className={`flex items-center gap-2 h-10 sm:h-12 text-xs sm:text-sm border ${getAnalysisColor('trend')} hover:bg-green-500/30 transition-colors`}
              variant="outline"
            >
              <TrendingUp className="w-4 h-4" />
              Trend Analysis
            </Button>

            <Button
              onClick={() => handleAnalysis('historical')}
              disabled={aiAnalysis.isAnalyzing}
              className={`flex items-center gap-2 h-10 sm:h-12 text-xs sm:text-sm border ${getAnalysisColor('historical')} hover:bg-red-500/30 transition-colors`}
              variant="outline"
            >
              <Clock className="w-4 h-4" />
              Historical Compare
            </Button>
          </div>

          {/* Loading State */}
          {aiAnalysis.isAnalyzing && (
            <div className="flex items-center justify-center p-4 sm:p-8 bg-gray-800/50 rounded-lg flex-shrink-0 border border-red-500/20">
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mr-2 sm:mr-3 text-red-500" />
              <span className="text-sm sm:text-base text-gray-300">AI is analyzing sensor data...</span>
            </div>
          )}

          {/* Analysis Result */}
          {aiAnalysis.analysisResult && !aiAnalysis.isAnalyzing && (
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-800/50 rounded-lg p-4 border border-red-500/20">
              <div className="flex items-center gap-2 mb-3">
                {getAnalysisIcon(aiAnalysis.analysisType)}
                <Badge className={`${getAnalysisColor(aiAnalysis.analysisType)}`}>
                  {aiAnalysis.analysisType?.charAt(0).toUpperCase() + aiAnalysis.analysisType?.slice(1)} Analysis
                </Badge>
                {aiAnalysis.lastAnalysisTime && (
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(aiAnalysis.lastAnalysisTime).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="prose prose-sm max-w-none text-gray-300">
                {aiAnalysis.analysisResult.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIAnalysisDialog;