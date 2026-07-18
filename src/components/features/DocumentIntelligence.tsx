"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Download, Upload, Loader2, CheckCircle2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { documentAnalysisSchema, type DocumentAnalysisInput } from "@/lib/validations";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";

interface AnalysisResult {
  summary: string;
  actionItems: string[];
  keyTopics: string[];
  wordCount: number;
}

async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");

  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const textParts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    textParts.push(pageText);
  }

  return textParts.join("\n\n");
}

export function DocumentIntelligence() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DocumentAnalysisInput>({
    resolver: zodResolver(documentAnalysisSchema),
  });

  const contentValue = watch("content");

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      setExtracting(true);
      try {
        const text = await extractTextFromPDF(file);
        setValue("content", text, { shouldValidate: true });
        setValue("fileName", file.name.replace(".pdf", ""), { shouldValidate: true });
        setUploadedFile(file.name);
        toast.success(`Extracted text from ${file.name}`);
      } catch {
        toast.error("Failed to extract text from PDF");
      } finally {
        setExtracting(false);
      }
    } else if (file.type === "text/plain") {
      const text = await file.text();
      setValue("content", text, { shouldValidate: true });
      setValue("fileName", file.name.replace(".txt", ""), { shouldValidate: true });
      setUploadedFile(file.name);
      toast.success(`Loaded ${file.name}`);
    } else {
      toast.error("Please upload a PDF or TXT file");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function clearUpload() {
    setUploadedFile(null);
    setValue("content", "", { shouldValidate: true });
    setValue("fileName", "", { shouldValidate: true });
  }

  async function onSubmit(data: DocumentAnalysisInput) {
    setLoading(true);
    try {
      const res = await api.documents.analyze(data.content, data.fileName);
      setResult(res.data);
      toast.success("Document analyzed successfully!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to analyze document";
      if (msg.includes("429") || msg.includes("quota")) {
        toast.error("AI service quota exceeded. Please try again later or check your API key.");
      } else {
        toast.error(msg.slice(0, 120));
      }
    } finally {
      setLoading(false);
    }
  }

  function downloadPDF() {
    if (!result) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 122, 86);
    doc.text("EduPro AI - Document Analysis", margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated: ${new Date().toLocaleDateString()}  |  Words analyzed: ${result.wordCount}`, margin, y);
    y += 12;

    doc.setDrawColor(255, 154, 134);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(50);
    doc.text("Summary", margin, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60);
    const summaryLines = doc.splitTextToSize(result.summary, maxWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 10;

    if (result.keyTopics.length > 0) {
      if (y > 260) { doc.addPage(); y = margin; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(50);
      doc.text("Key Topics", margin, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60);
      result.keyTopics.forEach((topic) => {
        if (y > 280) { doc.addPage(); y = margin; }
        doc.text(`•  ${topic}`, margin, y);
        y += 6;
      });
      y += 6;
    }

    if (result.actionItems.length > 0) {
      if (y > 260) { doc.addPage(); y = margin; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(50);
      doc.text("Action Items", margin, y);
      y += 8;

      result.actionItems.forEach((item, idx) => {
        if (y > 280) { doc.addPage(); y = margin; }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(50);
        doc.text(`${idx + 1}.`, margin, y + 4);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(60);
        const lines = doc.splitTextToSize(item, maxWidth - 10);
        doc.text(lines, margin + 10, y + 4);
        y += Math.max(lines.length * 5, 10) + 4;
      });
    }

    doc.setFontSize(8);
    doc.setTextColor(180);
    doc.text("Generated by EduPro AI", margin, doc.internal.pageSize.getHeight() - 10);

    doc.save(`EduPro-Summary-${Date.now()}.pdf`);
    toast.success("PDF downloaded!");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand-400" />
          AI Document Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Document Name *
            </label>
            <input
              {...register("fileName")}
              type="text"
              placeholder="e.g., Lecture Notes Chapter 5"
              className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500"
            />
            {errors.fileName && <p className="mt-1 text-xs text-red-500">{errors.fileName.message}</p>}
          </div>

          {/* PDF Upload Area */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload PDF or TXT (optional)
            </label>
            {uploadedFile ? (
              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900/30 dark:bg-green-900/10">
                <FileText className="h-5 w-5 text-green-500" />
                <span className="flex-1 text-sm text-green-700 dark:text-green-400">{uploadedFile}</span>
                <button type="button" onClick={clearUpload} className="text-gray-400 hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center transition-colors hover:border-brand-300 hover:bg-brand-300/5 dark:border-dark-600 dark:bg-dark-800 dark:hover:border-brand-400">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {extracting ? "Extracting text..." : "Click to upload PDF or TXT file"}
                </span>
                <span className="text-xs text-gray-400">Max 10MB</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  disabled={extracting}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Document Content *
            </label>
            <textarea
              {...register("content")}
              placeholder="Paste your document content here, or upload a PDF/TXT file above..."
              rows={8}
              className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500"
            />
            {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
            {contentValue && (
              <p className="mt-1 text-xs text-gray-400">{contentValue.split(/\s+/).length} words</p>
            )}
          </div>

          <Button type="submit" disabled={loading || extracting} className="w-full gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Analyze Document
              </>
            )}
          </Button>
        </form>

        {result && (
          <div className="mt-6 space-y-4 rounded-xl border border-green-200 bg-green-50/50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Analysis Complete</span>
              <Badge variant="outline" className="ml-auto">
                {result.wordCount} words
              </Badge>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Summary</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{result.summary}</p>
            </div>

            {result.keyTopics.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Key Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {result.keyTopics.map((topic, i) => (
                    <Badge key={i} variant="outline">{topic}</Badge>
                  ))}
                </div>
              </div>
            )}

            {result.actionItems.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Action Items</h4>
                <ul className="space-y-1">
                  {result.actionItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={downloadPDF} className="gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}