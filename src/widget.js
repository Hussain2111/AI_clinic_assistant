import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, Clock, User, Mic, MicOff, Volume2, Play, Pause } from 'lucide-react';

const AIClinicWidget = () => {
  const [callData, setCallData] = useState({
    from: '+1 (555) 123-4567',
    duration: 0,
    status: 'active',
    patientId: 'PT-2024-001',
    patientName: 'Sarah Johnson',
    startTime: new Date()
  });

  const [audioLevel, setAudioLevel] = useState(0);
  const [transcription, setTranscription] = useState([]);
  const [llmReasoning, setLlmReasoning] = useState([]);
  const [isCallActive, setIsCallActive] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [voiceDiagnostics, setVoiceDiagnostics] = useState([]);

  const transcriptionRef = useRef(null);
  const reasoningRef = useRef(null);
  const canvasRef = useRef(null);
  const diagnosticsRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  // Fake conversation timeline with speaker changes and audio levels
  const conversationTimeline = [
    { time: 0, speaker: 'Assistant', text: 'Hello! Thank you for calling. Can you please verify your date of birth?', audioIntensity: 0.6, duration: 4000 },
    { time: 5000, speaker: 'Caller', text: 'Sure, it\'s March 15th, 1985.', audioIntensity: 0.8, duration: 3000 },
    { time: 9000, speaker: 'Assistant', text: 'Thank you, Sarah. I see your information here. What can I help you with today?', audioIntensity: 0.5, duration: 4500 },
    { time: 14500, speaker: 'Caller', text: 'I\'ve been having persistent headaches for the past week and wanted to schedule an appointment.', audioIntensity: 0.9, duration: 5000 },
    { time: 20500, speaker: 'Assistant', text: 'I understand your concern. Let me check Dr. Smith\'s availability for a consultation.', audioIntensity: 0.7, duration: 4000 },
    { time: 25500, speaker: 'Caller', text: 'That would be great, thank you.', audioIntensity: 0.6, duration: 2500 },
    { time: 29000, speaker: 'Assistant', text: 'I have an opening tomorrow at 2:30 PM or Friday at 10:00 AM. Which works better for you?', audioIntensity: 0.6, duration: 5000 }
  ];

  const reasoningTimeline = [
    { time: 1000, step: 'Patient Identification', status: 'completed', details: 'Verified caller identity using DOB', confidence: 0.95 },
    { time: 6000, step: 'Intent Recognition', status: 'processing', details: 'Analyzing conversation for primary intent', confidence: 0.85 },
    { time: 15000, step: 'Symptom Analysis', status: 'completed', details: 'Detected headache symptoms - flagged for medical attention', confidence: 0.92 },
    { time: 21000, step: 'Provider Matching', status: 'processing', details: 'Matching symptoms with appropriate specialist', confidence: 0.88 },
    { time: 26000, step: 'Availability Check', status: 'completed', details: 'Found available slots with Dr. Smith', confidence: 0.98 },
    { time: 30000, step: 'Appointment Options', status: 'processing', details: 'Presenting scheduling options to patient', confidence: 0.94 }
  ];

  const voiceDiagnosticsTimeline = [
    { time: 2000, symptom: 'Voice Quality', status: 'analyzing', finding: 'Normal vocal tone and clarity', confidence: 0.88, severity: 'normal' },
    { time: 7000, symptom: 'Coughing', status: 'detected', finding: 'Mild dry cough detected (2 instances)', confidence: 0.92, severity: 'mild' },
    { time: 12000, symptom: 'Breathing Pattern', status: 'analyzing', finding: 'Regular breathing rhythm observed', confidence: 0.85, severity: 'normal' },
    { time: 16000, symptom: 'Speech Pace', status: 'completed', finding: 'Slightly slower speech - possible fatigue', confidence: 0.79, severity: 'mild' },
    { time: 22000, symptom: 'Voice Strain', status: 'completed', finding: 'No signs of vocal strain or hoarseness', confidence: 0.94, severity: 'normal' },
    { time: 28000, symptom: 'Respiratory Distress', status: 'completed', finding: 'No shortness of breath detected', confidence: 0.96, severity: 'normal' }
  ];

  // Initialize fake audio context for realistic waveform
  useEffect(() => {
    // Create a more realistic waveform based on conversation timeline
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
        // Fade out the waveform when call is inactive
        waveData.shift();
        waveData.push(0);
      } else {
        const currentTime = Date.now() - startTime;
        let intensity = 0;
        let speakingNow = null;

        // Find current speaker and intensity from timeline
        for (const event of conversationTimeline) {
          if (currentTime >= event.time && currentTime < event.time + event.duration) {
            intensity = event.audioIntensity;
            speakingNow = event.speaker;
            break;
          }
        }

        // Add some randomness for realistic effect
        const baseNoise = Math.random() * 0.1;
        const speechPattern = Math.sin(currentTime * 0.02) * intensity;
        const finalIntensity = (speechPattern + baseNoise) * height * 0.4;

        waveData.shift();
        waveData.push(finalIntensity);
        
        setAudioLevel(Math.abs(finalIntensity) / (height * 0.4));
        setCurrentSpeaker(speakingNow);
      }

      // Clear canvas
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, height);

      // Draw waveform with speaker-based coloring
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      if (currentSpeaker === 'Caller') {
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#34d399');
      } else if (currentSpeaker === 'Assistant') {
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#60a5fa');
      } else {
        gradient.addColorStop(0, '#6b7280');
        gradient.addColorStop(1, '#9ca3af');
      }

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      waveData.forEach((value, index) => {
        const x = index;
        const y = height / 2 - value; // Inverted for better visual
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();

      // Draw mirrored waveform below center line
      ctx.beginPath();
      waveData.forEach((value, index) => {
        const x = index;
        const y = height / 2 + value;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();

      // Draw center line
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      animationId = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isCallActive]);

  // Simulate call duration timer
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

  // Simulate conversation following timeline
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
        
        // Auto-scroll transcription
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

  // Simulate voice diagnostics following timeline
  useEffect(() => {
    if (!isCallActive) return;

    const startTime = Date.now();
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
        
        // Auto-scroll diagnostics
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

  // Simulate LLM reasoning following timeline
  useEffect(() => {
    if (!isCallActive) return;

    const startTime = Date.now();
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
        
        // Auto-scroll reasoning
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

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'normal': return 'text-green-400';
      case 'mild': return 'text-yellow-400';
      case 'moderate': return 'text-orange-400';
      case 'severe': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'normal': return 'bg-green-900 text-green-300';
      case 'mild': return 'bg-yellow-900 text-yellow-300';
      case 'moderate': return 'bg-orange-900 text-orange-300';
      case 'severe': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  const getDiagnosticIcon = (symptom) => {
    switch (symptom) {
      case 'Coughing': return '🤧';
      case 'Voice Quality': return '🎤';
      case 'Breathing Pattern': return '🫁';
      case 'Speech Pace': return '⏱️';
      case 'Voice Strain': return '🗣️';
      case 'Respiratory Distress': return '💨';
      default: return '🔍';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-yellow-400 animate-pulse';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✓';
      case 'processing': return '⟳';
      case 'pending': return '○';
      default: return '○';
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
    <div className="bg-gray-900 text-white rounded-lg shadow-2xl max-w-6xl mx-auto overflow-hidden">
      {/* Single Card Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${isCallActive ? 'bg-green-500' : 'bg-red-500'}`}>
              <PhoneCall className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold">AI Clinical Assistant Control Panel</h1>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${isCallActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {isCallActive ? 'Live Call' : 'Call Ended'}
            </div>
            {currentSpeaker && (
              <div className="px-3 py-1 rounded-full text-sm bg-purple-900 text-purple-300">
                🎤 {currentSpeaker}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={resetConversation}
              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              Reset
            </button>
            <button 
              onClick={handleCallToggle}
              className={`px-4 py-2 rounded-lg font-medium ${isCallActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
            >
              {isCallActive ? 'End Call' : 'Start Call'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Single Card with Sections in Separate Rows */}
      <div className="p-6 space-y-6">
        {/* Row 1 - Waveform */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center space-x-2">
              {audioLevel > 0.2 ? <Volume2 className="w-4 h-4 text-green-400" /> : <Mic className="w-4 h-4 text-gray-400" />}
              <span>Live Audio Waveform</span>
              {currentSpeaker && (
                <span className={`text-sm px-2 py-1 rounded ${currentSpeaker === 'Caller' ? 'bg-green-700' : 'bg-blue-700'}`}>
                  {currentSpeaker} Speaking
                </span>
              )}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Level: <span className="font-mono">{(audioLevel * 100).toFixed(0)}%</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${audioLevel > 0.3 ? 'bg-green-500' : 'bg-gray-500'} ${audioLevel > 0.3 ? 'animate-pulse' : ''}`}></div>
            </div>
          </div>
          <div className="bg-gray-900 rounded p-3">
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={100} 
              className="w-full h-24"
            />
          </div>
        </div>

        {/* Row 2 - Call Data */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-3 flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Call Information</span>
          </h3>
          <div className="grid grid-cols-5 gap-6">
            <div className="flex flex-col space-y-1">
              <span className="text-gray-400 text-sm">From</span>
              <span className="font-mono text-white">{callData.from}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-gray-400 text-sm">Patient</span>
              <span className="font-medium text-white">{callData.patientName}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-gray-400 text-sm">Patient ID</span>
              <span className="text-blue-400">{callData.patientId}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-gray-400 text-sm">Duration</span>
              <span className="font-mono text-green-400 text-lg">{formatDuration(callData.duration)}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-gray-400 text-sm">Started</span>
              <span className="text-white">{callData.startTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Row 3 - Transcription */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-3 flex items-center space-x-2">
            <Mic className="w-4 h-4" />
            <span>Live Transcription</span>
          </h3>
          <div 
            ref={transcriptionRef}
            className="bg-gray-900 rounded p-4 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600"
          >
            {transcription.map((message) => (
              <div key={message.id} className="mb-3 last:mb-0">
                <div className="flex items-start space-x-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    message.speaker === 'Assistant' ? 'bg-blue-600' : 'bg-green-600'
                  }`}>
                    {message.speaker}
                  </span>
                  <span className="text-xs text-gray-400">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm pl-2 border-l-2 border-gray-700">
                  {message.text}
                </p>
              </div>
            ))}
            {transcription.length === 0 && (
              <div className="text-gray-500 text-sm italic">
                Waiting for conversation to begin...
              </div>
            )}
          </div>
        </div>

        {/* Row 4 - Voice Diagnostics */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-3 flex items-center space-x-2">
            <span className="text-red-400">🩺</span>
            <span>Voice Diagnostics</span>
            <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded">
              AI Health Analysis
            </span>
          </h3>
          <div 
            ref={diagnosticsRef}
            className="bg-gray-900 rounded p-4 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600"
          >
            {voiceDiagnostics.map((diagnostic) => (
              <div key={diagnostic.id} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getDiagnosticIcon(diagnostic.symptom)}</span>
                    <span className="text-sm font-medium">{diagnostic.symptom}</span>
                    <span className={`text-xs px-2 py-1 rounded ${getSeverityBadge(diagnostic.severity)}`}>
                      {diagnostic.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                      {(diagnostic.confidence * 100).toFixed(0)}%
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      diagnostic.status === 'completed' ? 'bg-green-900 text-green-300' :
                      diagnostic.status === 'detected' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-blue-900 text-blue-300'
                    }`}>
                      {diagnostic.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 pl-8">
                  {diagnostic.finding}
                </p>
                <div className="text-xs text-gray-500 pl-8 mt-1">
                  {diagnostic.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            {voiceDiagnostics.length === 0 && (
              <div className="text-gray-500 text-sm italic">
                Voice analysis will appear here...
              </div>
            )}
          </div>
        </div>

        {/* Row 5 - AI Reasoning */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-3 flex items-center space-x-2">
            <span className="text-purple-400">🧠</span>
            <span>AI Reasoning</span>
          </h3>
          <div 
            ref={reasoningRef}
            className="bg-gray-900 rounded p-4 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600"
          >
            {llmReasoning.map((reasoning) => (
              <div key={reasoning.id} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${getStatusColor(reasoning.status)}`}>
                      {getStatusIcon(reasoning.status)}
                    </span>
                    <span className="text-sm font-medium">{reasoning.step}</span>
                  </div>
                  {reasoning.confidence && (
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                      {(reasoning.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-300 pl-6">
                  {reasoning.details}
                </p>
                <div className="text-xs text-gray-500 pl-6 mt-1">
                  {reasoning.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            {llmReasoning.length === 0 && (
              <div className="text-gray-500 text-sm italic">
                AI reasoning will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIClinicWidget;