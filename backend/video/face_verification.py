from deepface import DeepFace
import numpy as np
from PIL import Image
# Imports PIL module
# from PIL import Image

# # open method used to open different extension image file
# im = Image.open(r"video/test_images/person1_face1.png")

# # This method will show image in any image viewer
# im.show()

# Compute embeddings for two images
# print("here")
# img1_path = "video/test_images/person2_face1.png"
# img2_path = "video/test_images/taylor_swift4.png"
# embedding1 = DeepFace.represent(img_path=img1_path, model_name="VGG-Face")
# embedding2 = DeepFace.represent(img_path=img2_path, model_name="VGG-Face")
# print("here2")
# print(embedding1)

# metrics = ["cosine", "euclidean", "euclidean_l2"]

#face verification
# try:
#     # do something
#     result = DeepFace.verify(
#         img1_path = img1_path, 
#         img2_path = img2_path, 
#         distance_metric = metrics[1],
#     )
#     print("Result: ", result)
# except Exception as e:
#     # handle it
#     print("Failed to verify face")


def find_face_name(image_array):
    dfs = DeepFace.find(
        # img_path="video/test_images/taylor_swift1.png",
        image_array,
        db_path = "video/test_images2",
    )
    if len(dfs[0]["identity"]):
        print(dfs[0]["identity"][0])
    else:
        print("no matches found")



# Convert to numpy array
img = Image.open("video/test_images/taylor_swift1.png")
img.save("video/tmp.png","PNG")
# img_array = np.array(img)

# # Or use PIL Image object directly
# img_pil = Image.open("image.jpg")
# np.array(Image.open(image_path))

find_face_name("video/tmp.png")