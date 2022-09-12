# import torch
# import transformers
# from transformers import pipeline
from backend_core.models import summarization_model

def chunkText(text, max_chunk=500):
    text = text.replace('.', '.<eos>')
    text = text.replace('?', '?<eos>')
    text = text.replace('!', '!<eos>')
    sentences = text.split('<eos>')
    current_chunk = 0
    chunks = []
    for sentence in sentences:
        if len(chunks) == current_chunk + 1:
            if len(chunks[current_chunk]) + len(sentence.split(' ')) <= max_chunk:
                chunks[current_chunk].extend(sentence.split(' '))
            else:
                current_chunk += 1
                chunks.append(sentence.split(' '))
        else:
            print(current_chunk)
            chunks.append(sentence.split(' '))

    for chunk_id in range(len(chunks)):
        chunks[chunk_id] = ' '.join(chunks[chunk_id])
    return chunks




def summarize(text):
    chunks = chunkText(text)
    res = summarization_model(chunks, max_length=120,
                              min_length=30, do_sample=False)
    resText = ' '.join([summ['summary_text'] for summ in res])
    return resText
