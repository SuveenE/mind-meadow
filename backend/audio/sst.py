import pyaudio
import wave
import whisper

# Audio recording parameters
RATE = 16000
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RECORD_SECONDS = 5  # Record for 5 seconds
WAVE_OUTPUT_FILENAME = "output.wav"
TRANSCRIPTION_FILENAME = "suveen_audio.txt"  # File to save the transcription

# Function to record audio for 5 seconds and save to a WAV file
def record_audio():
    p = pyaudio.PyAudio()

    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    print("Recording for 5 seconds...")

    frames = []
    for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)

    print("Recording complete.")

    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    p.terminate()

    # Save the recorded data to a WAV file
    wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()

    print(f"Audio saved as {WAVE_OUTPUT_FILENAME}")

# Function to transcribe the WAV file using Whisper and save to a file
def transcribe_audio(wav_filename, output_filename):
    print("Transcribing the WAV file...")
    model = whisper.load_model("small")
    result = model.transcribe(wav_filename)  # Transcribe the WAV file

    # Save the transcription to a file
    with open(output_filename, 'w') as f:
        f.write(result["text"])

    print(f"Transcription saved to {output_filename}")

if __name__ == "__main__":
    # Step 1: Record audio for 5 seconds
    record_audio()

    # Step 2: Transcribe the WAV file using Whisper and save the transcription to a file
    transcribe_audio(WAVE_OUTPUT_FILENAME, TRANSCRIPTION_FILENAME)

