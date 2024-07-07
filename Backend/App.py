import os
from tqdm import tqdm
from pydub import AudioSegment
import scipy.io.wavfile as wavfile
import io
import soundfile
from espnet_model_zoo.downloader import ModelDownloader
from espnet2.bin.enh_inference import SeparateSpeech
from speechbrain.inference.VAD import VAD
import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from datasets import load_dataset
file_name = "conv1(1).wav"
def resample_audio(input_path, output_path, target_sample_rate):
    audio = AudioSegment.from_file(input_path)
    if audio.channels > 1:
        audio = audio.split_to_mono()[0]    
    audio = audio.set_frame_rate(target_sample_rate)    
    audio.export(output_path, format="wav")
d = ModelDownloader()
cfg = d.download_and_unpack(
    "espnet/Wangyou_Zhang_chime4_enh_train_enh_conv_tasnet_raw")
separate_speech = {}
# For models downloaded from GoogleDrive, you can use the following script:
enh_model_sc = SeparateSpeech(
    train_config=cfg["train_config"],
    model_file=cfg["model_file"],
    # for segment-wise process on long speech
    normalize_segment_scale=False,
    show_progressbar=True,
    ref_channel=1,
    normalize_output_wav=True,
    device="cpu",
)

def speech_enhancement(file_name):
    mixwav_mc, sr = soundfile.read(file_name)
    # mixwav.shape: num_samples, num_channels
    # mixwav_sc = mixwav_mc[:,4]
    mixwav_sc = mixwav_mc  # [:,4]
    wave = enh_model_sc(mixwav_sc[None, ...], sr)
    soundfile.write(file_name, wave[0].squeeze(), 16000)
VAD = VAD.from_hparams(source="speechbrain/vad-crdnn-libriparty", savedir="pretrained_models/vad-crdnn-libriparty")

def speechbrain_vad(file_name):
    boundaries = VAD.get_speech_segments(file_name)
    VAD.save_boundaries(boundaries)
    VAD.save_boundaries(boundaries, save_path=file_name.replace(".wav", ".txt"))
resample_audio(file_name, file_name.replace(".mp3", ".wav"), 16000)
speech_enhancement(file_name.replace(".mp3", ".wav"))
speechbrain_vad(file_name.replace(".mp3", ".wav"))
device = "cuda:0" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

model_id = "openai/whisper-large-v3" # or whisper-small, whisper-tiny, etc.

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


def stt_whisper(sample, language):
    try:
        result = pipe(sample, generate_kwargs={"language": language, "task": "transcribe"})
    except:
        result = {"text" : "", "chunks" : []}
    return result

text = stt_whisper(file_name, "Arabic")
text