from audio.pinecone_utils import query_pinecone, recall_things
from audio.llm import recall_things_answer
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
<<<<<<< HEAD
from pydantic import BaseModel

class AudioRequest(BaseModel):
    query: str
=======
from video.face_verification import find_face_name 
from PIL import Image
from io import BytesIO
>>>>>>> e65feb5 (fix backend)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    print("getting health check request")
    return {"status": "OK"}

@app.post("/query")
async def query(request: AudioRequest):
    results = recall_things(request.query)
    topic = recall_things_answer(results, request.query)
    return topic

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    print("processing!!")
        # Read the file as bytes
    file_bytes = await file.read()

    # Open the image with PIL
    image = Image.open(BytesIO(file_bytes))

    # Save the image locally
    output_path = "video/tmp.jpg"
    image.save(output_path)
    find_face_name(output_path)
    
    # contents = await file.read()
    # nparr = np.frombuffer(contents, np.uint8)
    # img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    # # Process the image with OpenCV (e.g., convert to grayscale)
    # gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # # Perform additional image processing tasks here

    return {"status": "Image received and processed"}