from deepface import DeepFace
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

dfs = DeepFace.find(
    img_path="video/test_images/taylor_swift1.png",
     
)
if len(dfs[0]["identity"]):
    print(dfs[0]["identity"][0])
else:
    print("no matches found")
