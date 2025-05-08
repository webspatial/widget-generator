import type React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Timer from "./Timer";
import WhiteBoard from "./WhiteBoard";
import Weather from "./Weather";

export default function WidgetGenerator() {
  const [activeTab, setActiveTab] = useState("timer");

  // Common content card wrapper with fixed dimensions
  const ContentCard = ({ children }: { children: React.ReactNode }) => (
    <div className="w-[402px] h-[540px] bg-[#c4c4c4] rounded-[30px] p-6">
      {children}
    </div>
  );

  return (
    <div className="mx-auto bg-[#d1d1d1] rounded-[30px] p-5 flex flex-col items-center">
      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col items-center"
      >
        <div className="w-[402px] flex justify-center mb-6">
          <TabsList className="w-[366px] h-[60px] bg-[#c4c4c4] p-1 rounded-full">
            <TabsTrigger
              value="timer"
              className="rounded-full h-[48px] px-6 text-white data-[state=active]:bg-[#d9d9d9] data-[state=active]:text-white"
            >
              Timer
            </TabsTrigger>
            <TabsTrigger
              value="whiteboard"
              className="rounded-full h-[48px] px-6 text-white data-[state=active]:bg-[#d9d9d9] data-[state=active]:text-white"
            >
              White Board
            </TabsTrigger>
            <TabsTrigger
              value="weather"
              className="rounded-full h-[48px] px-6 text-white data-[state=active]:bg-[#d9d9d9] data-[state=active]:text-white"
            >
              Weather
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Timer Content */}
        <TabsContent value="timer" className="p-0 m-0">
          <ContentCard>
            <Timer />
          </ContentCard>
        </TabsContent>

        {/* Whiteboard Content */}
        <TabsContent value="whiteboard" className="p-0 m-0">
          <ContentCard>
            <WhiteBoard />
          </ContentCard>
        </TabsContent>

        {/* Weather Content */}
        <TabsContent value="weather" className="p-0 m-0">
          <ContentCard>
            <Weather />
          </ContentCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
