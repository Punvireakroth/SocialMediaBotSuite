import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# Load lexicons for Khmer language
positive_words = ["ស្រលាញ់", "ល្អ", "អស្ចារ្យ"]
negative_words = ["អាក្រក់", "ស្អប់", "ខ្សោយ"]

def analyze_sentiment(text):
    tokens = nltk.word_tokenize(text)
    positive_score = sum(1 for word in tokens if word in positive_words)
    negative_score = sum(1 for word in tokens if word in negative_words)
    score = positive_score - negative_score
    return "positive" if score > 0 else "negative" if score < 0 else "neutral"

if __name__ == "__main__":
    import sys
    text = sys.argv[1]
    print(analyze_sentiment(text))

