import streamlit as st
import torch
import whisper
import sounddevice as sd
import numpy as np
import wave
import os
from datetime import datetime

# Load Whisper model
@st.cache_resource
def load_whisper_model():
    return whisper.load_model("base").to("cuda")

model = load_whisper_model()

# Initialize session state variables
if 'recording' not in st.session_state:
    st.session_state.recording = False
if 'audio_data' not in st.session_state:
    st.session_state.audio_data = []

# Audio recording parameters
SAMPLE_RATE = 16000
CHANNELS = 1

def record_audio():
    st.session_state.audio_data = sd.rec(int(0.5 * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=CHANNELS)
    sd.wait()
    return st.session_state.audio_data

def transcribe_audio(audio):
    audio_tensor = torch.tensor(audio).float()
    result = model.transcribe(audio_tensor, language="en")
    return result["text"]

st.title("Real-time Speech Transcription")

col1, col2 = st.columns(2)

with col1:
    start_button = st.button("Start Recording")

with col2:
    stop_button = st.button("Stop Recording")

transcription_output = st.empty()  

if start_button:
    st.session_state.recording = True
    st.session_state.audio_data = []

if stop_button:
    st.session_state.recording = False

if st.session_state.recording:
    audio_chunk = record_audio()
    st.session_state.audio_data.extend(audio_chunk)
    
    transcription = transcribe_audio(audio_chunk)
    current_text = transcription_output.text(transcription)
    
    # Append new transcription to the existing text
    if current_text:
        updated_text = current_text + " " + transcription
    else:
        updated_text = transcription
    
    transcription_output.text(updated_text)

if not st.session_state.recording and len(st.session_state.audio_data) > 0:
    # Save audio file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    audio_filename = f"recorded_audio_{timestamp}.wav"
    with wave.open(audio_filename, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(np.array(st.session_state.audio_data).tobytes())
    
    # Save transcription
    transcription = transcribe_audio(np.concatenate(st.session_state.audio_data))
    text_filename = f"transcription_{timestamp}.txt"
    with open(text_filename, 'w') as f:
        f.write(transcription)
    
    st.success(f"Recording saved as {audio_filename} and transcription saved as {text_filename}")
    st.session_state.audio_data = []

st.write("Note: Make sure you have a microphone connected and allowed in your browser.")