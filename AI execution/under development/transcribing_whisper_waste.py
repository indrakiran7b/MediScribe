import whisper
import sounddevice as sd
import queue
import numpy as np
import torch
import threading
import time

# Load Whisper model with GPU acceleration (if available)
model = whisper.load_model("tiny").cuda()  # Use GPU if available

# Queue to hold audio chunks
audio_queue = queue.Queue()
recording = False
transcription = []

# Function to process audio input in real-time
def audio_callback(indata, frames, time, status):
    if recording:
        audio_queue.put(indata.copy())

# Function to start recording
def start_recording():
    global recording, transcription
    recording = True
    transcription = []
    print("Recording started...")
    
    # Start the sounddevice InputStream for real-time recording
    with sd.InputStream(callback=audio_callback, channels=1, samplerate=16000, dtype='float32'):
        while recording:
            if not audio_queue.empty():
                audio_data = audio_queue.get()
                # Process audio chunk for transcription
                audio_data = torch.from_numpy(audio_data).cuda()  # Send audio to GPU
                # Whisper transcribes the audio in real-time
                result = model.transcribe(audio_data)
                transcription.append(result['text'])  # Collect transcription
            time.sleep(0.1)  # Short pause to avoid busy waiting

# Function to stop recording and save transcription
def stop_recording():
    global recording
    recording = False
    print("Recording stopped.")
    
    # Join the transcriptions and save to a text file
    full_transcription = " ".join(transcription)
    
    with open("transcription.txt", "w") as f:
        f.write(full_transcription)
    
    print("Transcription saved to 'transcription.txt'.")
    print("Full transcription:", full_transcription)

# Run the real-time transcription system
if __name__ == "__main__":
    print("Press 'Enter' to start recording...")
    input()  # Wait for user input to start recording
    # Run the recording in a separate thread so it doesn’t block execution
    threading.Thread(target=start_recording).start()

    print("Press 'Enter' again to stop recording...")
    input()  # Wait for user input to stop recording
    stop_recording()
