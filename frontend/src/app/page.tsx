"use client";

import PersonCard from "../components/personCard";
import LocationCard from "../components/locationCard";
import ConversationCard from "../components/conversationCard";
import { useEffect, useRef, useState } from "react";
import { processAudio } from "../actions/audio/process";
import { Conversation, Person } from "../types/interface";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
let SpeechRecognition: any;

if (typeof window !== "undefined") {
  SpeechRecognition =
    window.SpeechRecognition || (window as any).webkitSpeechRecognition;
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef(null);
  const [nameString, setNameString] = useState("");
  const [imageString, setImageString] = useState("");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    async function getMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    }
    getMedia();

    const captureAndSendFrame = () => {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const base64String = canvasRef.current.toDataURL("image/jpeg", 1.0);

      // Ensure base64 string is complete
      if (base64String && base64String.startsWith("data:image/jpeg;base64,")) {
        setImageString(base64String); // Set the Base64 string
      }

      canvasRef?.current?.toBlob((blob: Blob) => {
        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        fetch("http://localhost:8000/process-image", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              setNameString("");
              throw new Error("Network response was not ok");
            }
            return response.json(); // Assuming your FastAPI backend returns a JSON response
          })
          .then((data) => {
            if (data["name"]) {
              setPersons((prevPersons: Person[]) => {
                // Check if the name already exists
                const exists = prevPersons.some(
                  (person) => person.name === data["name"]
                );
                if (!exists) {
                  return [
                    ...prevPersons,
                    { name: data["name"], image_url: imageString },
                  ];
                }
                return prevPersons; // Return unchanged if the name exists
              });
              setNameString(data["name"]);
            }
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          });
      }, "image/jpeg");
    };

    const interval = setInterval(() => {
      if (isRecording) {
        // Check if recording is active
        captureAndSendFrame();
      }
    }, 2000); // 4 fps

    return () => {
      // Clean up the stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    transcriptRef.current = transcript; // Update the ref whenever transcript changes
  }, [transcript]);

  useEffect(() => {
    if (isRecording) {
      console.log("Recording started");
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
          console.log("transcript", transcript);
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
    const interval = setInterval(async () => {
      // Added async here
      const newConversation = await processAudio({
        query: transcriptRef.current,
      });
      if (newConversation) {
        setConversations((prevConversations: Conversation[]) => [
          ...prevConversations,
          { name: newConversation, time: new Date().toLocaleTimeString() },
        ]);
        setTranscript("");
      }
    }, 10000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-12 gap-4">
      <div className="flex flex-row gap-4">
        <p className="mr-2 text-md font-semibold tracking-tight">
          Hello Suveen 👋!{" "}
        </p>
        <div
          onClick={() => setIsRecording(true)}
          className="ml-3 w-[110px] cursor-pointer text-xs p-2 bg-indigo-200 rounded-md text-center"
        >
          {!isRecording ? "Start Recording" : "Recording 🔴"}
        </div>
      </div>
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-2 w-2/5">
          <p className="mr-2 text-xl font-semibold tracking-tight my-2">
            Recent Location
          </p>
          <div>
            <LocationCard
              name="Studio45, San Francisco"
              image_url="/studio45.jpeg"
              details={currentTime}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-3/5">
          <p className="mr-2 text-xl font-semibold tracking-tight my-2">
            People around you
          </p>
          {persons.length > 0 ? (
            <div>
              {persons
                .slice()
                .reverse()
                .map((person, index) => (
                  <PersonCard
                    name={person.name}
                    image_url={`/${person.name}.jpeg`}
                    details=""
                  />
                ))}
            </div>
          ) : (
            <div className="text-sm">
              Seems like there's no one around you at the moment. Start
              recording to analyse.
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-8 mt-8">
        <div className="flex flex-col gap-2">
          {conversations.length > 0 && (
            <p className="mr-2 text-xl font-semibold tracking-tight my-2">
              Recent Conversations
            </p>
          )}
          <div className="grid grid-cols-3 gap-4">
            {conversations
              .slice()
              .reverse()
              .map((conversation, index) => (
                <ConversationCard
                  key={index}
                  index={index}
                  text={conversation.name}
                  time={conversation.time}
                />
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-8 mt-8">
        <div className="flex flex-col gap-2 w-1/2">
          {isRecording && (
            <p className="mr-2 text-lg font-semibold tracking-tight my-2">
              Live Camera View
            </p>
          )}
          <div>
            {isRecording && (
              <div>
                <video
                  className="rounded-lg"
                  ref={videoRef}
                  autoPlay
                  style={{ width: "400px", height: "300px" }}
                />
                <canvas
                  ref={canvasRef}
                  style={{ display: "none" }}
                  width="400"
                  height="300"
                ></canvas>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
