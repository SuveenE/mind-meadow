import time
import subprocess
from llm import summarize_conversation
from chroma_db import get_chroma_client, create_chroma_collection, query_chroma
from embed_text import process_and_store_chroma
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

TRANSCRIPTION_FILE = "suveen_audio.txt"

def run_sst_script():
    """Run `sst.py` as a standalone script."""
    try:
        logging.info("Running sst.py...")
        # Run sst.py using subprocess
        subprocess.run(["python3", "sst.py"], check=True)
        logging.info("sst.py completed successfully.")
    except subprocess.CalledProcessError as e:
        logging.error(f"Error running sst.py: {e}")
        return False
    return True

def read_transcription():
    """Read the transcription from suveen_audio.txt."""
    try:
        with open(TRANSCRIPTION_FILE, 'r') as file:
            return file.read().strip()
    except FileNotFoundError:
        logging.warning(f"File {TRANSCRIPTION_FILE} not found.")
        return ""

def main():
    # if not run_sst_script():
    #     logging.error("Failed to run sst.py. Exiting.")
    #     return
    
    # Initialize ChromaDB client and create a collection
    client = get_chroma_client()
    collection = create_chroma_collection(client)

    text = "I want to buy banana, milk and bread from the supermarker today."
    timestamp = time.time()
    
    # Store the embedding and text in ChromaDB
    # process_and_store_chroma(text, timestamp, collection)
    logging.info(f"Stored text at {timestamp}: {text}")  
    
    # Query for topics in the last 30 seconds
    time_threshold = (datetime.now() - timedelta(seconds=30)).timestamp()
    results = query_chroma(collection, time_threshold)
    topic = summarize_conversation(results)
    logging.info(f"Topic from last {30} seconds: {topic}")
        
    time.sleep(10)  

if __name__ == "__main__":
    main()
