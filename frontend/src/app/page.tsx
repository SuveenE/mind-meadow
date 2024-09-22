"use client"
import PersonCard from "../components/personCard";
import LocationCard from "../components/locationCard";
import ConversationCard from "../components/conversationCard";
import WebCamera from "../components/WebCamera";
import { useEffect, useRef, useState } from "react";
import { processAudio } from "../actions/audio/process";
import { Conversation } from "../types/interface";

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

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
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
  const [isProcessing, setIsProcessing] = useState(false);
  const transcriptRef = useRef(transcript); // Create a ref for the transcript

useEffect(() => {
  transcriptRef.current = transcript; // Update the ref whenever transcript changes
}, [transcript]);

  console.log("transcript", transcript)

  useEffect(() => {
    if (isRecording) {
      console.log("Recording started")
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
       // await sendAudioToServer();
      };
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
          console.log("transcript", transcript)
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

  useEffect(() => {
    const interval = setInterval(async () => { // Added async here
      const newConversation = await processAudio({ query: transcriptRef.current });
      if(newConversation){
        setConversations((prevConversations: Conversation[]) => [
          ...prevConversations,
          { name: newConversation, time: new Date().toLocaleTimeString() },
        ]);
        setTranscript("")
      }
    }, 10000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-12 gap-4">
      <div className="flex flex-row gap-4"><p className="mr-2 text-md font-semibold tracking-tight">Hello Suveen 👋! </p><div onClick={() => setIsRecording(true)} className="ml-3 w-[110px] cursor-pointer text-xs p-2 bg-indigo-200 rounded-md">Start Recording</div></div>
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-2 w-2/5">
          <p className="mr-2 text-xl font-semibold tracking-tight my-2">Recent Location</p>
          <div>
            <LocationCard
              name="Studio45, San Francisco"
              image_url="/sf.webp"
              details="SF"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-3/5">
        <p className="mr-2 text-xl font-semibold tracking-tight my-2">People around you</p>
          <div>
            <PersonCard
              name="Suveen"
              image_url="/suveen.jpeg"
              details="Hello"
            />
            <PersonCard
              name="Dexter"
              image_url="/suveen.jpeg"
              details="Hello"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-8 mt-8">
        <div className="flex flex-col gap-2">
          <p className="mr-2 text-xl font-semibold tracking-tight my-2">Recent Conversations</p>
          <div className="grid grid-cols-3 gap-4">
          {conversations.slice().reverse().map((conversation, index) => (
              <ConversationCard
                key={index}
                text={conversation.name}
                time={conversation.time}
              />
            ))}
          </div>
        </div>
        {/* <div className="flex flex-col gap-2 w-1/2">
        <p className="mr-2 text-xl font-semibold tracking-tight my-2">Suggestions</p>
          <div>
            <PersonCard
              name="Suveen"
              image_url="/suveen.jpeg"
              details="Hello"
            />
          </div>
        </div> */}
      </div>
      <div className="flex flex-row gap-8 mt-8">
        <div className="flex flex-col gap-2 w-1/2">
          <p className="mr-2 text-xl font-semibold tracking-tight my-2">Live Camera View</p>
          <div>
            {/* <WebCamera/> */}
          </div>
        </div>
      </div>
    </div>
  );
}