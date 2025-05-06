import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import "@/lib/channel-message";

const ClockAppURL = "/src/pages/clock/index.html";

function TimerConfigPanel() {
  const onCreateTimer = () => {
    window.open(ClockAppURL);
  };

  return (
    <div>
      <h1>Timer Config</h1>
      <Button onClick={onCreateTimer}>Button</Button>
    </div>
  );
}

function App() {
  return (
    <>
      <Tabs defaultValue="timer" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
        </TabsList>
        <TabsContent value="timer">
          <TimerConfigPanel />
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </>
  );
}

export default App;
