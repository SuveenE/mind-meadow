"use client";

import { queryMemory } from "@/src/actions/query/query";
import { MicIcon, StopCircleIcon } from "lucide-react";
import { useState, useEffect } from "react";

// Extend the window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
let SpeechRecognition: any;

if (typeof window !== 'undefined') {
  SpeechRecognition =
    window.SpeechRecognition || (window as any).webkitSpeechRecognition;
}

export default function Recall() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<
    typeof SpeechRecognition | null
  >(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (isRecording) {
      startRecording();
      startTranscription();
    } else if (mediaRecorder) {
      stopRecording();
      stopTranscription();
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.onstop = async () => {
        await sendAudioToServer();
      };
    }
  };

  const sendAudioToServer = async () => {
    try {
      const response = await queryMemory({ query: transcript });
      console.log('repsonse', response)
      setAnswer(response)
      if (!response) {
        throw new Error("Failed to send audio to server");
      }
      console.log("Audio sent successfully");
    } catch (error) {
      console.error("Error sending audio to server:", error);
    }
  };

  const startTranscription = () => {
    if (!SpeechRecognition) {
      console.error("SpeechRecognition API not supported in this browser");
      return;
    }
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US"; // You can change the language if needed

    recognitionInstance.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          setTranscript((prev) => prev + result[0].transcript + " ");
        } else {
          interimTranscript += result[0].transcript;
        }
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error("SpeechRecognition error:", event.error);
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);
  };

  const stopTranscription = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen mt-36 items-center p-12 gap-4">
      <div className="mr-2 text-xl font-semibold tracking-tight">
        What are you trying to recall?
      </div>
      <div
        className="border rounded-full border-2 hover:bg-slate-200 border-black w-min p-5 cursor-pointer hover:scale-105 ease-in-out duration-300"
        onClick={() => setIsRecording(!isRecording)}
      >
        {isRecording ? <StopCircleIcon size={60} /> : <MicIcon size={60} />}
      </div>
      {/* <div onClick={stopRecording}>Recall</div> */}
      {transcript && (
        <div className="mt-4 p-2 border border-gray-400 rounded w-full max-w-lg">
          <p className="mt-2">Q:{" "}{transcript}</p>
          {answer && <p className="mt-2 font-medium">A:{" "}{answer}</p>}
        </div>
      )}
    </div>
  );
}
