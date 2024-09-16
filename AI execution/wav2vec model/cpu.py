import pyaudio
import torch
import numpy as np
import soundfile as sf
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import queue

# Initialize model and processor with a larger, more accurate model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model_name = "facebook/wav2vec2-large-960h-lv60"  # Better accuracy model
model = Wav2Vec2ForCTC.from_pretrained(model_name).to(device)
processor = Wav2Vec2Processor.from_pretrained(model_name)

# Initialize a queue for real-time audio processing
audio_queue = queue.Queue()

# Constants
RATE = 16000  # Sample rate for Wav2Vec2
CHUNK = int(RATE / 512)  # Process larger chunks for better context (ms chunks)

def audio_callback(in_data, frame_count, time_info, status):
    try:
        audio_data = np.frombuffer(in_data, dtype=np.int16)
        audio_queue.put(audio_data)
        return (in_data, pyaudio.paContinue)
    except Exception as e:
        print(f"Error in audio callback: {e}")
        return (None, pyaudio.paAbort)

def transcribe_speech():
    audio_buffer = []
    
    while True:
        if not audio_queue.empty():
            audio_chunk = audio_queue.get()
            audio_buffer.extend(audio_chunk)
            
            if len(audio_buffer) >= RATE:  # Process 1 second of audio at a time
                try:
                    # Preprocess and transcribe
                    input_values = processor(
                        np.array(audio_buffer, dtype=np.float32),
                        return_tensors="pt",
                        sampling_rate=RATE
                    ).input_values

                    with torch.no_grad():
                        logits = model(input_values.to(device)).logits
                    predicted_ids = torch.argmax(logits, dim=-1)
                    transcription = processor.decode(predicted_ids[0])

                    print(f"Transcription: {transcription}")
                except Exception as e:
                    print(f"Error during transcription: {e}")
                    return 1  # Return error code for transcription failure

                audio_buffer = []  # Clear buffer after processing
    return 0  # Return 0 if transcription completes successfully

def start_stream():
    p = pyaudio.PyAudio()

    try:
        stream = p.open(format=pyaudio.paInt16,
                        channels=1,
                        rate=RATE,
                        input=True,
                        frames_per_buffer=CHUNK,
                        stream_callback=audio_callback)
        
        print("Recording started... Press Ctrl+C to stop.")
        
        transcribe_speech()

    except Exception as e:
        print(f"Error in stream setup: {e}")
        return 2  # Return error code for audio stream issues
    
    finally:
        stream.stop_stream()
        stream.close()
        p.terminate()
    
    return 0  # Return 0 if streaming stops successfully

if __name__ == "__main__":
    result = start_stream()
    if result != 0:
        print(f"Program exited with error code: {result}")
