"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gAppManager, AppType } from "../../lib/app-manager";

// Checkbox component for template selection
const TemplateCheckbox = ({ isSelected }: { isSelected: boolean }) => (
  <div
    className={`rounded-full p-2 ${isSelected ? "bg-blue-500" : "bg-gray-400"}`}
  >
    {isSelected && <Check className="h-5 w-5 text-white" />}
    {!isSelected && <div className="h-5 w-5" />}
  </div>
);

export default function WhiteBoard() {
  const [selectedTemplate, setSelectedTemplate] = useState<"light" | "dark">(
    "light"
  );

  const handleCreate = () => {
    gAppManager.createApp(AppType.Whiteboard, { selectedTemplate });
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-[29px] h-[92px] leading-[92px] font-bold text-white mb-6">
        White Board
      </h1>

      <div className="flex-1 h-[298px] rounded-[20px] mb-8 overflow-hidden">
        {/* Template Preview */}
        <div className="w-full h-full rounded-[20px] overflow-hidden flex flex-col">
          {/* Light Template */}
          <div
            className="relative w-full h-1/2 bg-white p-4 flex items-center justify-center cursor-pointer"
            onClick={() => setSelectedTemplate("light")}
          >
            {/* Curved Line with Loop SVG - Black version */}
            <svg
              width="240"
              height="60"
              viewBox="0 0 240 60"
              className="pointer-events-none"
            >
              <path
                d="M40,30 C70,10 90,50 120,30 C150,10 170,50 200,30"
                fill="none"
                stroke="black"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute bottom-4 right-4">
              <TemplateCheckbox isSelected={selectedTemplate === "light"} />
            </div>
          </div>

          {/* Dark Template */}
          <div
            className="relative w-full h-1/2 bg-[#666666] p-4 flex items-center justify-center cursor-pointer"
            onClick={() => setSelectedTemplate("dark")}
          >
            {/* Curved Line with Loop SVG - White version */}
            <svg
              width="240"
              height="60"
              viewBox="0 0 240 60"
              className="pointer-events-none"
            >
              <path
                d="M40,30 C70,10 90,50 120,30 C150,10 170,50 200,30"
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute bottom-4 right-4">
              <TemplateCheckbox isSelected={selectedTemplate === "dark"} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center mb-6">
        <Button
          onClick={handleCreate}
          className="bg-white text-black hover:bg-white/90 rounded-full w-[200px] h-[60px] text-xl font-medium"
        >
          Create
        </Button>
      </div>
    </div>
  );
}
