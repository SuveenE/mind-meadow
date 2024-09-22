import { MicIcon } from "lucide-react";

export default function Recall() {
  return (
    <div className="flex flex-col min-h-screen p-12 gap-4">
      <p className="mr-2 text-xl font-semibold tracking-tight">What are you trying to recall?</p>
      <div className="border rounded-full border-2 hover:bg-slate-200 border-black w-min p-5 cursor-pointer hover:scale-105 ease-in-out duration-300"><MicIcon size={60}/></div>
    </div>
  );
}
