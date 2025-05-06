import React, { JSX } from "react";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "./Card";

export const TimerComponent = (): JSX.Element => {
  return (
    <Card className="w-[402px] h-[456px] bg-windowsglass rounded-[46px] overflow-hidden border-none backdrop-blur-[50px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(50px)_brightness(100%)] bg-blend-luminosity shadow-blur">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Header section */}
        <div className="flex w-full h-[92px] items-center justify-between px-6">
          <div className="font-bold text-textprimary text-[29px]">15:00</div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="w-11 h-11 bg-[#ffffff1a] rounded-full p-0"
            >
              <img
                className="w-[18px] h-[18px]"
                alt="Union"
                src="https://c.animaapp.com/mac0kiwaYKsi6a/img/union-7.svg"
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-11 h-11 bg-[#ffffff1a] rounded-full p-0"
            >
              <div className="relative w-[18px] h-4">
                <img
                  className="absolute w-1.5 h-1.5 top-[11px] left-3"
                  alt="Group"
                  src="https://c.animaapp.com/mac0kiwaYKsi6a/img/group-3341.png"
                />
                <img
                  className="absolute w-3.5 h-3 top-0 left-0"
                  alt="Subtract"
                  src="https://c.animaapp.com/mac0kiwaYKsi6a/img/subtract.svg"
                />
                <img
                  className="absolute w-3.5 h-3 top-1 left-1"
                  alt="Subtract"
                  src="https://c.animaapp.com/mac0kiwaYKsi6a/img/subtract-2.svg"
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Timer circle */}
        <div className="flex-grow flex justify-center items-center">
          <div className="relative w-[190px] h-[190px]">
            <div className="w-[190px] h-[190px] bg-[#ffffff0f] rounded-full">
              <img
                className="absolute w-[186px] h-[186px] top-0.5 left-0.5"
                alt="Timer progress"
                src="https://c.animaapp.com/mac0kiwaYKsi6a/img/ellipse-3.svg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute w-8 h-8 bottom-4 left-1/2 -translate-x-1/2 bg-[#ffffff33] rounded-full p-0"
              >
                <img
                  className="w-3.5 h-3.5"
                  alt="Volume"
                  src="https://c.animaapp.com/mac0kiwaYKsi6a/img/union-2.svg"
                />
              </Button>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-textprimary text-[42px] leading-[50px]">
                12:30
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action buttons */}
        <div className="flex justify-center gap-[30px] mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="w-16 h-16 bg-[#ffffff1a] rounded-full p-0"
          >
            <img
              className="w-11 h-11"
              alt="Cancel"
              src="https://c.animaapp.com/mac0kiwaYKsi6a/img/osui-ic-cross.svg"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-16 h-16 bg-[#ffffff1a] rounded-full p-0"
          >
            <img
              className="w-[18px] h-[18px]"
              alt="Confirm"
              src="https://c.animaapp.com/mac0kiwaYKsi6a/img/union-1.svg"
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
