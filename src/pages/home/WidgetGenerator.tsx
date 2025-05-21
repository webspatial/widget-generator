import type React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Timer from "./Timer";
import WhiteBoard from "./WhiteBoard";
import Weather from "./Weather";
import { AppType } from "../../lib/app-manager";

export default function WidgetGenerator(props: { from: AppType }) {
  const [activeTab, setActiveTab] = useState<AppType>(AppType.Weather);

  // Common content card wrapper with fixed dimensions
  const ContentCard = ({ children }: { children: React.ReactNode }) => (
    <div
      enable-xr
      className="w-[402px] h-[540px] bg-[#c4c4c4] translucent-material rounded-[30px] px-[24px]  "
    >
      {children}
    </div>
  );

  return (
    <div className="mx-auto  rounded-[30px]  flex flex-col items-center">
      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={v => setActiveTab(v as AppType)}
        className="flex flex-col items-center"
      >
        <div className="w-[402px] flex justify-center ">
          <TabsList
            enable-xr
            className="translucent-material w-[366px] h-[60px] bg-[#c4c4c4] p-1 rounded-full text-[19px]]"
          >
            <TabsTrigger
              value="clock"
              className="rounded-full h-[48px] px-6 text-white data-[state=active]:bg-[#d9d9d94e] data-[state=active]:text-white"
            >
              Timer
            </TabsTrigger>
            <TabsTrigger
              value="whiteboard"
              className="rounded-full h-[48px] px-6 text-white data-[state=active]:bg-[#d9d9d94e] data-[state=active]:text-white"
            >
              White Board
            </TabsTrigger>
            <TabsTrigger
              value="weather"
              className="rounded-full h-[48px] px-6 text-white data-[state=active]:bg-[#d9d9d94e] data-[state=active]:text-white"
            >
              Weather
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Timer Content */}
        <TabsContent value="clock" className="p-0 m-0">
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
