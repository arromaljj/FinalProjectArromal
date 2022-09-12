from transformers import pipeline

factoid_model = pipeline('question-answering')
summarization_model = pipeline("summarization")