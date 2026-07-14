"use client";
 
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAlertsStore } from "@/features/jobs/store/alerts.store";
import { useShallow } from "zustand/react/shallow";
import { JobAlertSkeleton } from "@/components/ui/skeleton-loaders";
import type { JobAlert, JobAlertFilters } from "@/features/jobs/types/alerts.types";
import type { RemoteType, ExperienceLevel, EmploymentType } from "@/features/jobs/types/jobs.types";
import { 
  Bell, 
  Plus, 
  X, 
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/confirm-dialog";
 
const JobAlertCard = React.memo(function JobAlertCard({
  alert,
  onToggleActive,
  onDuplicate,
  onEdit,
  onDelete
}: {
  alert: JobAlert;
  onToggleActive: (id: string) => void;
  onDuplicate: (id: string) => void;
  onEdit: (alert: JobAlert) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <BrutalCard
        className={`border-2 border-border rounded-sm p-4 relative flex flex-col justify-between gap-3 text-left transition-all ${
          !alert.isActive ? "opacity-75 bg-surface-secondary/30" : "bg-surface"
        }`}
      >
        <div>
          {/* Header (Title, Toggle & Settings) */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-xs font-black uppercase text-foreground truncate max-w-[150px] leading-tight tracking-tight">
                  {alert.title}
                </h3>
                {alert.isActive ? (
                  <Badge className="text-[7px] font-bold bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30 px-1 py-0.5 rounded-sm">Active</Badge>
                ) : (
                  <Badge className="text-[7px] font-bold bg-gray-100 text-gray-500 dark:text-foreground-muted border border-gray-300 px-1 py-0.5 rounded-sm">Paused</Badge>
                )}
              </div>
              <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-foreground-muted bg-surface-secondary px-1.5 py-0.5 border border-border/10 rounded-sm">
                {alert.frequency} notifications
              </span>
            </div>

            <Switch
              checked={alert.isActive}
              onChange={() => onToggleActive(alert.id)}
              aria-label={`Toggle active state of ${alert.title}`}
            />
          </div>

          {/* Filter tags summaries */}
          <div className="flex flex-wrap gap-1 mt-3">
            {alert.filters.keyword && (
              <Badge className="text-[7.5px] font-black uppercase tracking-wider border-2 border-border bg-surface text-foreground">
                Keyword: {alert.filters.keyword}
              </Badge>
            )}
            {alert.filters.company && (
              <Badge className="text-[7.5px] font-black uppercase tracking-wider border-2 border-border bg-surface text-foreground">
                Co: {alert.filters.company}
              </Badge>
            )}
            {alert.filters.location && (
              <Badge className="text-[7.5px] font-black uppercase tracking-wider border-2 border-border bg-surface text-foreground">
                Loc: {alert.filters.location}
              </Badge>
            )}
            {alert.filters.remoteType && alert.filters.remoteType.map((rt) => (
              <Badge key={rt} className="text-[7.5px] font-black uppercase tracking-wider border-2 border-border bg-amber-100 dark:bg-amber-500/20 text-foreground">
                {rt}
              </Badge>
            ))}
            {alert.filters.salaryMin && (
              <Badge className="text-[7.5px] font-black uppercase tracking-wider border-2 border-border bg-green-100 dark:bg-green-500/20 text-foreground">
                &gt;=${Math.round(alert.filters.salaryMin / 1000)}k
              </Badge>
            )}
            {alert.filters.experienceLevel && alert.filters.experienceLevel.map((el) => (
              <Badge key={el} className="text-[7.5px] font-black uppercase tracking-wider border-2 border-border bg-blue-100 dark:bg-blue-500/20 text-foreground">
                {el}
              </Badge>
            ))}
            {alert.filters.employmentType && alert.filters.employmentType.map((et) => (
              <Badge key={et} className="text-[7.5px] font-black uppercase tracking-wider border-2 border-border bg-indigo-100 text-foreground">
                {et}
              </Badge>
            ))}
          </div>

          {/* Mocked scan schedule metadata */}
          <div className="mt-3.5 pt-2 border-t border-border/10 text-[8px] font-bold uppercase tracking-wider text-foreground-muted space-y-0.5">
            <div>Last scan: {alert.lastTriggeredAt ? "4 hours ago" : "Never"}</div>
            <div>Next scan: {alert.isActive ? "in 20 hours" : "Paused"}</div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="border-t border-border/10 pt-2.5 flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(alert.id)}
            className="h-8 px-2 text-[9px] font-black uppercase text-foreground border border-border/20 rounded-sm flex items-center gap-1 hover:bg-surface-secondary"
          >
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(alert)}
            className="h-8 px-2 text-[9px] font-black uppercase text-foreground border border-border/20 rounded-sm flex items-center gap-1 hover:bg-surface-secondary"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(alert.id)}
            className="h-8 px-2 text-[9px] font-black uppercase text-error border border-border/20 rounded-sm flex items-center gap-1 hover:bg-error/5"
          >
            Delete
          </Button>
        </div>
      </BrutalCard>
    </motion.div>
  );
});

