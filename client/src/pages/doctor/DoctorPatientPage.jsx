import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const DoctorPatientPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [showPastRecords, setShowPastRecords] = useState(false);
  const [transformedData, setTransformedData] = useState(null);
  const { toast } = useToast();

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Recording Started",
        description: "Audio capture has begun.",
      });
    } else {
      toast({
        title: "Recording Stopped",
        description: "Audio capture has ended.",
      });
    }
  };

  const handleSummarize = () => {
    // Simulating summarization process
    setTimeout(() => {
      setSummary("This is a summarized version of the transcription.");
      toast({
        title: "Summarization Completed",
        description: "The transcription has been summarized.",
      });
    }, 2000);
  };

  const handleTransform = () => {
    // Simulating transformation process
    setTransformedData({
      symptoms: ["Fever", "Cough", "Fatigue"],
      medicines: ["Paracetamol", "Cough Syrup"],
      diagnosis: "Common Cold",
      recommendations: "Rest and hydration"
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Patient Details</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>John Doe</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Age: 35</p>
          <p>Last Appointment: 2023-10-01</p>
          <Button 
            onClick={() => setShowPastRecords(!showPastRecords)}
            className="mt-2"
          >
            {showPastRecords ? "Hide Past Records" : "Show Past Records"}
            {showPastRecords ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
          </Button>
          {showPastRecords && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-semibold">Past Records (AI-Generated)</h3>
              <p>Previous visits: 3</p>
              <p>Chronic conditions: None</p>
              <p>Allergies: Penicillin</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-6">
        <Button
          onClick={toggleRecording}
          className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105`}
        >
          {isRecording ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Transcription</h2>
        <div className="bg-gray-100 p-4 rounded-md h-40 overflow-y-auto">
          {transcription || "Transcription will appear here..."}
        </div>
      </div>

      <div className="mb-6">
        <Button onClick={handleSummarize} disabled={!transcription}>
          Summarize
        </Button>
      </div>

      {summary && (
        <Alert className="mb-6">
          <AlertDescription>{summary}</AlertDescription>
        </Alert>
      )}

      {summary && (
        <div className="mb-6">
          <Button onClick={handleTransform}>Transform</Button>
        </div>
      )}

      {transformedData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Transformed Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Symptoms</h3>
                <ul>
                  {transformedData.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Medicines</h3>
                <ul>
                  {transformedData.medicines.map((medicine, index) => (
                    <li key={index}>{medicine}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Diagnosis</h3>
                <p>{transformedData.diagnosis}</p>
              </div>
              <div>
                <h3 className="font-semibold">Recommendations</h3>
                <p>{transformedData.recommendations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Toaster />
    </div>
  );
};

export default DoctorPatientPage;