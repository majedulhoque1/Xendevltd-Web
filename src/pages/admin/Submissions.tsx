import { useState } from "react";
import { CheckCircle2, MessageCircle, Trash2, UserPlus } from "lucide-react";
import { useSubmissions, type Submission, type SubmissionStatus } from "@/hooks/useSubmissions";
import { Badge } from "@/components/ui/badge";
import { ActionCard, type ActionCardAction } from "@/components/admin/ActionCard";
import { ConfirmDialog, type ConfirmDialogState } from "@/components/admin/ConfirmDialog";
import { waLink } from "@/lib/phone";

const TONE: Record<SubmissionStatus, string> = {
  new: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  contacted: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  closed: "bg-stone-100 text-stone-600 dark:bg-stone-500/10 dark:text-stone-400",
};

const AdminSubmissions = () => {
  const { submissions, isLoading, setStatus, remove, convertToContact } = useSubmissions();
  const [confirmState, setConfirmState] = useState<ConfirmDialogState | null>(null);

  function askConvert(s: Submission) {
    if (s.status === "closed") return;
    setConfirmState({
      title: "Add to CRM",
      description: `Add "${s.name}" to the CRM as a contact (and close this inquiry)?`,
      onConfirm: () => convertToContact(s),
    });
  }
  function askDelete(s: Submission) {
    setConfirmState({
      title: "Delete inquiry",
      description: `Delete the inquiry from "${s.name}"? This cannot be undone.`,
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: () => remove(s.id),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Submissions</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Incoming inquiries from the website. Review, contact, then add to CRM.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading submissions…</div>
      ) : submissions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No submissions yet.
        </div>
      ) : (
        <>
          {/* Phone: card list, thumb-sized actions */}
          <div className="grid gap-3 md:hidden">
            {submissions.map((r) => {
              const dateLabel = new Date(r.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const primary: ActionCardAction[] = [];
              if (r.phone) primary.push({ label: "WhatsApp", icon: MessageCircle, href: waLink(r.phone) });
              if (r.status === "new") {
                primary.push({
                  label: "Mark contacted",
                  icon: CheckCircle2,
                  onClick: () => setStatus({ id: r.id, status: "contacted" }),
                });
              }
              const secondary: ActionCardAction[] = [
                { label: "Add to CRM", icon: UserPlus, onClick: () => askConvert(r) },
                { label: "Delete", icon: Trash2, variant: "destructive", onClick: () => askDelete(r) },
              ];

              return (
                <ActionCard
                  key={r.id}
                  title={r.name}
                  subtitle={`${dateLabel} · ${r.message ?? "—"}`}
                  badge={{ label: r.status, className: TONE[r.status] }}
                  primaryActions={primary.slice(0, 2)}
                  secondaryActions={secondary}
                />
              );
            })}
          </div>

          {/* Desktop: dense table */}
          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card shadow-sm md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Message</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {submissions.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.phone ?? "—"}</td>
                    <td className="max-w-[240px] truncate px-4 py-3 text-muted-foreground" title={r.message ?? ""}>
                      {r.message ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={TONE[r.status]}>
                        {r.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {r.phone && (
                          <a
                            href={waLink(r.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-emerald-600"
                            aria-label="WhatsApp"
                            title="Message on WhatsApp"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {r.status === "new" && (
                          <button
                            type="button"
                            onClick={() => setStatus({ id: r.id, status: "contacted" })}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-amber-600"
                            aria-label="Mark contacted"
                            title="Mark as contacted"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => askConvert(r)}
                          disabled={r.status === "closed"}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-primary disabled:opacity-30"
                          aria-label="Add to CRM"
                          title={r.status === "closed" ? "Closed" : "Add to CRM"}
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => askDelete(r)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-destructive"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmDialog state={confirmState} onClose={() => setConfirmState(null)} />
    </div>
  );
};

export default AdminSubmissions;
