'use client'

import { useState } from "react";
import Image from "next/image";
import Modal from "./modal";
import { Card, CardContent, CardTitle } from "./ui/card";

interface Props {
    name: string;
    image_url: string;
    details: string;
}

const LocationCard = ({ name, image_url, details }: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className="p-0 inline-block cursor-pointer hover:scale-105 ease-in-out duration-300 h-40 w-64 ml-1 mr-3 rounded-xl shrink-0 overflow-hidden shadow-md"
      >
        <CardContent className="p-0">
          <div className="w-full h-28 overflow-hidden">
            <Image
              src={image_url}
              alt="Picture of the location"
              width={200}
              height={40}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <CardTitle className="mt-3 text-base text-center">
            {name}
          </CardTitle>
        </CardContent>
      </Card>
      <Modal
        open={open}
        modalId="1" // id 1 means close on outside click
        onClose={() => {
          setOpen(false);
        }}
      >
        {" "}
      </Modal>
    </>
  );
};

export default LocationCard;
