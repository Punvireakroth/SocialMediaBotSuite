from khmernltk import word_tokenize
import sys
import json

def tokenize_text(text):
    tokens = word_tokenize(text, return_tokens=True)
    return tokens

if __name__ == "__main__":
    input_text = sys.argv[1]
    tokens = tokenize_text(input_text)
    print(json.dumps(tokens))