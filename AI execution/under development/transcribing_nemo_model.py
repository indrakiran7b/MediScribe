import nemo.collections.asr as nemo_asr
import sounddevice as sd
import queue
import numpy as np
import torch
import time

# Initialize the NeMo ASR model
asr_model = nemo_asr.models.EncDecCTCModel.from_pretrained("QuartzNet15x5Base-En")

# Queue to store audio chunks
audio_queue = queue.Queue()
recording = False
transcription = []

# Function to process audio input in real-time
def audio_callback(indata, frames, time, status):
    if recording:
        audio_queue.put(indata.copy())

# Start recording audio
def start_recording():
    global recording, transcription
    recording = True
    transcription = []
    print("Recording started...")
    
    # Start the sounddevice InputStream for real-time recording
    with sd.InputStream(callback=audio_callback, channels=1, samplerate=16000):
        while recording:
            # Process the audio queue for real-time transcription
            if not audio_queue.empty():
                audio_chunk = audio_queue.get()
                audio_chunk = torch.from_numpy(audio_chunk).float()
                logits = asr_model.transcribe(audio_chunk)
                transcription.append(logits[0])  # Append transcription
            time.sleep(0.1)  # Prevent busy waiting
    
# Stop recording audio
def stop_recording():
    global recording
    recording = False
    print("Recording stopped.")
    
    # Join the transcription list into a single string
    full_transcription = " ".join(transcription)
    
    # Save the transcription to a text file
    with open("transcription.txt", "w") as f:
        f.write(full_transcription)
    
    print("Transcription saved to 'transcription.txt'.")
    print("Full transcription:", full_transcription)

# Run the transcription system
if __name__ == "__main__":
    print("Press 'Enter' to start recording...")
    input()  # Wait for user input to start recording
    start_recording()
    
    print("Press 'Enter' again to stop recording...")
    input()  # Wait for user input to stop recording
    stop_recording()
