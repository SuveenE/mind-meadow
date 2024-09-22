'use client'

import { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";

interface Props {
    text: string;
    time: string;
}

const ConversationCard = ({ text, time }: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className="p-0 inline-block cursor-pointer hover:scale-105 ease-in-out duration-300 h-min w-72 ml-1 mr-3 rounded-md shrink-0 overflow-hidden shadow-md"
      >
        <CardContent className="p-0 ml-3">
          <CardTitle className="mt-3 text-base">
            {text}
          </CardTitle>
          <div className="w-full h-8 overflow-hidden">
            {time}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ConversationCard;
