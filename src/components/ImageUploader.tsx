import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
  theme: "light" | "dark";
}

const ACCEPTED_TYPES = {
  "image/jpeg": [],
  "image/png": [],
  "image/gif": [],
  "image/webp": [],
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  isProcessing,
  theme,
}) => {
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        toast({
          variant: "destructive",
          description: error.message,
          duration: 3000,
        });
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onUpload(file);
      }
    },
    [onUpload, toast]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      disabled: isProcessing,
    });

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (isProcessing) return;

      const items = event.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              onUpload(file);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [onUpload, isProcessing, toast]);

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative h-80 rounded-lg transition-all duration-200 ease-in-out
          border-2 border-dashed 
          flex flex-col items-center justify-center
          ${
            isProcessing
              ? "cursor-not-allowed"
              : "cursor-pointer hover:border-blue-500"
          }
          ${isDragReject ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""}
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : theme === "dark"
              ? "border-gray-600 bg-gray-800 hover:bg-gray-700"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }
        `}
        aria-label="Image upload area"
        role="button"
        tabIndex={0}
      >
        <input {...getInputProps()} aria-label="File input" />

        <div className="flex flex-col items-center space-y-4 p-6 text-center">
          {isProcessing ? (
            <>
              <LoaderCircle className="w-12 h-12 animate-spin text-blue-500" />
              <div>
                <p className="text-lg font-medium mb-2">Processing image</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please wait while we extract the text
                </p>
              </div>
            </>
          ) : isDragActive ? (
            <>
              <Upload className="w-12 h-12 text-blue-500" />
              <div>
                <p className="text-lg font-medium mb-2">
                  {isDragReject ? "Unsupported file type" : "Drop it here!"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isDragReject
                    ? "Please use a valid image file"
                    : "Release to upload your image"}
                </p>
              </div>
            </>
          ) : (
            <>
              <ImageIcon
                className={`w-12 h-12 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <div>
                <p className="text-lg font-medium mb-2">Upload an image</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Drag and drop, paste, or click to browse
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
