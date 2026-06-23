"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MAIN_DEPARTMENTS } from "@/lib/constants/departments";

export default function ComplianceItemModal({
  item,
  organizationId,
  createMode,
  onClose,
}: {
  item?: any;
  organizationId: string;
  createMode?: boolean;
  onClose: () => void;
}) {
  const supabase = createClient();

  const [title, setTitle] =
    useState(item?.title || "");

  const [description, setDescription] =
    useState(item?.description || "");

  const [version, setVersion] =
    useState(item?.version || "");

  const [framework, setFramework] =
  useState(item?.framework || "ISO 45001");

  const [clause, setClause] =
    useState(item?.clause || "");

  const [ownerDepartment, setOwnerDepartment] =
    useState(item?.owner_department || "");

  const [riskLevel, setRiskLevel] =
    useState(item?.risk_level || "medium");

  const [score, setScore] = useState(
    item?.compliance_score !== undefined && item?.compliance_score !== null
      ? String(item.compliance_score)
      : ""
  );

  const [rootCause, setRootCause] =
    useState(item?.root_cause || "");

  const [improvementPlan, setImprovementPlan] =
    useState(item?.improvement_plan || "");

  const [responsiblePerson, setResponsiblePerson] =
    useState(item?.responsible_person || "");

  const [reviewDate, setReviewDate] =
    useState(item?.next_review_date || "");

  const [fileName, setFileName] =
    useState(item?.file_name || "");

  const [fileUrl, setFileUrl] =
    useState(item?.file_url || "");

  const [itemType, setItemType] = useState(
    item?.item_type || "policy"
  );

  
  async function saveItem() {
    if (!title.trim()) {
      alert("Нэр оруулна уу");
            
      return;
    }

    const payload = {
      organization_id: organizationId,
      item_type: itemType || "policy",
      title,
      description,
      version,
      framework,
      clause,
      owner_department: ownerDepartment,
      risk_level: riskLevel,
      compliance_score: Number(score || 0),
      root_cause: rootCause,
      improvement_plan: improvementPlan,
      responsible_person: responsiblePerson,
      next_review_date: reviewDate || null,
      file_name: fileName,
      file_url: fileUrl,
      status: "active",
    };

    let result;

    if (createMode) {
      result = await supabase
        .from("compliance_items")
        .insert(payload)
        .select()
        .single();
    } else {
      result = await supabase
        .from("compliance_items")
        .update(payload)
        .eq("id", item.id)
        .select()
        .single();
    }

    if (result.error) {
      alert(result.error.message);
      console.error(result.error);
      return;
    }

    console.log("Saved compliance item:", result.data);
    onClose();
  }

  async function deleteItem() {
    if (!item?.id) return;

    await supabase
      .from("compliance_items")
      .delete()
      .eq("id", item.id);

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[900px] max-h-[90vh] overflow-auto rounded-2xl bg-white p-6">

        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-bold">
            {createMode
              ? "Шинэ Compliance бүртгэл"
              : "Compliance дэлгэрэнгүй"}
          </h2>

          <button onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="space-y-3">

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Нэр"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />

          <textarea
            className="w-full rounded-lg border p-3"
            rows={3}
            placeholder="Тайлбар"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Version"
            value={version}
            onChange={(e)=>setVersion(e.target.value)}
          />

          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            className="w-full rounded-xl border p-3"
          >
            <option value="policy">Журам</option>
            <option value="procedure">Процесс</option>
            <option value="standard">Стандарт</option>
            <option value="regulation">Зохицуулалт</option>
            <option value="instruction">Заавар</option>
          </select>

          <select
            className="w-full rounded-lg border p-3"
            value={framework}
            onChange={(e)=>setFramework(e.target.value)}
          >
            <option value="ISO 9001">ISO 9001</option>
            <option value="ISO 14001">ISO 14001</option>
            <option value="ISO 45001">ISO 45001</option>
            <option value="MNS">MNS</option>
            <option value="Дотоод бодлого, журам">Internal Policy</option>
            <option value="Хууль тогтоомж, зохицуулалт">Government Regulation</option>
          </select>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Заалт / Шаардлага"
            value={clause}
            onChange={(e)=>setClause(e.target.value)}
          />

          <select
            className="rounded-xl border p-3 dark:bg-slate-950"
            value={ownerDepartment}
            onChange={(e) => setOwnerDepartment(e.target.value)}
          >
            <option value="">Хариуцсан хэлтэс сонгох</option>
            {MAIN_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <label className="text-sm font-medium text-slate-700">
            Биелэлтийн %
          </label>
          <input
            type="number"
            min="0"
            max="100"
            className="w-full rounded-lg border p-3"
            placeholder="Compliance %"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />

          <textarea
            className="w-full rounded-lg border p-3"
            rows={3}
            placeholder="Суурь шалтгаан"
            value={rootCause}
            onChange={(e)=>setRootCause(e.target.value)}
          />

          <textarea
            className="w-full rounded-lg border p-3"
            rows={3}
            placeholder="Сайжруулах төлөвлөгөө"
            value={improvementPlan}
            onChange={(e)=>setImprovementPlan(e.target.value)}
          />

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Хариуцсан ажилтан"
            value={responsiblePerson}
            onChange={(e)=>setResponsiblePerson(e.target.value)}
          />

          <input
            type="date"
            className="w-full rounded-lg border p-3"
            value={reviewDate}
            onChange={(e)=>setReviewDate(e.target.value)}
          />

          <input
            className="w-full rounded-lg border p-3"
            placeholder="File Name"
            value={fileName}
            onChange={(e)=>setFileName(e.target.value)}
          />

          <input
            className="w-full rounded-lg border p-3"
            placeholder="File URL"
            value={fileUrl}
            onChange={(e)=>setFileUrl(e.target.value)}
          />

        </div>

        <div className="mt-6 flex justify-between">

          <div>
            {!createMode && (
              <button
                onClick={deleteItem}
                className="rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                Устгах
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Болих
            </button>

            <button
              onClick={saveItem}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Хадгалах
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}