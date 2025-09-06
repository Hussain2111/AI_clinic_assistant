import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, Clock, User, Mic, MicOff, Volume2, Play, Pause } from 'lucide-react';

const AIClinicWidget = () => {
  const [callData, setCallData] = useState({
    from: '+44 7700 900123',
    duration: 0,
    status: 'active',
    patientId: 'PT-2024-001',
    patientName: 'Sarah Johnson',
    startTime: new Date(),
    priority: 'HIGH',
    reason: 'Chest pain and shortness of breath'
  });

  const [audioLevel, setAudioLevel] = useState(0);
  const [transcription, setTranscription] = useState([]);
  const [llmReasoning, setLlmReasoning] = useState([]);
  const [isCallActive, setIsCallActive] = useState(true);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [voiceDiagnostics, setVoiceDiagnostics] = useState([]);

  const transcriptionRef = useRef(null);
  const reasoningRef = useRef(null);
  const canvasRef = useRef(null);
  const diagnosticsRef = useRef(null);

  // Conversation timeline
  const conversationTimeline = [
    { time: 0, speaker: 'Patient', text: 'Hello, this is Sarah Johnson', audioIntensity: 0.6, duration: 3000 },
    { time: 4000, speaker: 'Assistant', text: 'Hi Sarah, I can help you today. What\'s the reason for your call?', audioIntensity: 0.5, duration: 4000 },
    { time: 9000, speaker: 'Patient', text: 'I\'ve been having chest pain and shortness of breath for the past hour', audioIntensity: 0.8, duration: 5000 },
    { time: 15000, speaker: 'Assistant', text: 'I understand this is concerning. Let me check for urgent care availability immediately.', audioIntensity: 0.6, duration: 4500 }
  ];

  const reasoningTimeline = [
    { time: 1000, step: 'Patient Identification', status: 'completed', details: 'Verified caller identity using DOB', confidence: 0.95 },
    { time: 6000, step: 'Symptom Analysis', status: 'processing', details: 'Analyzing chest pain and breathing symptoms', confidence: 0.88 },
    { time: 12000, step: 'Urgency Assessment', status: 'completed', details: 'High priority - potential cardiac event', confidence: 0.94 },
    { time: 18000, step: 'Provider Matching', status: 'processing', details: 'Connecting to emergency services', confidence: 0.92 }
  ];

  const voiceDiagnosticsTimeline = [
    { time: 2000, symptom: 'Breathing Pattern', status: 'detected', finding: 'Shortness of breath detected', confidence: 0.92, severity: 'HIGH' },
    { time: 8000, symptom: 'Voice Strain', status: 'analyzing', finding: 'Stress indicators in voice pattern', confidence: 0.85, severity: 'MEDIUM' },
    { time: 14000, symptom: 'Speech Pace', status: 'completed', finding: 'Rapid speech - anxiety indicators', confidence: 0.89, severity: 'MEDIUM' }
  ];

  // Audio waveform simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    let animationId;
    const waveData = new Array(width).fill(0);
    let startTime = Date.now();

    const drawWaveform = () => {
      if (!isCallActive) {
        waveData.shift();
        waveData.push(0);
      } else {
        const currentTime = Date.now() - startTime;
        let intensity = 0;
        let speakingNow = null;

        for (const event of conversationTimeline) {
          if (currentTime >= event.time && currentTime < event.time + event.duration) {
            intensity = event.audioIntensity;
            speakingNow = event.speaker;
            break;
          }
        }

        const baseNoise = Math.random() * 0.1;
        const speechPattern = Math.sin(currentTime * 0.02) * intensity;
        const finalIntensity = (speechPattern + baseNoise) * height * 0.4;

        waveData.shift();
        waveData.push(finalIntensity);
        
        setAudioLevel(Math.abs(finalIntensity) / (height * 0.4));
        setCurrentSpeaker(speakingNow);
      }

      // Clear canvas
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Draw waveform bars
      const barWidth = 2;
      const barSpacing = 1;
      const numBars = Math.floor(width / (barWidth + barSpacing));

      ctx.fillStyle = '#3b82f6';
      
      for (let i = 0; i < numBars; i++) {
        const dataIndex = Math.floor((i / numBars) * waveData.length);
        const barHeight = Math.abs(waveData[dataIndex] || 0);
        const x = i * (barWidth + barSpacing);
        const y = (height - barHeight) / 2;
        
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animationId = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isCallActive]);

  // Duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (isCallActive) {
        setCallData(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isCallActive]);

  // Simulate conversation
  useEffect(() => {
    if (!isCallActive) return;

    const startTime = Date.now();
    const timers = [];

    conversationTimeline.forEach((event) => {
      const timer = setTimeout(() => {
        const newMessage = {
          id: Date.now() + Math.random(),
          speaker: event.speaker,
          text: event.text,
          timestamp: new Date()
        };

        setTranscription(prev => [...prev, newMessage]);
        
        setTimeout(() => {
          if (transcriptionRef.current) {
            transcriptionRef.current.scrollTop = transcriptionRef.current.scrollHeight;
          }
        }, 100);
      }, event.time);

      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isCallActive]);

  // Simulate AI reasoning
  useEffect(() => {
    if (!isCallActive) return;

    const timers = [];

    reasoningTimeline.forEach((event) => {
      const timer = setTimeout(() => {
        const newReasoning = {
          id: Date.now() + Math.random(),
          step: event.step,
          status: event.status,
          details: event.details,
          confidence: event.confidence,
          timestamp: new Date()
        };

        setLlmReasoning(prev => [...prev, newReasoning]);
        
        setTimeout(() => {
          if (reasoningRef.current) {
            reasoningRef.current.scrollTop = reasoningRef.current.scrollHeight;
          }
        }, 100);
      }, event.time);

      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isCallActive]);

  // Simulate voice diagnostics
  useEffect(() => {
    if (!isCallActive) return;

    const timers = [];

    voiceDiagnosticsTimeline.forEach((event) => {
      const timer = setTimeout(() => {
        const newDiagnostic = {
          id: Date.now() + Math.random(),
          symptom: event.symptom,
          status: event.status,
          finding: event.finding,
          confidence: event.confidence,
          severity: event.severity,
          timestamp: new Date()
        };

        setVoiceDiagnostics(prev => [...prev, newDiagnostic]);
        
        setTimeout(() => {
          if (diagnosticsRef.current) {
            diagnosticsRef.current.scrollTop = diagnosticsRef.current.scrollHeight;
          }
        }, 100);
      }, event.time);

      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isCallActive]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrafficLight = (severity) => {
    switch (severity) {
      case 'NORMAL': return '🟢';
      case 'LOW': return '🟢';
      case 'MEDIUM': return '🟡';
      case 'HIGH': return '🔴';
      case 'SEVERE': return '🔴';
      default: return '⚫';
    }
  };

  const resetConversation = () => {
    setTranscription([]);
    setLlmReasoning([]);
    setVoiceDiagnostics([]);
    setCallData(prev => ({ ...prev, duration: 0, startTime: new Date() }));
  };

  const handleCallToggle = () => {
    setIsCallActive(!isCallActive);
    if (!isCallActive) {
      resetConversation();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {callData.patientName}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {callData.from}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(callData.priority)}`}>
          {callData.priority}
        </span>
      </div>

      {/* Reason for call with audio waveform */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Reason for call:
        </h4>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-900 flex-1 mr-3">
            {callData.reason}
          </p>
          <div className="bg-gray-50 rounded p-2 w-20 h-8 flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
            <canvas 
              ref={canvasRef} 
              width={60} 
              height={16} 
              className="w-12 h-4"
            />
          </div>
        </div>
      </div>

      {/* Duration */}
      <div className="flex items-center mb-4">
        <Clock className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-sm font-medium text-gray-900">
          {formatDuration(callData.duration)}
        </span>
      </div>

      {/* Live Transcript */}
      <div className="mb-4">
        <div 
          ref={transcriptionRef}
          className="bg-gray-50 rounded-lg p-3 h-20 overflow-y-auto text-sm"
        >
          {transcription.length > 0 ? (
            transcription.map((message, index) => (
              <div key={message.id} className="mb-1 last:mb-0">
                {index === transcription.length - 1 ? (
                  <div>
                    <span className="text-gray-900">{message.text}</span>
                    <div className="flex items-center mt-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mr-1"></div>
                      <span className="text-xs text-blue-600">Transcribing...</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-700">{message.text}</span>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center">
              <div className="w-1 h-1 bg-blue-500 rounded-full mr-1"></div>
              <span className="text-xs text-blue-600">Transcribing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Voice Diagnostics */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Voice Analysis:
        </h4>
        <div 
          ref={diagnosticsRef}
          className="bg-gray-50 rounded-lg p-3 h-16 overflow-y-auto text-xs space-y-1"
        >
          {voiceDiagnostics.map((diagnostic) => (
            <div key={diagnostic.id} className="flex items-center justify-between">
              <span className="text-gray-900 text-xs">{diagnostic.symptom}:</span>
              <div className="flex items-center space-x-1">
                <span className="text-xs">{getTrafficLight(diagnostic.severity)}</span>
                <span className="text-gray-600 text-xs">{diagnostic.finding}</span>
                <span className="text-gray-500 text-xs">{(diagnostic.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
          {voiceDiagnostics.length === 0 && (
            <div className="text-gray-500 text-xs italic">Analyzing voice patterns...</div>
          )}
        </div>
      </div>

      {/* AI Reasoning */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          AI Analysis:
        </h4>
        <div 
          ref={reasoningRef}
          className="bg-gray-50 rounded-lg p-3 h-16 overflow-y-auto text-xs space-y-1"
        >
          {llmReasoning.map((reasoning) => (
            <div key={reasoning.id} className="flex items-center justify-between">
              <span className="text-gray-900 text-xs">{reasoning.step}:</span>
              <div className="flex items-center space-x-1">
                <span className={`text-xs ${reasoning.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {reasoning.status}
                </span>
                <span className="text-gray-500 text-xs">{(reasoning.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
          {llmReasoning.length === 0 && (
            <div className="text-gray-500 text-xs italic">AI processing...</div>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-2">
        <button 
          onClick={resetConversation}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={handleCallToggle}
          className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
            isCallActive 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isCallActive ? 'End Call' : 'Start Call'}
        </button>
      </div>
    </div>
  );
};

export default AIClinicWidget;