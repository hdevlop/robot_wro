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
  const GEMINI_URL = process.env.NEXT_PUBLIC_GEMINI_URL;
  
  const prompts = {
    current: `Analyze current sensor readings: Temperature: ${sensorData.temperature}°C, CO: ${sensorData.co}ppm, Air Quality: ${sensorData.airQuality}. Provide safety assessment and recommendations.`,
    emergency: `URGENT: Emergency analysis needed. Temperature: ${sensorData.temperature}°C, CO: ${sensorData.co}ppm. Should we evacuate? Immediate actions required.`,
    trend: `Trend analysis: Analyze patterns in Temperature: ${sensorData.temperature}°C, CO: ${sensorData.co}ppm over time. Predict next 30 minutes.`,
    historical: `Historical analysis: Compare current readings Temperature: ${sensorData.temperature}°C, CO: ${sensorData.co}ppm with typical baseline values.`
  };

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompts[type] }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 400 }
    })
  });

  const result = await response.json();
  return result.candidates[0].content.parts[0].text;
};

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
      setAnalysisResult(result, type);
    } catch (error) {
      setAnalysisResult(`Analysis failed: ${error.message}`, type);
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
      case 'current': return 'bg-blue-500';
      case 'emergency': return 'bg-red-500';
      case 'trend': return 'bg-green-500';
      case 'historical': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={aiAnalysis.isDialogOpen} onOpenChange={closeAnalysisDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            AI Environmental Analysis
          </DialogTitle>
          <DialogDescription>
            Choose analysis type for current sensor data
          </DialogDescription>
        </DialogHeader>

        {/* Current Sensor Data Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium mb-2">Current Readings:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span>Temperature: <strong>{sensors.temperature}°C</strong></span>
            <span>Humidity: <strong>{sensors.humidity}%</strong></span>
            <span>CO Level: <strong>{sensors.co} ppm</strong></span>
            <span>Air Quality: <strong>{sensors.airQuality}</strong></span>
          </div>
        </div>

        {/* Analysis Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            onClick={() => handleAnalysis('current')}
            disabled={aiAnalysis.isAnalyzing}
            className="flex items-center gap-2 h-12"
            variant="outline"
          >
            <Brain className="w-4 h-4" />
            Current Analysis
          </Button>

          <Button
            onClick={() => handleAnalysis('emergency')}
            disabled={aiAnalysis.isAnalyzing}
            className="flex items-center gap-2 h-12"
            variant="destructive"
          >
            <AlertTriangle className="w-4 h-4" />
            Emergency Check
          </Button>

          <Button
            onClick={() => handleAnalysis('trend')}
            disabled={aiAnalysis.isAnalyzing}
            className="flex items-center gap-2 h-12"
            variant="outline"
          >
            <TrendingUp className="w-4 h-4" />
            Trend Analysis
          </Button>

          <Button
            onClick={() => handleAnalysis('historical')}
            disabled={aiAnalysis.isAnalyzing}
            className="flex items-center gap-2 h-12"
            variant="outline"
          >
            <Clock className="w-4 h-4" />
            Historical Compare
          </Button>
        </div>

        {/* Loading State */}
        {aiAnalysis.isAnalyzing && (
          <div className="flex items-center justify-center p-8 bg-blue-50 rounded-lg">
            <Loader2 className="w-6 h-6 animate-spin mr-3" />
            <span>AI is analyzing sensor data...</span>
          </div>
        )}

        {/* Analysis Result */}
        {aiAnalysis.analysisResult && !aiAnalysis.isAnalyzing && (
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              {getAnalysisIcon(aiAnalysis.analysisType)}
              <Badge className={getAnalysisColor(aiAnalysis.analysisType)}>
                {aiAnalysis.analysisType?.toUpperCase()} ANALYSIS
              </Badge>
              <span className="text-xs text-gray-500 ml-auto">
                {new Date(aiAnalysis.lastAnalysisTime).toLocaleTimeString()}
              </span>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {aiAnalysis.analysisResult}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={closeAnalysisDialog}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAnalysisDialog;