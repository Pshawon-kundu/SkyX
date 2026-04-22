import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Download, Eye, FileText, AlertCircle } from "lucide-react";

interface PitchDeckDownloadProps {
  /**
   * File path to the PDF (default: /SkyX.pdf)
   */
  filePath?: string;
  /**
   * Custom title for the card
   */
  title?: string;
  /**
   * Custom description
   */
  description?: string;
  /**
   * Show file size (default: true)
   */
  showFileSize?: boolean;
  /**
   * Custom file size text
   */
  fileSize?: string;
  /**
   * Callback when download is triggered
   */
  onDownload?: () => void;
  /**
   * Callback when preview is triggered
   */
  onPreview?: () => void;
  /**
   * Whether to show error state
   */
  showError?: boolean;
  /**
   * Custom error message
   */
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

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      onDownload?.();

      // Create a temporary anchor element for download
      const link = document.createElement("a");
      link.href = filePath;
      link.download = "SkyX-Pitch-Deck.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = () => {
    try {
      onPreview?.();
      window.open(filePath, "_blank", "noopener,noreferrer");
      setIsPreviewing(true);

      // Reset preview state after a delay
      setTimeout(() => setIsPreviewing(false), 500);
    } catch (error) {
      console.error("Preview failed:", error);
    }
  };

  if (showError) {
    return (
      <Motion.div
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
      </Motion.div>
    );
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative group rounded-xl overflow-hidden">
        {/* Animated glow background on hover */}
        <Motion.div
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
              <Motion.div
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
              </Motion.div>
            </div>

            {/* Title and description */}
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 bg-gradient-to-r from-purple-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
                {title}
              </h2>
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

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Download Button */}
            <Motion.button
              onClick={handleDownload}
              disabled={isDownloading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group/btn relative flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-wider text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Button glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg opacity-75 group-hover/btn:opacity-100 blur transition duration-300 group-hover/btn:blur-md" />

              {/* Button content */}
              <div className="relative flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-700 group-hover/btn:from-cyan-500 group-hover/btn:to-blue-600 rounded-lg transition duration-300">
                {isDownloading ? (
                  <>
                    <Motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Download size={18} />
                    </Motion.div>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Download</span>
                  </>
                )}
              </div>
            </Motion.button>

            {/* Preview Button */}
            <Motion.button
              onClick={handlePreview}
              disabled={isPreviewing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group/btn relative flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-wider rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Button border glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg opacity-0 group-hover/btn:opacity-100 blur transition duration-300 group-hover/btn:blur-md" />

              {/* Button content */}
              <div className="relative flex items-center justify-center gap-2 px-5 py-2 bg-slate-900/50 border-2 border-purple-400/50 group-hover/btn:border-purple-300 group-hover/btn:bg-slate-900/70 rounded-lg transition duration-300 text-purple-200 group-hover/btn:text-purple-100">
                {isPreviewing ? (
                  <>
                    <Motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                      }}
                    >
                      <Eye size={18} />
                    </Motion.div>
                    <span>Opening...</span>
                  </>
                ) : (
                  <>
                    <Eye size={18} />
                    <span>Preview</span>
                  </>
                )}
              </div>
            </Motion.button>
          </div>

          {/* Bottom accent line */}
          <Motion.div
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
    </Motion.div>
  );
};

export default PitchDeckDownload;
