import whisper
import pyaudio
import numpy as np
import threading
import queue
import time

# Initialize Whisper model
model = whisper.load_model("medium")

# Audio recording parameters
CHUNK = 1024
FORMAT = pyaudio.paFloat32
CHANNELS = 1
RATE = 24000
RECORD_SECONDS = 30

# Initialize PyAudio
p = pyaudio.PyAudio()

# Create a queue to store audio chunks
audio_queue = queue.Queue()

# Flag to control recording
is_recording = True

def record_audio():
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    print("* Recording")

    while is_recording:
        data = stream.read(CHUNK)
        audio_queue.put(data)

    print("* Done recording")

    stream.stop_stream()
    stream.close()

# Start recording in a separate thread
recording_thread = threading.Thread(target=record_audio)
recording_thread.start()

try:
    while True:
        # Collect 5 seconds of audio
        audio_data = []
        for _ in range(0, int(RATE / CHUNK * 5)):
            audio_data.append(audio_queue.get())

        # Convert audio data to numpy array
        audio_np = np.frombuffer(b''.join(audio_data), dtype=np.float32)

        # Pad or trim audio to fit 30 seconds
        audio_np = whisper.pad_or_trim(audio_np)

        # Make log-Mel spectrogram
        mel = whisper.log_mel_spectrogram(audio_np).to(model.device)

        # Decode the audio
        options = whisper.DecodingOptions(fp16=False)
        result = whisper.decode(model, mel, options)

        # Print the recognized text
        print(result.text)

        time.sleep(0.1)  # Small delay to prevent excessive CPU usage

except KeyboardInterrupt:
    print("Stopping recording...")
    is_recording = False
    recording_thread.join()
    p.terminate()
