import { motion as Motion } from "framer-motion";
import { useState } from "react";
import { animations } from "../data/animations";

const WhitePaper = ({ theme }) => {
  const isDark = theme === "dark";
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const whitePaperUrl = "/SkyX Whitepaper v1.pdf";

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = whitePaperUrl;
    link.download = 'SkyX Whitepaper v1.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <section
      id="white-paper"
      className={`relative py-20 sm:py-28 overflow-hidden ${
        isDark
          ? "bg-gradient-to-b from-slate-900/30 to-slate-950/50"
          : "bg-gradient-to-b from-slate-50 to-white/50"
      }`}
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 right-0 w-96 h-96 ${
            isDark ? "bg-blue-500/10" : "bg-blue-400/5"
          } blur-3xl rounded-full`}
        />
        <div
          className={`absolute bottom-20 left-0 w-96 h-96 ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-400/5"
          } blur-3xl rounded-full`}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={animations.viewport}
          className="text-center mb-12 sm:mb-16"
        >
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            SkyX White Paper
          </h2>
          <p
            className={`text-lg max-w-3xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Dive deep into the SkyX ecosystem, our vision, technology, and roadmap.
            Download our comprehensive white paper to understand the future of Web3 gaming.
          </p>
        </Motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <Motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            custom={0}
            viewport={animations.viewport}
            className="space-y-6"
          >
            <div
              className={`p-6 rounded-2xl border ${
                isDark
                  ? "border-slate-700/50 bg-slate-800/40"
                  : "border-slate-200/50 bg-white/40"
              } backdrop-blur-sm`}
            >
              <h3
                className={`text-xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                📋 What You'll Learn
              </h3>
              <ul
                className={`space-y-3 text-sm ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>SkyX ecosystem architecture and tokenomics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Web3 gaming revolution and our unique approach</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Referral system mechanics and reward structures</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Technical specifications and smart contracts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Roadmap and development milestones</span>
                </li>
              </ul>
            </div>

            <div
              className={`p-6 rounded-2xl border ${
                isDark
                  ? "border-slate-700/50 bg-slate-800/40"
                  : "border-slate-200/50 bg-white/40"
              } backdrop-blur-sm`}
            >
              <h3
                className={`text-xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                📊 Key Highlights
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold mb-1 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    50+
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Pages
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold mb-1 ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    v1.0
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Version
                  </div>
                </div>
              </div>
            </div>
          </Motion.div>

          {/* PDF Preview Card */}
          <Motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            custom={1}
            viewport={animations.viewport}
            className="flex flex-col items-center"
          >
            <div
              className={`relative w-full max-w-md rounded-2xl border ${
                isDark
                  ? "border-slate-700/50 bg-slate-800/40"
                  : "border-slate-200/50 bg-white/40"
              } backdrop-blur-sm overflow-hidden shadow-2xl`}
            >
              {/* PDF Icon/Preview */}
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="text-6xl mb-4">📄</div>
                  <div
                    className={`text-lg font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    SkyX White Paper
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    v1.0 • PDF Format
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <div className="absolute top-4 right-8">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="absolute top-4 right-12">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 space-y-3">
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                  }`}
                >
                  👁️ Preview Document
                </button>

                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  📥 Download PDF
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div
              className={`mt-4 text-center text-sm ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <p>Last updated: April 2026</p>
              <p className="mt-1">File size: ~2.5 MB</p>
            </div>
          </Motion.div>
        </div>

        {/* Preview Modal */}
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative w-full max-w-4xl h-[80vh] rounded-2xl border ${
                isDark
                  ? "border-slate-700/50 bg-slate-800/90"
                  : "border-slate-200/50 bg-white/90"
              } backdrop-blur-sm overflow-hidden shadow-2xl`}
            >
              {/* Header */}
              <div
                className={`flex items-center justify-between p-4 border-b ${
                  isDark
                    ? "border-slate-700/30 bg-slate-900/30"
                    : "border-slate-200/30 bg-slate-50/30"
                }`}
              >
                <h3
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  SkyX White Paper Preview
                </h3>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-slate-700 text-slate-400"
                      : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  ✕
                </button>
              </div>

              {/* PDF Viewer */}
              <div className="flex-1 p-4">
                <iframe
                  src={whitePaperUrl}
                  className="w-full h-full rounded-lg border-0"
                  title="SkyX White Paper"
                />
              </div>

              {/* Footer */}
              <div
                className={`flex items-center justify-between p-4 border-t ${
                  isDark
                    ? "border-slate-700/30 bg-slate-900/30"
                    : "border-slate-200/30 bg-slate-50/30"
                }`}
              >
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Preview mode - Download for full access
                </p>
                <button
                  onClick={handleDownload}
                  className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300"
                >
                  Download Full PDF
                </button>
              </div>
            </Motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WhitePaper;