import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TextDisplayProps {
  text: string;
  theme: "light" | "dark";
}

const TextDisplay: React.FC<TextDisplayProps> = ({ text, theme }) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    console.log("copy")
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        toast({
          description: "Text copied to clipboard",
          duration: 2000,
        });
      } catch (err) {
        console.error("Failed to copy text:", err);
        toast({
          variant: "destructive",
          description: "Failed to copy text",
          duration: 2000,
        });
      }
    }
  };

  return (
    <Card
      className={`w-full ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex justify-end mb-4">
          <Button
            variant={theme === "dark" ? "secondary" : "outline"}
            size="sm"
            onClick={handleCopy}
            disabled={!text}
            className="gap-3"
          >
            <Copy className="h-4 w-4" />
            Copy Text
          </Button>
        </div>
        <ScrollArea
          className={`h-[500px] w-full rounded-md p-4 ${
            theme === "dark"
              ? "bg-gray-900 text-gray-200"
              : "bg-gray-50 text-gray-900"
          }`}
        >
          {text ? (
            <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center italic py-8">
              Upload an image to see extracted text here
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TextDisplay;
