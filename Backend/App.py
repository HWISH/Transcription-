import os
from tqdm import tqdm
from pydub import AudioSegment
import scipy.io.wavfile as wavfile
import soundfile
from espnet_model_zoo.downloader import ModelDownloader
from espnet2.bin.enh_inference import SeparateSpeech
from speechbrain.inference.VAD import VAD
import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from datasets import load_dataset
from flask import Flask, request, jsonify
import csv
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Model and pipeline setup
d = ModelDownloader()
cfg = d.download_and_unpack("espnet/Wangyou_Zhang_chime4_enh_train_enh_conv_tasnet_raw")

enh_model_sc = SeparateSpeech(
    train_config=cfg["train_config"],
    model_file=cfg["model_file"],
    normalize_segment_scale=False,
    show_progressbar=True,
    ref_channel=1,
    normalize_output_wav=True,
    device="cpu",
)

VAD = VAD.from_hparams(source="speechbrain/vad-crdnn-libriparty", savedir="pretrained_models/vad-crdnn-libriparty")

device = "cuda:0" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

model_id = "openai/whisper-large-v3"
model = AutoModelForSpeechSeq2Seq.from_pretrained(
    model_id, torch_dtype=torch_dtype, low_cpu_mem_usage=True, use_safetensors=True
)
model.to(device)

processor = AutoProcessor.from_pretrained(model_id)

pipe = pipeline(
    "automatic-speech-recognition",
    model=model,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor,
    max_new_tokens=128,
    chunk_length_s=30,
    batch_size=16,
    return_timestamps=True,
    torch_dtype=torch_dtype,
    device=device,
)

# Define utility functions
def resample_audio(input_path, output_path, target_sample_rate):
    audio = AudioSegment.from_file(input_path)
    if audio.channels > 1:
        audio = audio.split_to_mono()[0]    
    audio = audio.set_frame_rate(target_sample_rate)    
    audio.export(output_path, format="wav")

def speech_enhancement(file_name):
    mixwav_mc, sr = soundfile.read(file_name)
    mixwav_sc = mixwav_mc
    wave = enh_model_sc(mixwav_sc[None, ...], sr)
    soundfile.write(file_name, wave[0].squeeze(), 16000)

def speechbrain_vad(file_name):
    boundaries = VAD.get_speech_segments(file_name)
    VAD.save_boundaries(boundaries)
    VAD.save_boundaries(boundaries, save_path=file_name.replace(".wav", ".txt"))

def stt_whisper(file_name, language):
    try:
        result = pipe(file_name, generate_kwargs={"language": language, "task": "transcribe"})
    except Exception as e:
        print(f"Error during transcription: {e}")
        result = {"text" : "", "chunks" : []}
    return result

# Routes
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        file_path = os.path.join("Uploads", file.filename)
        file.save(file_path)
        
        # Process the file
        resampled_file = file_path.replace(".mp3", ".wav")
        resample_audio(file_path, resampled_file, 16000)
        speech_enhancement(resampled_file)
        speechbrain_vad(resampled_file)
        transcription = stt_whisper(resampled_file, "auto")
        
        return jsonify(transcription), 200

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    transcription_id = data.get('transcriptionId')
    feedback = data.get('feedback')
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    csv_file = 'feedback.csv'
    file_exists = os.path.isfile(csv_file)
    
    with open(csv_file, 'a', newline='') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(['Transcription ID', 'Feedback', 'Timestamp'])
        writer.writerow([transcription_id, feedback, timestamp])
    
    return jsonify({"message": "Feedback submitted successfully"}), 200

if __name__ == '__main__':
    if not os.path.exists("Uploads"):
        os.makedirs("Uploads")
    app.run(port=5000)
