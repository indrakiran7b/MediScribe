import gradio as gr
import numpy as np
import torch
import queue
import threading
import time
import sounddevice as sd
from transformers import pipeline

# Load custom Whisper model
transcriber = pipeline("automatic-speech-recognition", model="ylacombe/whisper-large-v3-turbo", device="cuda:0")

# Global variables
audio_queue = queue.Queue()
is_recording = False
transcription = []

# Audio recording parameters
samplerate = 16000
channels = 1
dtype = 'float32'

def audio_callback(indata, frames, time, status):
    """This is called (from a separate thread) for each audio block."""
    if is_recording:
        audio_queue.put(indata.copy())

def process_audio():
    """Process audio chunks from the queue and update transcription."""
    global transcription
    while is_recording:
        audio_data = []
        while not audio_queue.empty():
            audio_data.append(audio_queue.get())
        
        if audio_data:
            audio_data = np.concatenate(audio_data, axis=0)
            audio_data = audio_data.flatten()
            
            # Process audio with custom Whisper model
            result = transcriber({"inputs": audio_data})
            
            # Update transcription
            transcription.append(result["text"])
            
        time.sleep(0.1)  # Small delay to reduce CPU usage

def start_recording():
    """Start recording audio."""
    global is_recording
    is_recording = True
    threading.Thread(target=process_audio, daemon=True).start()
    return gr.update(visible=True), gr.update(visible=False)

def stop_recording():
    """Stop recording audio."""
    global is_recording
    is_recording = False
    return gr.update(visible=False), gr.update(visible=True)

def update_transcription(output):
    """Update the transcription text."""
    global transcription
    while True:
        output.set_value(" ".join(transcription))
        time.sleep(1)

def save_audio(audio):
    """Save the recorded audio file."""
    return audio

# Gradio interface
with gr.Blocks() as app:
    gr.Markdown("# Real-time Custom Whisper Transcription")
    
    with gr.Row():
        start_btn = gr.Button("Start Recording")
        stop_btn = gr.Button("Stop Recording", visible=False)
    
    output = gr.Textbox(label="Transcription", lines=10)
    audio_output = gr.Audio(label="Recorded Audio", visible=False)
    
    start_btn.click(start_recording, outputs=[stop_btn, start_btn])
    stop_btn.click(stop_recording, outputs=[stop_btn, start_btn])
    
    # Start a thread to update transcription every second
    threading.Thread(target=update_transcription, args=(output,), daemon=True).start()
    
    # Save audio file
    audio_output.change(save_audio, inputs=[audio_output], outputs=[audio_output])

# Start the audio stream
stream = sd.InputStream(callback=audio_callback, channels=channels, samplerate=samplerate, dtype=dtype)
stream.start()

# Launch the Gradio app
app.launch()