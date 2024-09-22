"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { PlusIcon } from "@heroicons/react/20/solid";

interface AddLocationCardProps {
  onAddLocation: () => void;
}

const AddLocationCard = ({ onAddLocation }: AddLocationCardProps) => {
  const [open, setOpen] = useState(false);

  // Handle form submission (for adding Studio45 location)
  const handleAddLocation = () => {
    onAddLocation();
    setOpen(false); // Close the popup after adding
  };

  return (
    <>
      <Card
        onClick={() => setOpen(!open)}
        className="p-0 cursor-pointer hover:scale-105 ease-in-out duration-300 h-40 w-36 ml-1 mr-3 rounded-xl shrink-0 overflow-hidden shadow-md bg-gray-100 flex items-center justify-center relative"
      >
        <CardContent className="flex justify-center items-center p-0">
          <PlusIcon className="h-16 w-16 text-gray-500" />
        </CardContent>
        <CardTitle className="text-base text-center mt-2 text-gray-700">
          Add Location
        </CardTitle>
      </Card>

      {open && (
        <div className="absolute top-16 left-0 mt-2 w-48 p-4 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <div className="text-sm">
            <h3 className="font-bold text-gray-700">Add New Location</h3>
            <p className="mt-2 text-gray-600">Do you want to add Studio45?</p>

            {/* Button to add the location */}
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={handleAddLocation}
            >
              Add Location
            </button>

            {/* Button to close the popup */}
            <button
              className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
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

export default AddLocationCard;
