"use client";

import { useState, useEffect } from "react";
import PersonCard from "../components/personCard";
import LocationCard from "../components/locationCard";
import ConversationCard from "../components/conversationCard";
import WebCamera from "../components/WebCamera";

export default function Home() {
  // State to track added locations
  const [locations, setLocations] = useState([
    {
      name: "Golden Gate Bridge",
      image_url: "/sf.webp",
      details: "San Francisco, CA",
    },
  ]);
  // State to check if Studio45 has been added
  const [studio45Added, setStudio45Added] = useState(false);

  // UseEffect to add Studio45 automatically after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!studio45Added) {
        setLocations((prevLocations) => [
          ...prevLocations,
          {
            name: "Studio45, San Francisco",
            image_url: "/studio45.jpeg",
            details: "SF",
          },
        ]);
        setStudio45Added(true);
      }
    }, 5000); // Delay of 5 seconds

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [studio45Added]);

  return (
    <div className="flex flex-col min-h-screen p-12 gap-4">
      <p className="mr-2 text-md font-semibold tracking-tight">
        Hello Suveen 👋!
      </p>

      {/* Locations Section */}
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-2 w-2/5">
          <p className="mr-2 text-xl font-semibold tracking-tight my-2">
            Recent Location
          </p>
          <div>
            {/* Render added locations */}
            {locations.map((location, index) => (
              <LocationCard
                key={index}
                name={location.name}
                image_url={location.image_url}
                details={location.details}
              />
            ))}
          </div>
        </div>

        {/* People Section */}
        <div className="flex flex-col gap-2 w-3/5">
          <p className="mr-2 text-xl font-semibold tracking-tight my-2">
            People around you
          </p>
          <div>
            <PersonCard
              name="Suveen"
              image_url="/suveen.jpeg"
              details="Hello"
            />
            <PersonCard
              name="Dexter"
              image_url="/dexter.jpeg"
              details="Hello"
            />
          </div>
        </div>
      </div>

      {/* Recent Conversations Section */}
      <div className="flex flex-row gap-8 mt-8">
        <div className="flex flex-col gap-2 w-1/2">
          <p className="mr-2 text-xl font-semibold tracking-tight my-2">
            Recent Conversations
          </p>
          <div>
            <ConversationCard
              text="gpt-4o and its loopholes"
              time="4 mins ago"
            />
          </div>
        </div>
      </div>

      {/* Live Camera View Section */}
      <div className="flex flex-row gap-8 mt-8">
        <div className="flex flex-col gap-2 w-1/2">
          <p className="mr-2 text-xl font-semibold tracking-tight my-2">
            Live Camera View
          </p>
          <div>
            <WebCamera />
          </div>
        </div>
      </div>
    </div>
  );
}