export default function JobAlertsPage() {
  const { alerts, fetchAlerts, createAlert, updateAlert, deleteAlert, duplicateAlert, toggleAlertActive, loading } = useAlertsStore(useShallow(state => ({
    alerts: state.alerts,
    fetchAlerts: state.fetchAlerts,
    createAlert: state.createAlert,
    updateAlert: state.updateAlert,
    deleteAlert: state.deleteAlert,
    duplicateAlert: state.duplicateAlert,
    toggleAlertActive: state.toggleAlertActive,
    loading: state.loading
  })));
  
  // Modal toggle state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null);
  const { confirm, ConfirmationDialog } = useConfirm();
 
  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formKeyword, setFormKeyword] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formRemoteType, setFormRemoteType] = useState<RemoteType[]>([]);
  const [formSalaryMin, setFormSalaryMin] = useState<number | null>(null);
  const [formExperienceLevel, setFormExperienceLevel] = useState<ExperienceLevel[]>([]);
  const [formEmploymentType, setFormEmploymentType] = useState<EmploymentType[]>([]);
  const [formFrequency, setFormFrequency] = useState<"instant" | "daily" | "weekly">("daily");
 
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);
 
  const openCreateModal = () => {
    setEditingAlert(null);
    setFormTitle("");
    setFormKeyword("");
    setFormCompany("");
    setFormLocation("");
    setFormRemoteType([]);
    setFormSalaryMin(null);
    setFormExperienceLevel([]);
    setFormEmploymentType([]);
    setFormFrequency("daily");
    setIsModalOpen(true);
  };
 
  const openEditModal = (alert: JobAlert) => {
    setEditingAlert(alert);
    setFormTitle(alert.title);
    setFormKeyword(alert.filters.keyword || "");
    setFormCompany(alert.filters.company || "");
    setFormLocation(alert.filters.location || "");
    setFormRemoteType(alert.filters.remoteType || []);
    setFormSalaryMin(alert.filters.salaryMin || null);
    setFormExperienceLevel(alert.filters.experienceLevel || []);
    setFormEmploymentType(alert.filters.employmentType || []);
    setFormFrequency(alert.frequency);
    setIsModalOpen(true);
  };
 
  const handleCheckboxChange = <T extends string>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    value: T,
    checked: boolean
  ) => {
    if (checked) {
      setList([...list, value]);
    } else {
      setList(list.filter((x) => x !== value));
    }
  };
 
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
 
    const filters: JobAlertFilters = {};
    if (formKeyword.trim()) filters.keyword = formKeyword;
    if (formCompany.trim()) filters.company = formCompany;
    if (formLocation.trim()) filters.location = formLocation;
    if (formRemoteType.length > 0) filters.remoteType = formRemoteType;
    if (formSalaryMin !== null) filters.salaryMin = formSalaryMin;
    if (formExperienceLevel.length > 0) filters.experienceLevel = formExperienceLevel;
    if (formEmploymentType.length > 0) filters.employmentType = formEmploymentType;
 
    const alertPayload = {
      title: formTitle,
      filters,
      frequency: formFrequency
    };
 
    if (editingAlert) {
      await updateAlert(editingAlert.id, alertPayload);
      toast.success("Job alert updated successfully");
    } else {
      await createAlert(alertPayload);
      toast.success("Job alert created successfully");
    }
    setIsModalOpen(false);
  };
 
  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Job Alert",
      description: "Are you sure you want to delete this job alert?",
      isDestructive: true,
      confirmLabel: "Delete Alert"
    });
    if (isConfirmed) {
      await deleteAlert(id);
      toast.success("Job alert deleted");
    }
  };
 
  return (
    <div className="space-y-6 pb-12 text-left select-none relative max-w-[1200px] mx-auto w-full">
 
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Job Alerts"
          description="Manage automated alert scans matching your specific filter criteria."
        />
        <Button
          onClick={openCreateModal}
          className="sm:self-end h-10 border-2 border-border bg-accent text-foreground brutal-shadow-xs hover:brutal-shadow flex items-center gap-1.5 rounded-sm font-black uppercase text-xs"
        >
          <Plus className="h-4 w-4 stroke-[3px]" /> Create Job Alert
        </Button>
      </div>
 
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <JobAlertSkeleton key={i} />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No job alerts active"
          description="Create alerts matching your dream role parameters to get notified instantly."
          primaryAction={{
            label: "Create First Job Alert",
            onClick: openCreateModal
          }}
        />
      ) : (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {alerts.map((alert) => (
              <JobAlertCard
                key={alert.id}
                alert={alert}
                onToggleActive={toggleAlertActive}
                onDuplicate={duplicateAlert}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
 
      {/* Create / Edit Alert Modal Backdrop */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-surface border-[3px] border-border brutal-shadow rounded-sm max-h-[90vh] overflow-y-auto p-5 relative"
            >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b-2 border-border pb-3 mb-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-primary" /> {editingAlert ? "Edit Job Alert" : "Create Job Alert"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="h-7 w-7 border-2 border-border rounded-sm brutal-shadow-xs hover:bg-surface-secondary"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
 
            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-4 text-left">
              
              {/* Alert Title */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary flex items-center gap-0.5">
                  Alert Name <span className="text-primary font-black">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. React Designer in NYC"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="h-9 text-xs font-bold border-2 border-border"
                />
              </div>
 
              {/* Keyword & Company Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-foreground-secondary">
                    Search Keyword
                  </label>
                  <Input
                    placeholder="e.g. Next.js, Rust"
                    value={formKeyword}
                    onChange={(e) => setFormKeyword(e.target.value)}
                    className="h-9 text-xs font-bold border-2 border-border"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-foreground-secondary">
                    Company Name
                  </label>
                  <Input
                    placeholder="e.g. Vercel, Linear"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="h-9 text-xs font-bold border-2 border-border"
                  />
                </div>
              </div>
 
              {/* Location & Minimum Salary Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-foreground-secondary">
                    Headquarters / Location
                  </label>
                  <Input
                    placeholder="e.g. San Francisco, London"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="h-9 text-xs font-bold border-2 border-border"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-foreground-secondary flex items-center gap-0.5">
                    Minimum Salary (Base)
                  </label>
                  <BrutalSelect
                    value={formSalaryMin?.toString() || ""}
                    onChange={(e) => setFormSalaryMin(e.target.value ? parseInt(e.target.value, 10) : null)}
                    options={[
                      { label: "Any Base Salary", value: "" },
                      { label: "$60,000+ USD", value: "60000" },
                      { label: "$80,000+ USD", value: "80000" },
                      { label: "$100,000+ USD", value: "100000" },
                      { label: "$120,000+ USD", value: "120000" },
                      { label: "$140,000+ USD", value: "140000" }
                    ]}
                    className="h-9 text-xs font-bold border-2 border-border"
                  />
                </div>
              </div>
 
              {/* Location Type Option Box */}
              <div className="space-y-1.5 border-2 border-border/10 p-2.5 rounded-sm bg-surface-secondary/5">
                <span className="text-[9px] font-black uppercase text-foreground-secondary block">
                  Location Type Selection
                </span>
                <div className="flex gap-4 flex-wrap">
                  {(["remote", "hybrid", "onsite"] as RemoteType[]).map((type) => (
                    <div key={type} className="flex items-center gap-1.5">
                      <Checkbox
                        id={`alert-remote-${type}`}
                        checked={formRemoteType.includes(type)}
                        onChange={(e) =>
                          handleCheckboxChange(formRemoteType, setFormRemoteType, type, e.target.checked)
                        }
                      />
                      <label
                        htmlFor={`alert-remote-${type}`}
                        className="text-xs font-bold uppercase text-foreground cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* Experience level check options */}
              <div className="space-y-1.5 border-2 border-border/10 p-2.5 rounded-sm bg-surface-secondary/5">
                <span className="text-[9px] font-black uppercase text-foreground-secondary block">
                  Experience Level
                </span>
                <div className="flex gap-4 flex-wrap">
                  {(["entry", "mid", "senior", "lead"] as ExperienceLevel[]).map((level) => (
                    <div key={level} className="flex items-center gap-1.5">
                      <Checkbox
                        id={`alert-exp-${level}`}
                        checked={formExperienceLevel.includes(level)}
                        onChange={(e) =>
                          handleCheckboxChange(formExperienceLevel, setFormExperienceLevel, level, e.target.checked)
                        }
                      />
                      <label
                        htmlFor={`alert-exp-${level}`}
                        className="text-xs font-bold uppercase text-foreground cursor-pointer"
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* Employment type criteria */}
              <div className="space-y-1.5 border-2 border-border/10 p-2.5 rounded-sm bg-surface-secondary/5">
                <span className="text-[9px] font-black uppercase text-foreground-secondary block">
                  Employment Type
                </span>
                <div className="flex gap-4 flex-wrap">
                  {(["full-time", "part-time", "contract", "internship"] as EmploymentType[]).map((type) => (
                    <div key={type} className="flex items-center gap-1.5">
                      <Checkbox
                        id={`alert-emp-${type}`}
                        checked={formEmploymentType.includes(type)}
                        onChange={(e) =>
                          handleCheckboxChange(formEmploymentType, setFormEmploymentType, type, e.target.checked)
                        }
                      />
                      <label
                        htmlFor={`alert-emp-${type}`}
                        className="text-xs font-bold uppercase text-foreground cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* Frequency selection */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary">
                  Notification Frequency
                </label>
                <BrutalSelect
                  value={formFrequency}
                  onChange={(e) => setFormFrequency(e.target.value as "instant" | "daily" | "weekly")}
                  options={[
                    { label: "Instant (Real-time updates)", value: "instant" },
                    { label: "Daily (Once per day summary)", value: "daily" },
                    { label: "Weekly (Once per week summary)", value: "weekly" }
                  ]}
                  className="h-9 text-xs font-bold border-2 border-border"
                />
              </div>
 
              {/* Actions Footer Button grid */}
              <div className="border-t-2 border-border pt-4 flex items-center justify-end gap-3.5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 border-2 border-border px-4 rounded-sm text-xs font-black uppercase hover:bg-surface-secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-10 border-2 border-border px-6 rounded-sm text-xs font-black uppercase bg-primary text-white brutal-shadow-xs hover:brutal-shadow"
                >
                  Save Alert
                </Button>
              </div>
 
            </form>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
 
      <ConfirmationDialog />
    </div>
  );
}
