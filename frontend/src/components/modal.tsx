import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  modalId?: string;
}
// to add blue add backdrop-blur-md to the div with bg-black/30
export default function Modal({
  open,
  onClose,
  modalId,
  children,
}: ModalProps) {
  return (
    <div
      onClick={modalId == "1" ? onClose : () => {}}
      className={`fixed z-50 inset-0 flex justify-center items-center transition-colors 
      ${open ? "visible bg-black/30" : "invisible"}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl shadow p-6 transition-all
        ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:text-gray-600"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}
