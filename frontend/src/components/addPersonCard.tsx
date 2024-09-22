"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { PlusIcon } from "@heroicons/react/20/solid";

const AddPersonCard = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); // Store person's name
  const [image, setImage] = useState<File | null>(null); // Store the uploaded image
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Store image preview URL

  // Handle image selection and display preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      // Use FileReader to create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file); // Read the file as a data URL for preview
    }
  };

  // Handle form submission
  const handleAddPerson = async () => {
    if (!name || !image) {
      alert("Please enter a name and upload an image.");
      return;
    }

    // Create a FormData object to send to the backend
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      const response = await fetch("/api/addPerson", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Person added successfully");
      } else {
        console.error("Failed to add person");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Reset the form after submission
    setName("");
    setImage(null);
    setImagePreview(null);
    setOpen(false);
  };

  return (
    <>
      <Card
        onClick={() => setOpen(!open)}
        className="p-0 cursor-pointer hover:scale-105 ease-in-out duration-300 h-40 w-36 ml-1 mr-3 rounded-xl shrink-0 overflow-hidden shadow-md bg-gray-100 flex flex-col items-center justify-center relative"
      >
        <CardContent className="flex justify-center items-center p-0">
          <PlusIcon className="h-16 w-16 text-gray-500" />
        </CardContent>
        <CardTitle className="text-base text-center mt-2 text-gray-700">
          Add Person
        </CardTitle>
      </Card>

      {open && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              Add New Person
            </h3>

            {/* Input for the person's name */}
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />

            {/* Input for image upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-2"
            />

            {/* Image preview */}
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full rounded-md"
                />
              </div>
            )}

            {/* Button to add the person */}
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={handleAddPerson}
            >
              Add Person
            </button>

            {/* Button to close the popup */}
            <button
              className="mt-2 m-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPersonCard;
