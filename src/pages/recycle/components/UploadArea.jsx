import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";

const ACCEPTED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".bmp",
  ".tiff",
  ".tif",
  ".heic",
  ".gif",
];

const ACCEPTED_MIME = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/bmp",
  "image/tiff",
  "image/heic",
  "image/heif",
  "image/gif",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const isAcceptedFile = (file) => {
  const name = (file.name || "").toLowerCase();
  const ext = name.includes(".") ? name.substring(name.lastIndexOf(".")) : "";
  if (ACCEPTED_EXTENSIONS.includes(ext)) return true;
  if (ACCEPTED_MIME.includes(file.type)) return true;
  return false;
};

const UploadArea = ({
  onFilesSelected,
  disabled = false,
  maxFiles = 2,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (fileList) => {
    setError("");
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);

    if (files.length > maxFiles) {
      setError(`You can upload at most ${maxFiles} images.`);
      return;
    }

    for (const file of files) {
      if (!isAcceptedFile(file)) {
        setError(
          `Unsupported file type. Accepted: ${ACCEPTED_EXTENSIONS.join(", ")}`
        );
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" exceeds the 10MB size limit.`);
        return;
      }
    }

    onFilesSelected(files);
  };

  const onInputChange = (e) => {
    handleFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const svgBorder = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3e%3cstop offset='0%25' stop-color='%23FF8A3D'/%3e%3cstop offset='50%25' stop-color='%2340B9FF'/%3e%3cstop offset='100%25' stop-color='%238ED321'/%3e%3c%2flinearGradient%3e%3c%2fdefs%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='url(%23g)' stroke-width='3' stroke-dasharray='6%2c4' stroke-linecap='round'/%3e%3c%2fsvg%3e")`;

  return (
    <div>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            inputRef.current?.click();
          }
        }}
        className={`relative w-full max-w-6xl mx-auto rounded-3xl cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        style={{
          minHeight: "320px",
          backgroundColor: "var(--primary-bgc, #ffffff)",
          borderRadius: "24px",
          transform: isDragging ? "scale(1.01)" : "scale(1)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          boxShadow: isDragging
            ? "0 10px 25px rgba(0,0,0,0.1)"
            : "0 1px 2px rgba(0,0,0,0.05)",
          backgroundImage: svgBorder,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-16 sm:py-20 text-center">
          <Upload
            className="h-7 w-7 sm:h-8 sm:w-8"
            strokeWidth={1.5}
            style={{ color: "var(--Icon-Disabled, #aaaaaa)" }}
          />

          <p
            className="mt-3 text-sm sm:text-base"
            style={{ color: "var(--Primary-Text-color, #333333)" }}
          >
            Click or drag
          </p>

          <p
            className="text-sm sm:text-base"
            style={{ color: "var(--Primary-Text-color, #333333)" }}
          >
            images here
          </p>

          <p
            className="mt-3 text-xs"
            style={{ color: "var(--Disabled-Text-color, #aaaaaa)" }}
          >
            Up to {maxFiles} images · 10MB each
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          multiple
          onChange={onInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadArea;
