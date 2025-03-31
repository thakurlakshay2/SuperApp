"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Loader,
  Download,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const VIEW_MODES = ["Names Only", "Small", "Large", "Carousel"];

export default function ImageToPDF() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [previewIndex, setPreviewIndex] = useState(null);
  const [viewMode, setViewMode] = useState(1);

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const response = await fetch("/api/convert/image-to-pdf", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setPdfUrl(data.pdfUrl);
    setIsLoading(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = files.findIndex((file) => file.name === active.id);
      const newIndex = files.findIndex((file) => file.name === over.id);
      const updatedFiles = [...files];
      const [movedFile] = updatedFiles.splice(oldIndex, 1);
      updatedFiles.splice(newIndex, 0, movedFile);
      setFiles(updatedFiles);
    }
  };

  const FileItem = ({ file, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: file.name });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`relative ${
          viewMode === 2 ? "w-32 h-32" : "w-20 h-20"
        } cursor-pointer border rounded-lg overflow-hidden`}
        onClick={() => setPreviewIndex(index)}
      >
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-full h-full object-cover"
        />
        <ZoomIn className="absolute bottom-1 right-1 bg-white p-1 rounded-full" />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E3ECFF] p-6">
      <motion.h1
        className="text-4xl font-bold mb-6 text-[#0056D2]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Convert Images to PDF
      </motion.h1>

      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg text-center">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer border-dashed border-2 border-[#0056D2] p-6 block rounded-lg hover:bg-[#f0f5ff]"
        >
          <Upload className="w-12 h-12 text-[#0056D2] mx-auto" />
          <p className="mt-2 text-sm">Click to upload images</p>
        </label>

        {files.length > 0 && (
          <>
            <div className="flex gap-2 mt-4">
              {VIEW_MODES.map((mode, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded-md ${
                    viewMode === i ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setViewMode(i)}
                >
                  {mode}
                </button>
              ))}
            </div>
            {viewMode === 0 && (
              <ul className="mt-4">
                {files.map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            )}
            {viewMode > 0 && (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={files.map((file) => file.name)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex gap-2 flex-wrap mt-4 border p-2 rounded-lg">
                    {files.map((file, index) => (
                      <FileItem key={file.name} file={file} index={index} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </>
        )}

        <button
          onClick={handleUpload}
          className="mt-4 bg-[#0056D2] text-white px-6 py-2 rounded-lg shadow hover:bg-[#003f9a] transition"
          disabled={files.length === 0 || isLoading}
        >
          {isLoading ? (
            <Loader className="animate-spin inline-block" />
          ) : (
            "Convert to PDF"
          )}
        </button>
      </div>

      {previewIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <button
            onClick={() =>
              setPreviewIndex((prev) => (prev > 0 ? prev - 1 : prev))
            }
          >
            <ChevronLeft className="text-white w-8 h-8" />
          </button>
          <img
            src={URL.createObjectURL(files[previewIndex])}
            alt="Preview"
            className="max-w-full max-h-full rounded-lg"
          />
          <button
            onClick={() =>
              setPreviewIndex((prev) =>
                prev < files.length - 1 ? prev + 1 : prev
              )
            }
          >
            <ChevronRight className="text-white w-8 h-8" />
          </button>
        </div>
      )}
      {isLoading && (
        <motion.div
          className="mt-6 text-[#0056D2] text-lg font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
        >
          Converting your images...
        </motion.div>
      )}

      {pdfUrl && (
        <div className="mt-6">
          <a
            href={pdfUrl}
            download
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-800 transition flex items-center gap-2"
          >
            <Download className="w-5 h-5" /> Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
