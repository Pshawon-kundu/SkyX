import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Eye, FileText, AlertCircle } from "lucide-react";

interface PitchDeckDownloadProps {
  filePath?: string;
  title?: string;
  description?: string;
  showFileSize?: boolean;
  fileSize?: string;
  onDownload?: () => void;
  onPreview?: () => void;
  showError?: boolean;
  errorMessage?: string;
}

const PitchDeckDownload: React.FC<PitchDeckDownloadProps> = ({
  filePath = "/SkyX.pdf",
  title = "SkyX Pitch Deck",
  description = "Download our comprehensive pitch deck to learn more about the SkyX ecosystem, tokenomics, and roadmap.",
  showFileSize = true,
  fileSize = "2.4 MB",
  onDownload,
  onPreview,
  showError = false,
  errorMessage = "Unable to load the pitch deck. Please try again later.",
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsDownloading(true);
      console.log("🔽 Download started for:", filePath);
      onDownload?.();

      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "SkyX-Pitch-Deck.pdf";
      link.style.display = "none";
      document.body.appendChild(link);

      console.log("📌 Triggering download...");
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("✅ Download completed");
      }, 100);
    } catch (error) {
      console.error("❌ Download failed:", error);
      alert("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      console.log("👁️ Preview opened for:", filePath);
      onPreview?.();
      setIsPreviewing(true);

      const newTab = window.open(filePath, "_blank");
      if (!newTab) {
        alert("Please allow popups to preview the PDF");
      }

      setTimeout(() => setIsPreviewing(false), 500);
    } catch (error) {
      console.error("❌ Preview failed:", error);
      alert("Preview failed. Please try again.");
    }
  };

  const handleTitleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleDownload(e);
  };

  if (showError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="relative group rounded-xl overflow-hidden">
          {/* Glow background on hover */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500" />

          {/* Card content */}
          <div className="relative bg-gradient-to-br from-slate-900/80 via-red-900/20 to-slate-950/80 border border-red-500/30 backdrop-blur-xl p-8 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="text-red-400 flex-shrink-0 mt-1">
                <AlertCircle size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Unable to Load Pitch Deck
                </h3>
                <p className="text-sm text-slate-300">{errorMessage}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative group rounded-xl overflow-hidden">
        {/* Animated glow background on hover */}
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-cyan-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

        {/* Card content */}
        <div className="relative bg-gradient-to-br from-slate-900/80 via-purple-900/20 to-slate-950/80 border border-purple-400/20 group-hover:border-purple-400/50 backdrop-blur-xl p-8 sm:p-10 rounded-xl transition duration-300">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            {/* Icon container */}
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 group-hover:border-purple-400/60 transition duration-300">
              <motion.div
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FileText className="w-6 h-6 text-cyan-400 group-hover:text-purple-300 transition duration-300" />
              </motion.div>
            </div>

            {/* Title and description */}
            <div className="flex-1">
              <button
                onClick={handleTitleClick}
                disabled={isDownloading}
                className="text-left w-full cursor-pointer mb-2 bg-transparent border-none p-0 hover:opacity-80 transition duration-200 disabled:opacity-50"
              >
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-purple-300 via-cyan-300 to-purple-300 hover:from-purple-200 hover:via-cyan-200 hover:to-purple-200 bg-clip-text text-transparent transition duration-300">
                  {title}
                </h2>
              </button>
              <p className="text-sm sm:text-base text-slate-400 group-hover:text-slate-300 transition duration-300">
                {description}
              </p>
            </div>
          </div>

          {/* File info */}
          {showFileSize && (
            <div className="flex items-center gap-2 mb-6 text-xs sm:text-sm text-slate-500 group-hover:text-slate-400 transition duration-300">
              <div className="w-1 h-1 rounded-full bg-cyan-400" />
              <span>PDF Document • {fileSize}</span>
              <div className="w-1 h-1 rounded-full bg-purple-400" />
              <span>Professional Presentation</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {/* Download Button - Ultra Simple */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDownload(e);
              }}
              style={{ cursor: "pointer" }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 justify-center"
            >
              {isDownloading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Download size={20} />
                  </motion.div>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>Download Pitch Deck</span>
                </>
              )}
            </button>

            {/* Preview Button - Ultra Simple */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePreview(e);
              }}
              style={{ cursor: "pointer" }}
              className="px-8 py-4 bg-slate-900/50 border-2 border-purple-400/50 hover:border-purple-300 hover:bg-slate-900/70 text-purple-200 hover:text-purple-100 font-bold rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 justify-center"
            >
              {isPreviewing ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                    }}
                  >
                    <Eye size={20} />
                  </motion.div>
                  <span>Opening...</span>
                </>
              ) : (
                <>
                  <Eye size={20} />
                  <span>Preview PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-b-xl"
            animate={{
              scaleX: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ originX: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PitchDeckDownload;
