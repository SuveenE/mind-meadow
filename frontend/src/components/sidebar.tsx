"use client";

import React from "react";
import {
  HomeIcon,
  HelpCircleIcon,
  ChartNoAxesCombinedIcon,
  SettingsIcon,
  ScrollTextIcon,
  LucideIcon,
  UserCircleIcon,
  DatabaseBackupIcon,
  DatabaseZapIcon
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  currentPath: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  path,
  currentPath,
}) => {
  const router = useRouter();
  const isActive = currentPath.endsWith(path);

  return (
    <div
      className={`flex flex-row p-3 py-[5px] gap-3 rounded-md hover:bg-slate-200 cursor-pointer items-center ${
        isActive ? "bg-gray-300" : "bg-gray-50"
      }`}
      onClick={() => router.push(path)}
    >
      <Icon className="font-thin" width={18} height={18} />
      <p className="font-medium">{label}</p>
    </div>
  );
};

const SideBar = () => {
  const pathname = usePathname();

  const sidebarItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: DatabaseBackupIcon, label: "Recall", path: "/recall" },
    { icon: ChartNoAxesCombinedIcon, label: "Analytics", path: "/analytics" },
    { icon: DatabaseZapIcon, label: "Memory", path: "/memory" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
    { icon: HelpCircleIcon, label: "Help", path: "/help" },
  ];
  return (
    <div className="z-[10] bg-gray-50 p-6 w-[240px] fixed left-0 h-full">
      <div className="flex flex-col gap-1">
        <p className="px-2 py-1 mb-5 text-2xl font-bold text-black">
          Mind<span className="text-pink-600">Meadow</span>{" "}
        </p>
        <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col justify-between gap-2 text-[15px]">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              currentPath={pathname}
            />
          ))}
        </div>
        {/* <div className="p-2 flex flex-row gap-2 text-sm"><p>Account:</p><UserCircleIcon /></div> */}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
