# transcribe.py
import sys
import speech_recognition as sr

recognizer = sr.Recognizer()
audio_file_path = sys.argv[1]

with sr.AudioFile(audio_file_path) as source:
    audio_data = recognizer.record(source)
    try:
        text = recognizer.recognize_google(audio_data)
        print(text)
    except sr.UnknownValueError:
        print("Unable to understand audio")
    except sr.RequestError:
        print("Speech recognition service unavailable")
