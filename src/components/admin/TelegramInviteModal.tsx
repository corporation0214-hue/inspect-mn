"use client";

const BOT_USERNAME = "ai_inspectbot";

export default function TelegramInviteModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const inviteText = `INSPECT.MN Telegram Bot ашиглах заавар:

1. Bot руу орно: https://t.me/${BOT_USERNAME}
2. /start гэж бичнэ.
3. /myrole гэж өөрийн role шалгана.
4. /voice [текст] — санал, гомдол, эрсдэл илгээх
5. /anonymous [текст] — нэргүй мэдээлэл илгээх
6. Шууд асуулт бичвэл AI Assistant хариулна.

Жишээ:
Өндөр эрсдэлтэй 5 зөрчил харуул`;

  async function copyText() {
    await navigator.clipboard.writeText(inviteText);
    alert("Invite text copied");
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Invite Telegram Users</h2>
            <p className="text-sm text-slate-500">
              Ажилчдад илгээх Telegram Bot заавар
            </p>
          </div>

          <button onClick={onClose} className="rounded-lg border px-3 py-1">
            ×
          </button>
        </div>

        <textarea
          className="h-72 w-full rounded-xl border bg-slate-50 p-4 text-sm dark:bg-slate-950"
          value={inviteText}
          readOnly
        />

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-4 py-2">
            Болих
          </button>

          <button
            onClick={copyText}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white"
          >
            Copy invite text
          </button>
        </div>
      </div>
    </div>
  );
}