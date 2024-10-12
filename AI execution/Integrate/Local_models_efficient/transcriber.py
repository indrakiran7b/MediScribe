#import spaces
import torch

import json
import os
from datetime import datetime

import gradio as gr
from transformers import pipeline
from transformers.pipelines.audio_utils import ffmpeg_read

import tempfile
import os

MODEL_NAME = "ylacombe/whisper-large-v3-turbo"
BATCH_SIZE = 8
FILE_LIMIT_MB = 1000
 

device = 0 if torch.cuda.is_available() else "cpu"

pipe = pipeline(
    task="automatic-speech-recognition",
    model=MODEL_NAME,
    chunk_length_s=30,
    device=device,
)


#@spaces.GPU
def transcribe(inputs, task):
    if inputs is None:
        raise gr.Error("No audio file submitted! Please upload or record an audio file before submitting your request.")

    text = pipe(inputs, batch_size=BATCH_SIZE, generate_kwargs={"task": task}, return_timestamps=True)["text"]



    # we can change the file name later here after the backend integration
    # Save transcribed text as JSON


    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"transcription_{timestamp}.json"
    
    json_data = {
        "transcription": text,
        "task": task,
        "timestamp": timestamp
    }
    
    with open(filename, "w") as json_file:
        json.dump(json_data, json_file, indent=4)
    
    return text, f"Transcription saved as {filename}"



demo = gr.Blocks()

mf_transcribe = gr.Interface(
    fn=transcribe,
    inputs=[
        gr.Audio(sources="microphone", type="filepath"),
        gr.Radio(["transcribe", "translate"], label="Task", value="transcribe"),
    ],
    outputs=["text", "text"],
    title="Whisper Large V3 Turbo: Transcribe Audio",
    description=(
        "Transcribe long-form microphone or audio inputs with the click of a button!"
    ),
    allow_flagging="never",
)

file_transcribe = gr.Interface(
    fn=transcribe,
    inputs=[
        gr.Audio(sources="upload", type="filepath", label="Audio file"),
        gr.Radio(["transcribe", "translate"], label="Task", value="transcribe"),
    ],
    outputs=["text", "text"],
    title="Whisper Large V3: Transcribe Audio",
    description=(
        "Transcribe long-form microphone or audio inputs with the click of a button! "
    ),
    allow_flagging="never",
)


with demo:
    gr.TabbedInterface([mf_transcribe, file_transcribe], ["Microphone", "Audio file"])

demo.queue().launch()

