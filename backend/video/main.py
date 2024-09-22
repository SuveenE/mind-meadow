# # main.py
# from fastapi import FastAPI, File, UploadFile
# # import cv2
# import numpy as np

# app = FastAPI()

# @app.post("/process-image")
# async def process_image(file: UploadFile = File(...)):
#     contents = await file.read()
#     nparr = np.frombuffer(contents, np.uint8)
#     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#     # Process the image with OpenCV
#     return {"status": "Image received"}


# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    print("processing!!")
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    # Process the image with OpenCV (e.g., convert to grayscale)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Perform additional image processing tasks here
    return {"status": "Image received and processed"}