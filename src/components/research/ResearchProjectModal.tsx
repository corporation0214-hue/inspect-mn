"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResearchProjectModal({
  project,
  organizationId,
  createMode,
  onClose,
}: {
  project?: any;
  organizationId: string;
  createMode?: boolean;
  onClose: () => void;
}) {
  const supabase = createClient();

  const [title, setTitle] =
    useState(project?.title || "");

  const [description, setDescription] =
    useState(project?.description || "");

  const [category, setCategory] =
    useState(project?.category || "");

  const [priority, setPriority] =
    useState(project?.priority || "medium");

  const [status, setStatus] =
    useState(project?.status || "active");

  const [owner, setOwner] =
    useState(project?.owner || "");

  const [resultSummary, setResultSummary] =
    useState(project?.result_summary || "");

  const [nextStep, setNextStep] =
    useState(project?.next_step || "");

  const [startDate, setStartDate] = useState(project?.start_date || "");
  const [endDate, setEndDate] = useState(project?.end_date || "");
  const [extendedEndDate, setExtendedEndDate] = useState(project?.extended_end_date || "");
  const [progress, setProgress] = useState(String(project?.progress ?? 0));
  const [issue, setIssue] = useState(project?.issue || "");
  const [pendingDecision, setPendingDecision] = useState(project?.pending_decision || "");
  const [isUrgent, setIsUrgent] = useState(project?.is_urgent || false);
  const [fileName, setFileName] = useState(project?.file_name || "");
  const [fileUrl, setFileUrl] = useState(project?.file_url || "");

  async function saveProject() {
    if (createMode) {
      await supabase.from("research_projects").insert({
        organization_id: organizationId,
        title,
        description,
        category,
        priority,
        status,
        owner,
        result_summary: resultSummary,
        next_step: nextStep,
        start_date: startDate || null,
        end_date: endDate || null,
      });
    } else {
      await supabase
        .from("research_projects")
        .update({
          title,
          description,
          category,
          priority,
          status,
          owner,
          result_summary: resultSummary,
          next_step: nextStep,
          start_date: startDate || null,
          end_date: endDate || null,
          extended_end_date: extendedEndDate || null,
          progress: Number(progress || 0),
          issue,
          pending_decision: pendingDecision,
          is_urgent: isUrgent,
          file_name: fileName,
          file_url: fileUrl,
        })
        .eq("id", project.id);
    }
    

    onClose();
  }

  async function deleteProject() {
    if (!project?.id) return;

    await supabase
      .from("research_projects")
      .delete()
      .eq("id", project.id);

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[800px] max-h-[90vh] overflow-auto">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">
            {createMode
              ? "Шинэ судалгааны төсөл"
              : "Төслийн дэлгэрэнгүй"}
          </h2>

          <button onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="space-y-3">

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Төслийн нэр"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />

          <textarea
            className="w-full border rounded-lg p-3"
            rows={4}
            placeholder="Тайлбар"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Ангилал"
            value={category}
            onChange={(e)=>setCategory(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Хариуцагч"
            value={owner}
            onChange={(e)=>setOwner(e.target.value)}
          />

          <select
            className="w-full border rounded-lg p-3"
            value={priority}
            onChange={(e)=>setPriority(e.target.value)}
          >
            <option value="low">Бага</option>
            <option value="medium">Дунд</option>
            <option value="high">Өндөр</option>
          </select>

          <select
            className="w-full border rounded-lg p-3"
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
          >
            <option value="active">Идэвхтэй</option>
            <option value="completed">Дууссан</option>
            <option value="hold">Түр зогссон</option>
          </select>

          <textarea
            className="w-full border rounded-lg p-3"
            rows={3}
            placeholder="Үр дүн"
            value={resultSummary}
            onChange={(e)=>setResultSummary(e.target.value)}
          />

          <textarea
            className="w-full border rounded-lg p-3"
            rows={3}
            placeholder="Дараагийн алхам"
            value={nextStep}
            onChange={(e)=>setNextStep(e.target.value)}
          />

        </div>

        <div className="grid gap-3 md:grid-cols-2">
            <input
                type="date"
                className="w-full rounded-lg border p-3"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />

            <input
                type="date"
                className="w-full rounded-lg border p-3"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />

            <input
                type="date"
                className="w-full rounded-lg border p-3"
                value={extendedEndDate}
                onChange={(e) => setExtendedEndDate(e.target.value)}
                placeholder="Сунгасан дуусах огноо"
            />

            <input
                type="number"
                min="0"
                max="100"
                className="w-full rounded-lg border p-3"
                placeholder="Явц %"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
            />
            </div>

            <textarea
            className="w-full rounded-lg border p-3"
            rows={3}
            placeholder="Тулгарч буй хүндрэл"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            />

            <textarea
            className="w-full rounded-lg border p-3"
            rows={3}
            placeholder="Хүлээгдэж буй шийдвэр"
            value={pendingDecision}
            onChange={(e) => setPendingDecision(e.target.value)}
            />

            <label className="flex items-center gap-2 rounded-lg border p-3">
            <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
            />
            Нэн яаралтай төсөл
            </label>

            <input
            className="w-full rounded-lg border p-3"
            placeholder="Файлын нэр"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            />

            <input
            className="w-full rounded-lg border p-3"
            placeholder="Файлын холбоос / URL"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            />

            {fileUrl && (
            <a
                href={fileUrl}
                target="_blank"
                className="text-blue-600 underline"
            >
                Хавсаргасан файл нээх
            </a>
            )}

        <div className="flex justify-between mt-6">
          <div>
            {!createMode && (
              <button
                onClick={deleteProject}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Устгах
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="border px-4 py-2 rounded-lg"
            >
              Болих
            </button>

            <button
              onClick={saveProject}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Хадгалах
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}