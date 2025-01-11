import { useState } from "react";
import { createWorker } from "tesseract.js";
import TextDisplay from "./components/TextDisplay";
import ImageUploader from "./components/ImageUploader";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      setExtractedText("");
      const worker = await createWorker();
      const {
        data: { text },
      } = await worker.recognize(file);

      if (!text.trim()) {
        throw new Error("No text found");
      }
      setExtractedText(text);
      await worker.terminate();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error"; ;
      toast({
        variant: "destructive",
        description: errorMessage,
        duration: 2000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <header
        className={`sticky top-0 z-10 backdrop-blur-sm border-b ${
          theme === "dark"
            ? "border-gray-800 bg-gray-900/90"
            : "border-gray-200 bg-gray-50/90"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">img2text</h1>
            </div>
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <ImageUploader
              onUpload={handleImageUpload}
              isProcessing={isProcessing}
              theme={theme}
            />
          </div>

          <div>
            <TextDisplay text={extractedText} theme={theme} />
          </div>
        </div>
        <Toaster /> 
      </main>
    </div>
  );
}

export default App;
