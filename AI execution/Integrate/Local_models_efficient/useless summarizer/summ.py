import warnings

import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline, BitsAndBytesConfig
import re
from typing import List, Dict, Optional
import json
import gradio as gr

class MedicalTranscriptSummarizer:
    def __init__(self, model_name: str = "facebook/bart-large-cnn"):
        """
        Initialize with a medical-domain specific model.
        GanjinZero/biobart-v2-base
        GanjinZero/biobart-v2-large is specifically fine-tuned on medical texts
        and performs well for medical summarization tasks.
        """
        """
        Initialize the summarizer with a specified model.
        Recommended models:
        - "google/flan-t5-base" (1.2GB)
        - "facebook/bart-large-cnn" (1.6GB)
        - "philschmid/flan-t5-base-samsum" (1.2GB)
        - "MBZUAI/LaMini-Flan-T5-248M" (248MB)
        """
        warnings.filterwarnings("ignore", category=FutureWarning, module="transformers.tokenization_utils_base")
        warnings.filterwarnings("ignore", category=UserWarning, module="transformers.models.bart.modeling_bart")

        # Determine if CUDA (GPU) is available, otherwise use CPU
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_name = model_name
        
        # Configure quantization
        #BitsAndBytesConfig = BitsAndBytesConfig(load_in_8bit=True)
        BitsAndBytesConfig(load_in_8bit=True)
        # Load model with 8-bit quantization for reduced memory usage
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(
            model_name,
            device_map="auto",
            load_in_8bit=True,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32
        )
        
        # Load the model with 8-bit quantization to reduce memory usage
        self.summarizer = pipeline(
            "summarization",
            model=self.model,
            tokenizer=self.tokenizer,
            #device=0 if self.device == "cuda" else -1
        )

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
        """
        Enhanced extraction of medical key points using regex patterns and
        medical terminology markers.
        """
        # Expanded patterns for better medical term detection
        categories = {
            "symptoms": r"(?:symptom|pain|discomfort|feeling|ache|nausea|fever|cough|breathing|appetite|fatigue)s?\b",
            "diagnosis": r"(?:diagnos(?:is|ed)|condition|assessment|identified|determined|concluded|findings)\b",
            "medications": r"(?:medication|medicine|pill|drug|prescri(?:bed|ption)|dosage|tablet)\b",
            "recommendations": r"(?:recommend|suggest|advise|prescribe|instruct|guidance|should|needs? to)\b",
            "follow_up": r"(?:follow.?up|next visit|return|check.?up|monitoring|schedule|appointment)\b"
        }
        
        extracted_points = {category: [] for category in categories}
        
        # Split into sentences and process each
        sentences = [s.strip() for s in re.split(r'[.!?]+', summary) if s.strip()]
        
        for sentence in sentences:
            # Check each sentence against patterns
            for category, pattern in categories.items():
                if re.search(pattern, sentence, re.IGNORECASE):
                    # Clean and format the extracted point
                    point = sentence[0].upper() + sentence[1:]
                    if not point.endswith('.'):
                        point += '.'
                    extracted_points[category].append(point)
        
        # Remove empty categories and sort points by relevance
        return {k: sorted(set(v), key=len, reverse=True) 
                for k, v in extracted_points.items() if v}

    def generate_patient_friendly_summary(self, summary: Dict) -> str:
        """
        Generates a patient-friendly formatted summary from the extracted information.
        """
        output = []
        
        # Add task and timestamp if available
        if summary.get("task"):
            output.append(f"Visit Type: {summary['task']}")
        if summary.get("timestamp"):
            output.append(f"Date: {summary['timestamp']}")
        
        output.append("\nSummary of Your Visit:")
        output.append(summary['full_summary'])
        
        if summary['key_points']:
            output.append("\nKey Points from Your Visit:")
            
            # Order of sections for logical flow
            section_order = ['symptoms', 'diagnosis', 'medications', 
                            'recommendations', 'follow_up']
            
            for section in section_order:
                if section in summary['key_points']:
                    friendly_title = {
                        'symptoms': 'Your Symptoms',
                        'diagnosis': 'What We Found',
                        'medications': 'Medications',
                        'recommendations': 'What You Should Do',
                        'follow_up': 'Next Steps'
                    }
                    
                    output.append(f"\n{friendly_title[section]}:")
                    for point in summary['key_points'][section]:
                        output.append(f"• {point}")
        
        return "\n".join(output)

    def summarize(self, file_path: str) -> Dict:
        """
        Main method to process JSON transcript file and generate summary.
        Returns a dictionary with full summary and extracted key points.
        """
        # Read the transcript from the JSON file
        try:
            with open(file_path, 'r') as file:
                data = json.load(file)
                transcript = data.get("transcription", "")
                task = data.get("task", "")
                timestamp = data.get("timestamp", "")
        except FileNotFoundError:
            return {"error": f"File not found: {file_path}"}
        except json.JSONDecodeError:
            return {"error": f"Invalid JSON file: {file_path}"}

        if not transcript:
            return {"error": "No transcription found in the JSON file"}

        # Chunk the transcript into smaller pieces
        processed_text = self.preprocess_transcript(transcript)
        chunks = self.chunk_text(processed_text)
        
        # Summarize each chunk
        chunk_summaries = [
            self.summarizer(chunk, max_length=250, min_length=30)[0]['summary_text']
            for chunk in chunks
        ]
        
        # Combine chunk summaries and create final summary
        combined_summary = ' '.join(chunk_summaries)
        final_summary = self.summarizer(
            combined_summary,
            max_length=250,
            min_length=100
        )[0]['summary_text']
        
        # Extract key points from the final summary
        key_points = self.extract_key_points(final_summary)
        
        return {
            "full_summary": final_summary,
            "key_points": key_points,
            "task": task,
            "timestamp": timestamp
        }

def summarize_transcript(file_path):
    summarizer = MedicalTranscriptSummarizer()
    result = summarizer.summarize(file_path.name)
    
    if "error" in result:
        return result["error"]
    
    output = f"Task: {result['task']}\n"
    output += f"Timestamp: {result['timestamp']}\n\n"
    output += "Summary:\n"
    output += result["full_summary"] + "\n\n"
    output += "Key Points:\n"
    for category, points in result["key_points"].items():
        output += f"\n{category.title()}:\n"
        for point in points:
            output += f"- {point}\n"
    
    return output

# Create Gradio interface
iface = gr.Interface(
    fn=summarize_transcript,
    inputs=gr.File(label="Select JSON file"),
    outputs=gr.Textbox(label="Summary", lines=10),
    title="Medical Transcript Summarizer",
    description="Upload a JSON file containing a medical transcript to generate a summary.",
)

# Launch the Gradio app
iface.launch()