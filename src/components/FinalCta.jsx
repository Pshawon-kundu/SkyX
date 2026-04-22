import { motion as Motion } from "framer-motion";
import { useState } from "react";

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbxGw7wcYqhRXKQfY5P2jaZmGhzTbYJupxV94WfYGjxKnJ0o12AlZGZYfZp3shI28IMi/exec";

function FinalCta({ content, isDark = true }) {
  const [showSubmit, setShowSubmit] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    projectName: "",
    projectStage: "",
    description: "",
    raiseTarget: "",
    contactHandle: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateRequired = (data) => {
    const missing = [];
    if (!data.fullName || !data.fullName.trim()) missing.push("fullName");
    if (!data.email || !data.email.trim()) missing.push("email");
    if (!data.projectName || !data.projectName.trim())
      missing.push("projectName");
    if (!data.description || !data.description.trim())
      missing.push("description");
    return missing;
  };

  async function submitProject(e) {
    e?.preventDefault();
    setError("");
    setSuccess("");

    const payload = { ...form };

    const missing = validateRequired(payload);
    if (missing.length) {
      setError(`Missing required: ${missing.join(", ")}`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      try {
        await res.json();
      } catch (err) {
        // ignore if non-json
      }

      setSuccess("Thanks — your project was submitted.");
      setForm({
        fullName: "",
        email: "",
        projectName: "",
        projectStage: "",
        description: "",
        raiseTarget: "",
        contactHandle: "",
      });
      setShowSubmit(false);
    } catch (err) {
      setError(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      className={`py-16 sm:py-20 ${isDark ? "bg-slate-900" : "bg-white"}`}
    >
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className={`rounded-3xl border p-8 sm:p-10 text-center ${
            isDark
              ? "border-purple-400/20 bg-linear-to-br from-purple-600/20 to-slate-900/70"
              : "border-purple-300/40 bg-linear-to-br from-purple-200/30 to-purple-50/50"
          }`}
        >
          <h2
            className={`text-3xl font-black sm:text-4xl ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {content.title}
          </h2>
          <p
            className={`mt-4 text-lg ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            {content.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => {
                setShowSubmit((s) => !s);
                setShowJoin(false);
              }}
              className={`rounded-lg px-8 py-4 font-semibold transition-colors ${
                isDark
                  ? "bg-purple-600 text-white hover:bg-purple-500"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {content.primaryCta}
            </button>
            <button
              onClick={() => {
                setShowJoin((s) => !s);
                setShowSubmit(false);
              }}
              className={`rounded-lg border px-8 py-4 font-semibold transition-colors ${
                isDark
                  ? "border-purple-400/50 bg-transparent text-purple-300 hover:bg-purple-400/10"
                  : "border-purple-500/50 bg-transparent text-purple-600 hover:bg-purple-100/30"
              }`}
            >
              {content.secondaryCta}
            </button>
          </div>

          {showSubmit && (
            <form
              className="mt-6 mx-auto max-w-2xl text-left"
              onSubmit={submitProject}
            >
              <label className="block text-sm mb-1">Full name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-md p-2 mb-3 bg-white/5"
              />

              <label className="block text-sm mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md p-2 mb-3 bg-white/5"
              />

              <label className="block text-sm mb-1">Project name</label>
              <input
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
                className="w-full rounded-md p-2 mb-3 bg-white/5"
              />

              <label className="block text-sm mb-1">Project stage</label>
              <input
                name="projectStage"
                value={form.projectStage}
                onChange={handleChange}
                className="w-full rounded-md p-2 mb-3 bg-white/5"
              />

              <label className="block text-sm mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-md p-2 mb-3 bg-white/5"
                rows={4}
              />

              <label className="block text-sm mb-1">Raise target</label>
              <input
                name="raiseTarget"
                value={form.raiseTarget}
                onChange={handleChange}
                className="w-full rounded-md p-2 mb-3 bg-white/5"
              />

              <label className="block text-sm mb-1">Contact handle</label>
              <input
                name="contactHandle"
                value={form.contactHandle}
                onChange={handleChange}
                className="w-full rounded-md p-2 mb-3 bg-white/5"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-md bg-emerald-500 px-4 py-2 text-white font-semibold"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmit(false)}
                  className="rounded-md border px-4 py-2"
                >
                  Cancel
                </button>
              </div>
              {error && <p className="text-red-500 mt-3">{error}</p>}
              {success && <p className="text-green-500 mt-3">{success}</p>}
            </form>
          )}

          {showJoin && (
            <form
              className="mt-6 mx-auto max-w-md text-left"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="block text-sm mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md p-2 mb-3 bg-white/5"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  className="rounded-md bg-purple-600 px-4 py-2 text-white font-semibold"
                  onClick={() => {
                    setSuccess("Joined early access (mock)");
                    setShowJoin(false);
                  }}
                >
                  Join
                </button>
                <button
                  type="button"
                  onClick={() => setShowJoin(false)}
                  className="rounded-md border px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Motion.div>
      </div>
    </section>
  );
}

export default FinalCta;
