import streamlit as st
import requests
import google.generativeai as genai  # Install using: pip install google-generativeai

# API Configuration
GEMINI_API_KEY = "AIzaSyCLGC7lKUvlCqruoT9qUszy19iFwQnVpE8"  # Replace with your actual Gemini API Key
UNSPLASH_ACCESS_KEY = "your-unsplash-access-key"  # Replace with your Unsplash API Key

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Streamlit UI Config
st.set_page_config(page_title="Slang Decoder", page_icon="🔥", layout="centered")

st.title("🔥 Slang Decoder App")
st.subheader("Understand slang words & sentences instantly!")

# User input
slang_text = st.text_area("Enter a slang sentence:", placeholder="Type a sentence like 'This party is lit bro!'")

# Function to get meaning from Gemini
def get_slang_meaning(sentence):
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(f"Explain this slang sentence in simple terms: {sentence}")
        return response.text.strip()
    except Exception as e:
        return f"❌ Error fetching meaning: {str(e)}"

# Function to get an image from Unsplash
def get_image(query):
    url = f"https://api.unsplash.com/photos/random?query={query}&client_id={UNSPLASH_ACCESS_KEY}"
    try:
        response = requests.get(url)
        data = response.json()
        if "urls" in data:
            return data["urls"]["regular"]
        return None
    except Exception as e:
        return None

# Button to fetch definition
if st.button("🔍 Decode Slang"):
    if slang_text.strip():
        meaning = get_slang_meaning(slang_text.strip())
        st.success(f"💬 **Meaning:** {meaning}")
        
        # Fetch image related to the slang
        img_url = get_image(slang_text.split()[0])  # Use first word as search query
        if img_url:
            st.image(img_url, caption="Related Image", use_column_width=True)
    else:
        st.warning("⚠️ Please enter a slang sentence!")

# Footer
st.markdown("---")
st.markdown("👨‍💻 Built with ❤️ using **Streamlit & Gemini AI**")
