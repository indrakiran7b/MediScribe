import whisper
import pyaudio
import numpy as np
import torch
import threading
import queue
import time
import streamlit as st

# Initialize Whisper model and move it to GPU
model = whisper.load_model("medium").to("cuda")

# Audio recording parameters
CHUNK = 2048
FORMAT = pyaudio.paFloat32
CHANNELS = 1
RATE = 24000

# Initialize PyAudio
p = pyaudio.PyAudio()

# Create a queue to store audio chunks
audio_queue = queue.Queue()

# Flag to control recording
is_recording = False

# Store transcribed text
transcribed_text = ""

# Function to record audio
def record_audio():
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    while is_recording:
        data = stream.read(CHUNK)
        audio_queue.put(data)

    stream.stop_stream()
    stream.close()

# Function to transcribe audio in real-time
def transcribe_audio(text_display):
    global transcribed_text

    while is_recording:
        # Collect 5 seconds of audio
        audio_data = []
        for _ in range(0, int(RATE / CHUNK * 5)):
            if not is_recording:
                break
            audio_data.append(audio_queue.get())

        if not is_recording:
            break

        # Convert audio data to numpy array
        audio_np = np.frombuffer(b''.join(audio_data), dtype=np.float32)

        # Pad or trim audio to fit Whisper model's requirements
        audio_np = whisper.pad_or_trim(audio_np)

        # Move audio data to GPU for processing
        audio_tensor = torch.tensor(audio_np).to("cuda")

        # Make log-Mel spectrogram on GPU
        mel = whisper.log_mel_spectrogram(audio_tensor).to(model.device)

        # Decode the audio on GPU
        options = whisper.DecodingOptions(fp16=True)  # Enable fp16 for faster decoding
        result = whisper.decode(model, mel, options)

        # Append the recognized text to the transcribed_text variable
        transcribed_text += result.text + " "

        # Update the real-time transcription display
        text_display.text_area("Transcribed Text", transcribed_text)

# Streamlit app layout
st.title("Real-time Audio Transcription with Whisper")

# Create an empty container to display the real-time transcription
text_display = st.empty()

# Buttons for controlling recording
if st.button("Start Recording"):
    is_recording = True
    recording_thread = threading.Thread(target=record_audio)
    transcription_thread = threading.Thread(target=transcribe_audio, args=(text_display,))
    recording_thread.start()
    transcription_thread.start()

if st.button("Stop Recording"):
    is_recording = False
    if 'recording_thread' in globals():
        recording_thread.join()
    if 'transcription_thread' in globals():
        transcription_thread.join()

# Button to save the transcription to a file
if st.button("Save Transcription"):
    with open("transcription.txt", "w") as f:
        f.write(transcribed_text)
    st.success("Transcription saved to transcription.txt")
