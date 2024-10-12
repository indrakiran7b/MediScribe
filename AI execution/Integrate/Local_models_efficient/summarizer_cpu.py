import warnings
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import re
from typing import List, Dict, Optional
import json
import gradio as gr
import os

class MedicalTranscriptSummarizer:
    def __init__(self, model_name: str = "Ramji/bart-cn-large-medical-summary"):
        warnings.filterwarnings("ignore")
        self.device = "cpu"  # Force CPU usage
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        # Load the model on CPU
        self.model = AutoModelForSeq2SeqLM.from_pretrained(
            model_name,
            torch_dtype=torch.float32  # Use float32 for CPU
        ).to(self.device)
        
        self.summarizer = pipeline(
            "summarization",
            model=self.model,
            tokenizer=self.tokenizer,
            device=-1  # Use -1 for CPU
        )


    def generate_summary_prompt(self, text: str) -> str:
        return f"""Summarize this medical consultation concisely, focusing only on key medical information:

{text}

Include only if present:
1. Patient's main symptoms
2. Relevant medical history
3. Doctor's observations or potential diagnosis
4. Medications discussed
5. Recommendations and follow-up plans"""

    def summarize(self, file_path: str) -> Dict:
        # Load and validate JSON data
        try:
            with open(file_path, 'r') as file:
                data = json.load(file)
                transcript = data.get("transcription", "")
                task = data.get("task", "")
                timestamp = data.get("timestamp", "")
        except (FileNotFoundError, json.JSONDecodeError) as e:
            return {"error": f"File error: {str(e)}"}

        if not transcript:
            return {"error": "No transcription found in the JSON file"}

        # Preprocess and chunk the transcript
        processed_text = self.preprocess_transcript(transcript)
        chunks = self.chunk_text(processed_text)
        
        # Generate summaries for each chunk with the medical prompt
        chunk_summaries = []
        for chunk in chunks:
            prompted_chunk = self.generate_summary_prompt(chunk)
            summary = self.summarizer(
                prompted_chunk,
                max_length=150,
                min_length=50,
                do_sample=False
            )[0]['summary_text']
            chunk_summaries.append(summary)

        combined_summary = ' '.join(chunk_summaries)
        final_prompted_summary = self.generate_summary_prompt(combined_summary)
        final_summary = self.summarizer(
            final_prompted_summary,
            max_length=300,
            min_length=150,
            do_sample=False,
            num_beams=4,
            length_penalty=2.0,
            early_stopping=True
        )[0]['summary_text']

        key_points = self.extract_key_points(final_summary)
        
        return {
            "summary": final_summary,
            "key_points": key_points,
            "task": task,
            "timestamp": timestamp
        }

    def preprocess_transcript(self, text: str) -> str:
        """Clean and format the transcript text."""
        # Remove multiple spaces and newlines
        text = re.sub(r'\s+', ' ', text).strip()
        # Add periods to make text more structured for summarization
        text = re.sub(r'(?<=[a-zA-Z])\s+(?=[A-Z])', '. ', text)
        return text

    def chunk_text(self, text: str, max_chunk_size: int = 512) -> List[str]:
        """Split text into smaller chunks for processing."""
        words = text.split()
        chunks = []
        current_chunk = []
        current_size = 0
        # Tokenize the word to get its size in tokens
        for word in words:
            word_size = len(self.tokenizer.tokenize(word))
             # If adding the word exceeds the max chunk size, finalize the current chunk
            if current_size + word_size > max_chunk_size:
                chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_size = word_size
            # Otherwise, add the word to the current chunk   
            else:
                current_chunk.append(word)
                current_size += word_size
        
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        return chunks

    def extract_key_points(self, summary: str) -> Dict[str, List[str]]:
        categories = {
            "symptoms": r"(?:symptom|pain|discomfort|feeling|ache|nausea|fever|cough|breathing|appetite|fatigue)s?\b",
            "diagnosis": r"(?:diagnos(?:is|ed)|condition|assessment|identified|determined|concluded|findings)\b",
            "medications": r"(?:medication|medicine|pill|drug|prescri(?:bed|ption)|dosage|tablet)\b",
            "recommendations": r"(?:recommend|suggest|advise|prescribe|instruct|guidance|should|needs? to)\b",
            "follow_up": r"(?:follow.?up|next visit|return|check.?up|monitoring|schedule|appointment)\b"
        }
        
        extracted_points = {category: [] for category in categories}
        
        sentences = [s.strip() for s in re.split(r'[.!?]+', summary) if s.strip()]
        
        for sentence in sentences:
            for category, pattern in categories.items():
                if re.search(pattern, sentence, re.IGNORECASE):
                    point = sentence[0].upper() + sentence[1:]
                    if not point.endswith('.'):
                        point += '.'
                    extracted_points[category].append(point)
        
        return {k: sorted(set(v), key=len, reverse=True) 
                for k, v in extracted_points.items() if v}

def summarize_transcript(file_path):
    summarizer = MedicalTranscriptSummarizer()
    result = summarizer.summarize(file_path.name)
    
    if "error" in result:
        return result["error"]
    
    output = f"Task: {result['task']}\n"
    output += f"Timestamp: {result['timestamp']}\n\n"
    output += "Medical Summary:\n"
    output += result["summary"] + "\n\n"
    output += "Key Points:\n"
    for category, points in result["key_points"].items():
        if points:
            output += f"\n{category.title()}:\n"
            for point in points:
                output += f"- {point}\n"
    
    return output

# Create Gradio interface
def summarize_and_download(file):
    summary = summarize_transcript(file)
    output_file = "summary.txt"
    with open(output_file, "w") as f:
        f.write(summary)
    return summary, output_file

iface = gr.Interface(
    fn=summarize_and_download,
    inputs=gr.File(label="Select JSON file"),
    outputs=[gr.Textbox(label="Summary", lines=10), gr.File(label="Download Summary")],
    title="Medical Transcript Summarizer",
    description="Upload a JSON file containing a medical transcript to generate a summary.",
)

# Launch the Gradio app
iface.launch()