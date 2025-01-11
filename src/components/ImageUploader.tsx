import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image, LoaderCircle } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
  theme: "light" | "dark";
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  isProcessing,
  theme,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
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
  }, [onUpload, isProcessing]);

  return (
    <div className="w-full p-4">
      <div
        {...getRootProps()}
        className={`
          h-80 rounded-lg transition-all duration-200 ease-in-out
          border-2 border-dashed 
          flex flex-col items-center justify-center
          ${
            isProcessing
              ? "cursor-not-allowed"
              : "cursor-pointer hover:border-blue-500"
          }
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : theme === "dark"
              ? "border-gray-600 bg-gray-800 hover:bg-gray-700"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-4 p-6 text-center">
          {isProcessing ? (
            <>
              <LoaderCircle className="w-12 h-12 animate-spin text-blue-500" />
              <div>
                <p className="text-lg font-medium mb-2">Processing image</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please wait
                </p>
              </div>
            </>
          ) : isDragActive ? (
            <>
              <Upload className="w-12 h-12 text-blue-500" />
              <div>
                <p className="text-lg font-medium mb-2">Drop it here!</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Release to upload image
                </p>
              </div>
            </>
          ) : (
            <>
              <Image
                className={`w-12 h-12 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <div>
                <p className="text-lg font-medium mb-2">Upload an image</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Drag and drop here, or click to browse
                </p>
              </div>{" "}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
