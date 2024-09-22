import { MicIcon } from "lucide-react";

export default function Recall() {
  return (
    <div className="flex flex-col min-h-screen mt-36 items-center  p-12 gap-4">
      <p className="mr-2 text-xl font-semibold tracking-tight">What are you trying to recall?</p>
      <div className="border rounded-full border-2 border-black w-min p-5"><MicIcon size={80}/></div>
    </div>
  );
}
