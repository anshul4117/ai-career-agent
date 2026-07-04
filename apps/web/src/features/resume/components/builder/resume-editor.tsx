"use client";

import React, { useEffect, useRef, useState } from "react";
import { useBuilderStore } from "../../store/builder.store";
import { ResumeSectionCard } from "./resume-section-card";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalTextarea } from "@/components/ui/brutal-textarea";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import { 
  User, FileText, Briefcase, GraduationCap, Award, 
  FolderGit2, FileBadge, Languages, Share2, Trash2, Pencil, Check, X, Copy, Plus, GripVertical,
  ArrowUp, ArrowDown
} from "lucide-react";
import { 
  DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, 
  TouchSensor, KeyboardSensor, closestCenter 
} from "@dnd-kit/core";
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";


export function ResumeEditor() {
  const { 
    currentResume, 
    setActiveSection,
    updatePersonal, 
    updateSummary,
    addListSectionItem, 
    updateListSectionItem, 
    deleteListSectionItem,
    
    // Sprint 3.3 Operations
    reorderSections,
    reorderSectionItems,
    moveSection,
    moveItem,
    toggleSectionVisibility,
    duplicateSectionItem,
    addCustomSection,
    deleteCustomSection,
    updateCustomSectionTitle,
    addCustomSectionItem,
    updateCustomSectionItem,
    deleteCustomSectionItem
  } = useBuilderStore();

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom section inputs
  const [newCustomTitle, setNewCustomTitle] = useState("");
  const [editingCustomItemId, setEditingCustomItemId] = useState<string | null>(null);
  const [isAddingCustomItem, setIsAddingCustomItem] = useState<string | null>(null); // sectionId

  // Edit states for list items
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [isAddingExp, setIsAddingExp] = useState(false);

  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [isAddingEdu, setIsAddingEdu] = useState(false);

  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [isAddingProj, setIsAddingProj] = useState(false);

  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [isAddingCert, setIsAddingCert] = useState(false);

  const [editingLangId, setEditingLangId] = useState<string | null>(null);
  const [isAddingLang, setIsAddingLang] = useState(false);

  const [editingSocId, setEditingSocId] = useState<string | null>(null);
  const [isAddingSoc, setIsAddingSoc] = useState(false);

  // Setup sensors for Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevents drag during simple mouse click
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Scroll Sync with IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0.05,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (typeof window !== "undefined" && (window as Window & { isScrollingToSection?: boolean }).isScrollingToSection) return;

      const visible = entries.find((e) => e.isIntersecting);
      if (visible) {
        const sectionId = visible.target.id.replace("editor-", "");
        setActiveSection(sectionId);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    if (currentResume?.content) {
      const order = currentResume.content.sectionsOrder || [];
      order.forEach((id) => {
        const el = document.getElementById(`editor-${id}`);
        if (el) observer.observe(el);
      });
    }

    return () => observer.disconnect();
  }, [currentResume, setActiveSection]);

  if (!currentResume || !currentResume.content) return null;

  const { personal, summary, experience, education, skills, projects, certifications, languages, socialLinks } = currentResume.content;
  
  const order = currentResume.content.sectionsOrder || ["personal", "summary", "experience", "education", "skills", "projects", "certifications", "languages", "socialLinks"];
  const hiddenSections = currentResume.content.hiddenSections || [];
  const customSections = currentResume.content.customSections || [];

  // Drag and Drop reordering for sections
  const handleSectionsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as string);
      const newIndex = order.indexOf(over.id as string);
      const newOrder = arrayMove(order, oldIndex, newIndex);
      reorderSections(newOrder);
    }
  };

  // Local reorder handler for Experience items
  const handleExpDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = experience.findIndex((i) => i.id === active.id);
      const newIndex = experience.findIndex((i) => i.id === over.id);
      reorderSectionItems("experience", arrayMove(experience, oldIndex, newIndex));
    }
  };

  // Local reorder handler for Education items
  const handleEduDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = education.findIndex((i) => i.id === active.id);
      const newIndex = education.findIndex((i) => i.id === over.id);
      reorderSectionItems("education", arrayMove(education, oldIndex, newIndex));
    }
  };

  // Local reorder handler for Skills items
  const handleSkillsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = skills.findIndex((i) => i.id === active.id);
      const newIndex = skills.findIndex((i) => i.id === over.id);
      reorderSectionItems("skills", arrayMove(skills, oldIndex, newIndex));
    }
  };

  // Local reorder handler for Projects items
  const handleProjDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = projects.findIndex((i) => i.id === active.id);
      const newIndex = projects.findIndex((i) => i.id === over.id);
      reorderSectionItems("projects", arrayMove(projects, oldIndex, newIndex));
    }
  };

  // Local reorder handler for Certifications items
  const handleCertDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = certifications.findIndex((i) => i.id === active.id);
      const newIndex = certifications.findIndex((i) => i.id === over.id);
      reorderSectionItems("certifications", arrayMove(certifications, oldIndex, newIndex));
    }
  };

  // Local reorder handler for Languages items
  const handleLangDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = languages.findIndex((i) => i.id === active.id);
      const newIndex = languages.findIndex((i) => i.id === over.id);
      reorderSectionItems("languages", arrayMove(languages, oldIndex, newIndex));
    }
  };

  // Local reorder handler for Social Links items
  const handleSocDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = socialLinks.findIndex((i) => i.id === active.id);
      const newIndex = socialLinks.findIndex((i) => i.id === over.id);
      reorderSectionItems("socialLinks", arrayMove(socialLinks, oldIndex, newIndex));
    }
  };

  // Local reorder handler for Custom section items
  const handleCustomItemsDragEnd = (sectionId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const targetSection = customSections.find((cs) => cs.id === sectionId);
    if (!targetSection) return;
    if (active.id !== over.id) {
      const items = targetSection.items;
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      reorderSectionItems(sectionId, arrayMove(items, oldIndex, newIndex));
    }
  };

  // Render individual sections
  const renderSectionCard = (sectionId: string, dragHandleProps: Record<string, unknown> | undefined) => {
    const isHidden = hiddenSections.includes(sectionId);

    // Custom Section
    if (sectionId.startsWith("custom_")) {
      const customSec = customSections.find((c) => c.id === sectionId);
      if (!customSec) return null;

      const isAddingItem = isAddingCustomItem === sectionId;

      return (
        <ResumeSectionCard
          key={sectionId}
          id={`editor-${sectionId}`}
          title={customSec.title}
          icon={FolderGit2}
          dragHandleProps={dragHandleProps}
          isHidden={isHidden}
          onToggleVisibility={() => toggleSectionVisibility(sectionId)}
          onMoveUp={() => moveSection(sectionId, "up")}
          onMoveDown={() => moveSection(sectionId, "down")}
          onDeleteSection={() => deleteCustomSection(sectionId)}
          onTitleChange={(newTitle) => updateCustomSectionTitle(sectionId, newTitle)}
          onAddItem={() => { setIsAddingCustomItem(sectionId); setEditingCustomItemId(null); }}
          addItemLabel="Add Item"
        >
          <div className="space-y-4">
            {!isAddingItem && customSec.items.length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-border bg-surface-secondary/20 rounded-sm">
                <Text variant="muted" className="text-xs font-black uppercase">No entries in this custom list.</Text>
              </div>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleCustomItemsDragEnd(sectionId, e)}>
              <SortableContext items={customSec.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {customSec.items.map((item) => {
                    const isEditing = editingCustomItemId === item.id;
                    if (isEditing) {
                      return (
                        <div key={item.id} className="border-3 border-border p-4 bg-[#FFFCEB] rounded-sm space-y-4 brutal-shadow-xs">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            <BrutalInput
                              label="Title / Heading"
                              value={item.title}
                              onChange={(e) => updateCustomSectionItem(sectionId, item.id, { title: e.target.value })}
                            />
                            <BrutalInput
                              label="Subtitle"
                              value={item.subtitle}
                              onChange={(e) => updateCustomSectionItem(sectionId, item.id, { subtitle: e.target.value })}
                            />
                            <BrutalInput
                              label="Date / Period"
                              value={item.date}
                              placeholder="e.g. 2026"
                              onChange={(e) => updateCustomSectionItem(sectionId, item.id, { date: e.target.value })}
                            />
                            <BrutalTextarea
                              label="Description"
                              value={item.description}
                              className="lg:col-span-2"
                              onChange={(e) => updateCustomSectionItem(sectionId, item.id, { description: e.target.value })}
                              rows={3}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <BrutalButton onClick={() => setEditingCustomItemId(null)} className="h-8 px-4 text-[9px] font-black uppercase">
                              Done
                            </BrutalButton>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <SortableItem key={item.id} id={item.id}>
                        {({ ref, style, dragHandleProps: itemDragHandle }) => (
                          <div ref={ref} style={style} className="border-2 border-border p-3 flex justify-between items-start hover:bg-surface-secondary/40 rounded-sm bg-surface">
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              <div {...itemDragHandle} className="p-1 cursor-grab active:cursor-grabbing text-foreground-muted hover:bg-surface-secondary">
                                <GripVertical className="h-3.5 w-3.5" />
                              </div>
                              <div className="truncate">
                                <h5 className="font-bold text-xs uppercase text-foreground truncate">{item.title}</h5>
                                {item.subtitle && <p className="text-[10px] text-foreground-secondary uppercase font-bold truncate">{item.subtitle}</p>}
                                {item.date && <p className="text-[9px] font-mono text-foreground-muted">{item.date}</p>}
                              </div>
                            </div>
                            <div className="flex gap-1 items-center shrink-0">
                              <button onClick={() => moveItem(sectionId, item.id, "up")} className="p-1 border border-border/20 hover:bg-surface-secondary rounded-sm" aria-label="Move Up">
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <button onClick={() => moveItem(sectionId, item.id, "down")} className="p-1 border border-border/20 hover:bg-surface-secondary rounded-sm" aria-label="Move Down">
                                <ArrowDown className="h-3 w-3" />
                              </button>
                              <button onClick={() => duplicateSectionItem(sectionId, item.id)} className="p-1.5 border-2 border-border hover:bg-surface-secondary rounded-sm brutal-shadow-xs" aria-label="Duplicate">
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => setEditingCustomItemId(item.id)} className="p-1.5 border-2 border-border hover:bg-surface-secondary rounded-sm brutal-shadow-xs" aria-label="Edit">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => deleteCustomSectionItem(sectionId, item.id)} className="p-1.5 border-2 border-border text-error hover:bg-error/10 rounded-sm brutal-shadow-xs" aria-label="Delete">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </SortableItem>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>

            {/* Add Custom Item form */}
            {isAddingItem && (
              <div className="border-3 border-border p-4 bg-[#FFFCEB] rounded-sm space-y-4 brutal-shadow-xs">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <BrutalInput id={`new-cust-${sectionId}-title`} label="Title / Heading" placeholder="e.g. First Place Winner" />
                  <BrutalInput id={`new-cust-${sectionId}-sub`} label="Subtitle" placeholder="e.g. MIT Hackathon 2026" />
                  <BrutalInput id={`new-cust-${sectionId}-date`} label="Date / Period" placeholder="e.g. Feb 2026" />
                  <BrutalTextarea id={`new-cust-${sectionId}-desc`} label="Description" className="lg:col-span-2" rows={3} placeholder="Describe achievement or details..." />
                </div>
                <div className="flex justify-end gap-2">
                  <BrutalButton variant="secondary" onClick={() => setIsAddingCustomItem(null)} className="h-8 px-4 text-[9px] font-black uppercase">
                    Cancel
                  </BrutalButton>
                  <BrutalButton onClick={() => {
                    const titleVal = (document.getElementById(`new-cust-${sectionId}-title`) as HTMLInputElement)?.value;
                    const subVal = (document.getElementById(`new-cust-${sectionId}-sub`) as HTMLInputElement)?.value;
                    const dateVal = (document.getElementById(`new-cust-${sectionId}-date`) as HTMLInputElement)?.value;
                    const descVal = (document.getElementById(`new-cust-${sectionId}-desc`) as HTMLTextAreaElement)?.value;
                    if (!titleVal) return;
                    addCustomSectionItem(sectionId, {
                      title: titleVal,
                      subtitle: subVal || "",
                      date: dateVal || "",
                      description: descVal || "",
                    });
                    setIsAddingCustomItem(null);
                  }} className="h-8 px-4 text-[9px] font-black uppercase">
                    Save
                  </BrutalButton>
                </div>
              </div>
            )}
          </div>
        </ResumeSectionCard>
      );
    }

    // Built-in cards mapping
    switch (sectionId) {
      case "personal":
        return (
          <ResumeSectionCard 
            key="personal"
            id="editor-personal" 
            title="Personal Information" 
            icon={User} 
            dragHandleProps={dragHandleProps}
            isHidden={isHidden}
            onToggleVisibility={() => toggleSectionVisibility("personal")}
            onMoveUp={() => moveSection("personal", "up")}
            onMoveDown={() => moveSection("personal", "down")}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BrutalInput
                label="First Name"
                value={personal.firstName || ""}
                onChange={(e) => updatePersonal({ ...personal, firstName: e.target.value })}
                required
              />
              <BrutalInput
                label="Last Name"
                value={personal.lastName || ""}
                onChange={(e) => updatePersonal({ ...personal, lastName: e.target.value })}
                required
              />
              <BrutalInput
                label="Headline / Role"
                value={personal.headline || ""}
                className="lg:col-span-2"
                onChange={(e) => updatePersonal({ ...personal, headline: e.target.value })}
                placeholder="e.g. Senior Software Architect"
              />
              <BrutalInput
                label="Email"
                type="email"
                value={personal.email || ""}
                onChange={(e) => updatePersonal({ ...personal, email: e.target.value })}
                required
              />
              <BrutalInput
                label="Phone"
                value={personal.phone || ""}
                onChange={(e) => updatePersonal({ ...personal, phone: e.target.value })}
              />
              <BrutalInput
                label="City"
                value={personal.city || ""}
                onChange={(e) => updatePersonal({ ...personal, city: e.target.value })}
              />
              <BrutalInput
                label="Country"
                value={personal.country || ""}
                onChange={(e) => updatePersonal({ ...personal, country: e.target.value })}
              />
            </div>
          </ResumeSectionCard>
        );

      case "summary":
        return (
          <ResumeSectionCard 
            key="summary"
            id="editor-summary" 
            title="Professional Summary" 
            icon={FileText} 
            dragHandleProps={dragHandleProps}
            isHidden={isHidden}
            onToggleVisibility={() => toggleSectionVisibility("summary")}
            onMoveUp={() => moveSection("summary", "up")}
            onMoveDown={() => moveSection("summary", "down")}
          >
            <BrutalTextarea
              label="Professional Summary Statement"
              value={summary.summary || ""}
              onChange={(e) => updateSummary({ summary: e.target.value })}
              placeholder="Briefly pitch your core expertise..."
              rows={5}
            />
          </ResumeSectionCard>
        );

      case "experience":
        return (
          <ResumeSectionCard 
            key="experience"
            id="editor-experience" 
            title="Experience" 
            icon={Briefcase}
            dragHandleProps={dragHandleProps}
            isHidden={isHidden}
            onToggleVisibility={() => toggleSectionVisibility("experience")}
            onMoveUp={() => moveSection("experience", "up")}
            onMoveDown={() => moveSection("experience", "down")}
            onAddItem={() => { setIsAddingExp(true); setEditingExpId(null); }}
            addItemLabel="Add Experience"
          >
            <div className="space-y-4">
              {!isAddingExp && experience.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-border bg-surface-secondary/20 rounded-sm">
                  <Text variant="muted" className="text-xs font-black uppercase">No work history logged yet.</Text>
                </div>
              )}

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleExpDragEnd}>
                <SortableContext items={experience.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {experience.map((exp) => {
                      const isEditing = editingExpId === exp.id;
                      if (isEditing) {
                        return (
                          <div key={exp.id} className="border-3 border-border p-4 bg-[#FFFCEB] rounded-sm space-y-4 brutal-shadow-xs">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              <BrutalInput
                                label="Company Name"
                                value={exp.companyName}
                                onChange={(e) => updateListSectionItem("experience", exp.id, { companyName: e.target.value })}
                              />
                              <BrutalInput
                                label="Job Title"
                                value={exp.jobTitle}
                                onChange={(e) => updateListSectionItem("experience", exp.id, { jobTitle: e.target.value })}
                              />
                              <BrutalInput
                                label="Location"
                                value={exp.location}
                                onChange={(e) => updateListSectionItem("experience", exp.id, { location: e.target.value })}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <BrutalInput
                                  label="Start Date"
                                  value={exp.startDate}
                                  placeholder="e.g. June 2024"
                                  onChange={(e) => updateListSectionItem("experience", exp.id, { startDate: e.target.value })}
                                />
                                <BrutalInput
                                  label="End Date"
                                  value={exp.endDate}
                                  placeholder="e.g. Present"
                                  disabled={exp.currentPosition}
                                  onChange={(e) => updateListSectionItem("experience", exp.id, { endDate: e.target.value })}
                                />
                              </div>
                              <div className="flex items-center gap-2 pt-2 lg:col-span-2">
                                <input
                                  type="checkbox"
                                  id={`curr-pos-${exp.id}`}
                                  checked={exp.currentPosition}
                                  onChange={(e) => updateListSectionItem("experience", exp.id, { currentPosition: e.target.checked, endDate: e.target.checked ? "Present" : "" })}
                                  className="h-4 w-4 accent-primary"
                                />
                                <label htmlFor={`curr-pos-${exp.id}`} className="text-xs font-black uppercase text-foreground select-none cursor-pointer">
                                  I currently work here
                                </label>
                              </div>
                              <BrutalTextarea
                                label="Description"
                                value={exp.description}
                                className="lg:col-span-2"
                                onChange={(e) => updateListSectionItem("experience", exp.id, { description: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <BrutalButton onClick={() => setEditingExpId(null)} className="h-8 px-4 text-[9px] font-black uppercase">
                                Done
                              </BrutalButton>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <SortableItem key={exp.id} id={exp.id}>
                          {({ ref, style, dragHandleProps: itemDragHandle }) => (
                            <div ref={ref} style={style} className="border-2 border-border p-3 flex justify-between items-start hover:bg-surface-secondary/40 rounded-sm bg-surface">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <div {...itemDragHandle} className="p-1 cursor-grab active:cursor-grabbing text-foreground-muted hover:bg-surface-secondary">
                                  <GripVertical className="h-3.5 w-3.5" />
                                </div>
                                <div className="truncate">
                                  <h5 className="font-bold text-xs uppercase text-foreground truncate">{exp.jobTitle}</h5>
                                  <p className="text-[10px] text-foreground-secondary uppercase font-bold truncate">{exp.companyName} • {exp.location}</p>
                                  <p className="text-[9px] font-mono text-foreground-muted">{exp.startDate} – {exp.currentPosition ? "Present" : exp.endDate}</p>
                                </div>
                              </div>
                              <div className="flex gap-1 items-center shrink-0">
                                <button onClick={() => moveItem("experience", exp.id, "up")} className="p-1 border border-border/20 hover:bg-surface-secondary rounded-sm" aria-label="Move Up">
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button onClick={() => moveItem("experience", exp.id, "down")} className="p-1 border border-border/20 hover:bg-surface-secondary rounded-sm" aria-label="Move Down">
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                                <button onClick={() => duplicateSectionItem("experience", exp.id)} className="p-1.5 border-2 border-border hover:bg-surface-secondary rounded-sm brutal-shadow-xs" aria-label="Duplicate">
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => setEditingExpId(exp.id)} className="p-1.5 border-2 border-border hover:bg-surface-secondary rounded-sm brutal-shadow-xs" aria-label="Edit">
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => deleteListSectionItem("experience", exp.id)} className="p-1.5 border-2 border-border text-error hover:bg-error/10 rounded-sm brutal-shadow-xs" aria-label="Delete">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </SortableItem>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add experience form */}
              {isAddingExp && (
                <div className="border-3 border-border p-4 bg-[#FFFCEB] rounded-sm space-y-4 brutal-shadow-xs">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <BrutalInput id="new-exp-company" label="Company Name" placeholder="e.g. Acme Corp" />
                    <BrutalInput id="new-exp-title" label="Job Title" placeholder="e.g. Lead Engineer" />
                    <BrutalInput id="new-exp-loc" label="Location" placeholder="e.g. San Francisco, CA" />
                    <div className="grid grid-cols-2 gap-2">
                      <BrutalInput id="new-exp-start" label="Start Date" placeholder="e.g. May 2021" />
                      <BrutalInput id="new-exp-end" label="End Date" placeholder="e.g. Present" />
                    </div>
                    <BrutalTextarea id="new-exp-desc" label="Description" className="lg:col-span-2" rows={3} placeholder="Describe accomplishments..." />
                  </div>
                  <div className="flex justify-end gap-2">
                    <BrutalButton variant="secondary" onClick={() => setIsAddingExp(false)} className="h-8 px-4 text-[9px] font-black uppercase">
                      Cancel
                  </BrutalButton>
                    <BrutalButton onClick={() => {
                      const company = (document.getElementById("new-exp-company") as HTMLInputElement)?.value;
                      const title = (document.getElementById("new-exp-title") as HTMLInputElement)?.value;
                      const location = (document.getElementById("new-exp-loc") as HTMLInputElement)?.value;
                      const start = (document.getElementById("new-exp-start") as HTMLInputElement)?.value;
                      const end = (document.getElementById("new-exp-end") as HTMLInputElement)?.value;
                      const desc = (document.getElementById("new-exp-desc") as HTMLTextAreaElement)?.value;
                      if (!company || !title) return;
                      addListSectionItem("experience", {
                        companyName: company,
                        jobTitle: title,
                        location,
                        startDate: start,
                        endDate: end,
                        currentPosition: end.toLowerCase() === "present",
                        description: desc
                      });
                      setIsAddingExp(false);
                    }} className="h-8 px-4 text-[9px] font-black uppercase">
                      Save
                    </BrutalButton>
                  </div>
                </div>
              )}
            </div>
          </ResumeSectionCard>
        );

      case "education":
        return (
          <ResumeSectionCard 
            key="education"
            id="editor-education" 
            title="Education" 
            icon={GraduationCap}
            dragHandleProps={dragHandleProps}
            isHidden={isHidden}
            onToggleVisibility={() => toggleSectionVisibility("education")}
            onMoveUp={() => moveSection("education", "up")}
            onMoveDown={() => moveSection("education", "down")}
            onAddItem={() => { setIsAddingEdu(true); setEditingEduId(null); }}
            addItemLabel="Add Education"
          >
            <div className="space-y-4">
              {!isAddingEdu && education.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-border bg-surface-secondary/20 rounded-sm">
                  <Text variant="muted" className="text-xs font-black uppercase">No academic records logged.</Text>
                </div>
              )}

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEduDragEnd}>
                <SortableContext items={education.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {education.map((edu) => {
                      const isEditing = editingEduId === edu.id;
                      if (isEditing) {
                        return (
                          <div key={edu.id} className="border-3 border-border p-4 bg-[#FFFCEB] rounded-sm space-y-4 brutal-shadow-xs">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              <BrutalInput
                                label="Institution"
                                value={edu.institution}
                                onChange={(e) => updateListSectionItem("education", edu.id, { institution: e.target.value })}
                              />
                              <BrutalInput
                                label="Degree"
                                value={edu.degree}
                                onChange={(e) => updateListSectionItem("education", edu.id, { degree: e.target.value })}
                              />
                              <BrutalInput
                                label="Field of Study"
                                value={edu.fieldOfStudy}
                                onChange={(e) => updateListSectionItem("education", edu.id, { fieldOfStudy: e.target.value })}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <BrutalInput
                                  label="Start Date"
                                  value={edu.startDate}
                                  placeholder="e.g. 2018"
                                  onChange={(e) => updateListSectionItem("education", edu.id, { startDate: e.target.value })}
                                />
                                <BrutalInput
                                  label="End Date"
                                  value={edu.endDate}
                                  placeholder="e.g. 2022"
                                  onChange={(e) => updateListSectionItem("education", edu.id, { endDate: e.target.value })}
                                />
                              </div>
                              <BrutalInput
                                label="Grade / CGPA"
                                value={edu.cgpa}
                                onChange={(e) => updateListSectionItem("education", edu.id, { cgpa: e.target.value })}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <BrutalButton onClick={() => setEditingEduId(null)} className="h-8 px-4 text-[9px] font-black uppercase">
                                Done
                              </BrutalButton>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <SortableItem key={edu.id} id={edu.id}>
                          {({ ref, style, dragHandleProps: itemDragHandle }) => (
                            <div ref={ref} style={style} className="border-2 border-border p-3 flex justify-between items-start hover:bg-surface-secondary/40 rounded-sm bg-surface">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <div {...itemDragHandle} className="p-1 cursor-grab active:cursor-grabbing text-foreground-muted hover:bg-surface-secondary">
                                  <GripVertical className="h-3.5 w-3.5" />
                                </div>
                                <div className="truncate">
                                  <h5 className="font-bold text-xs uppercase text-foreground truncate">{edu.degree} in {edu.fieldOfStudy}</h5>
                                  <p className="text-[10px] text-foreground-secondary uppercase font-bold truncate">{edu.institution}</p>
                                  <p className="text-[9px] font-mono text-foreground-muted">{edu.startDate} – {edu.endDate} • Grade: {edu.cgpa}</p>
                                </div>
                              </div>
                              <div className="flex gap-1 items-center shrink-0">
                                <button onClick={() => moveItem("education", edu.id, "up")} className="p-1 border border-border/20 hover:bg-surface-secondary rounded-sm" aria-label="Move Up">
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button onClick={() => moveItem("education", edu.id, "down")} className="p-1 border border-border/20 hover:bg-surface-secondary rounded-sm" aria-label="Move Down">
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                                <button onClick={() => duplicateSectionItem("education", edu.id)} className="p-1.5 border-2 border-border hover:bg-surface-secondary rounded-sm brutal-shadow-xs" aria-label="Duplicate">
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => setEditingEduId(edu.id)} className="p-1.5 border-2 border-border hover:bg-surface-secondary rounded-sm brutal-shadow-xs" aria-label="Edit">
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => deleteListSectionItem("education", edu.id)} className="p-1.5 border-2 border-border text-error hover:bg-error/10 rounded-sm brutal-shadow-xs" aria-label="Delete">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </SortableItem>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add education form */}
              {isAddingEdu && (
                <div className="border-3 border-border p-4 bg-[#FFFCEB] rounded-sm space-y-4 brutal-shadow-xs">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <BrutalInput id="new-edu-inst" label="Institution" placeholder="e.g. Stanford University" />
                    <BrutalInput id="new-edu-deg" label="Degree" placeholder="e.g. Bachelor of Science" />
                    <BrutalInput id="new-edu-field" label="Field of Study" placeholder="e.g. Computer Science" />
                    <div className="grid grid-cols-2 gap-2">
                      <BrutalInput id="new-edu-start" label="Start Date" placeholder="e.g. 2017" />
                      <BrutalInput id="new-edu-end" label="End Date" placeholder="e.g. 2021" />
                    </div>
                    <BrutalInput id="new-edu-grade" label="Grade / CGPA" placeholder="e.g. 3.9/4.0" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <BrutalButton variant="secondary" onClick={() => setIsAddingEdu(false)} className="h-8 px-4 text-[9px] font-black uppercase">
                      Cancel
                    </BrutalButton>
                    <BrutalButton onClick={() => {
                      const inst = (document.getElementById("new-edu-inst") as HTMLInputElement)?.value;
                      const deg = (document.getElementById("new-edu-deg") as HTMLInputElement)?.value;
                      const field = (document.getElementById("new-edu-field") as HTMLInputElement)?.value;
                      const start = (document.getElementById("new-edu-start") as HTMLInputElement)?.value;
                      const end = (document.getElementById("new-edu-end") as HTMLInputElement)?.value;
                      const grade = (document.getElementById("new-edu-grade") as HTMLInputElement)?.value;
                      if (!inst || !deg) return;
                      addListSectionItem("education", {
                        institution: inst,
                        degree: deg,
                        fieldOfStudy: field,
                        startDate: start,
                        endDate: end,
                        currentStudy: false,
                        cgpa: grade
                      });
                      setIsAddingEdu(false);
                    }} className="h-8 px-4 text-[9px] font-black uppercase">
                      Save
                    </BrutalButton>
                  </div>
                </div>
              )}
            </div>
          </ResumeSectionCard>
        );

      case "skills":
        return (
          <ResumeSectionCard 
            key="skills"
            id="editor-skills" 
            title="Skills" 
            icon={Award}
            dragHandleProps={dragHandleProps}
            isHidden={isHidden}
            onToggleVisibility={() => toggleSectionVisibility("skills")}
            onMoveUp={() => moveSection("skills", "up")}
            onMoveDown={() => moveSection("skills", "down")}
            onAddItem={() => { setIsAddingSkill(true); setEditingSkillId(null); }}
            addItemLabel="Add Skill"
          >
            <div className="space-y-4">
              {!isAddingSkill && skills.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-border bg-surface-secondary/20 rounded-sm">
                  <Text variant="muted" className="text-xs font-black uppercase">No skills declared.</Text>
                </div>
              )}

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSkillsDragEnd}>
                <SortableContext items={skills.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => {
                      const isEditing = editingSkillId === s.id;
                      if (isEditing) {
                        return (
                          <div key={s.id} className="border-2 border-border p-2 bg-[#FFFCEB] rounded-sm flex items-center gap-2 brutal-shadow-xs">
                            <input
                              type="text"
                              value={s.name}
                              onChange={(e) => updateListSectionItem("skills", s.id, { name: e.target.value })}
                              className="border border-border p-1 text-[10px] uppercase font-bold w-24 bg-surface focus:outline-none"
                            />
                            <input
                              type="text"
                              value={s.yearsOfExperience}
                              onChange={(e) => updateListSectionItem("skills", s.id, { yearsOfExperience: e.target.value })}
                              className="border border-border p-1 text-[10px] w-12 bg-surface text-center focus:outline-none"
                            />
                            <select
                              value={s.level}
                              onChange={(e) => updateListSectionItem("skills", s.id, { level: e.target.value })}
                              className="border border-border p-0.5 text-[9px] uppercase font-black bg-surface focus:outline-none"
                            >
                              <option value="beginner">Beg</option>
                              <option value="intermediate">Int</option>
                              <option value="expert">Exp</option>
                            </select>
                            <button onClick={() => setEditingSkillId(null)} className="p-1 text-success hover:bg-success/15 rounded-sm" aria-label="Confirm">
                              <Check className="h-3.5 w-3.5 stroke-[3px]" />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <SortableItem key={s.id} id={s.id}>
                          {({ ref, style, dragHandleProps: itemDragHandle }) => (
                            <div ref={ref} style={style} className="border-2 border-border bg-surface px-2.5 py-1.5 flex items-center gap-2 rounded-sm brutal-shadow-xs text-[10px] font-black uppercase tracking-wider">
                              <div {...itemDragHandle} className="cursor-grab active:cursor-grabbing text-foreground-muted hover:bg-surface-secondary p-0.5 mr-1 border border-border/10">
                                <GripVertical className="h-3 w-3" />
                              </div>
                              <span>{s.name} ({s.yearsOfExperience}y)</span>
                              <div className="flex gap-1 items-center border-l border-border/20 pl-2 ml-1">
                                <button onClick={() => duplicateSectionItem("skills", s.id)} className="text-foreground-secondary hover:text-foreground" aria-label="Duplicate">
                                  <Copy className="h-3 w-3" />
                                </button>
                                <button onClick={() => setEditingSkillId(s.id)} className="text-foreground-secondary hover:text-foreground" aria-label="Edit">
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button onClick={() => deleteListSectionItem("skills", s.id)} className="text-error hover:text-error/80" aria-label="Delete">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </SortableItem>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add skill form */}
              {isAddingSkill && (
                <div className="border-3 border-border p-4 bg-[#FFFCEB] rounded-sm space-y-4 brutal-shadow-xs">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <BrutalInput id="new-skill-name" label="Skill Name" placeholder="e.g. TypeScript" />
                    <BrutalInput id="new-skill-years" label="Years Experience" placeholder="e.g. 4" />
                    <div className="flex flex-col gap-2 lg:col-span-2">
                      <label className="font-bold text-xs uppercase text-foreground-secondary">Level</label>
                      <select id="new-skill-level" className="border-3 border-border bg-surface p-2 text-xs font-bold uppercase rounded-sm brutal-shadow-sm h-[44px]">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <BrutalButton variant="secondary" onClick={() => setIsAddingSkill(false)} className="h-8 px-4 text-[9px] font-black uppercase">
                      Cancel
                    </BrutalButton>
                    <BrutalButton onClick={() => {
                      const name = (document.getElementById("new-skill-name") as HTMLInputElement)?.value;
                      const years = (document.getElementById("new-skill-years") as HTMLInputElement)?.value;
                      const level = (document.getElementById("new-skill-level") as HTMLSelectElement)?.value;
                      if (!name) return;
                      addListSectionItem("skills", {
                        name,
                        yearsOfExperience: years || "1",
                        level: level || "intermediate"
                      });
                      setIsAddingSkill(false);
                    }} className="h-8 px-4 text-[9px] font-black uppercase">
                      Save
                    </BrutalButton>
                  </div>
                </div>
              )}
            </div>
          </ResumeSectionCard>
        );

      case "projects":
        return (
          <ResumeSectionCard 
            key="projects"
            id="editor-projects" 
            title="Projects" 
            icon={FolderGit2}
            dragHandleProps={dragHandleProps}
            isHidden={isHidden}
            onToggleVisibility={() => toggleSectionVisibility("projects")}
            onMoveUp={() => moveSection("projects", "up")}
            onMoveDown={() => moveSection("projects", "down")}
            onAddItem={() => { setIsAddingProj(true); setEditingProjId(null); }}
            addItemLabel="Add Project"
          >
            <div className="space-y-4">
              {!isAddingProj && projects.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-border bg-surface-secondary/20 rounded-sm">
                  <Text variant="muted" className="text-xs font-black uppercase">No projects cataloged.</Text>
                </div>
              )}

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleProjDragEnd}>
                <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {projects.map((proj) => {
                      const isEditing = editingProjId === proj.id;
                      if (isEditing) {
                        return (
                          <div key={proj.id} className="border-3 border-border p-4 bg-[#FFFCEB] rounded-sm space-y-4 brutal-shadow-xs">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              <BrutalInput
                                label="Project Title"
                                value={proj.title}
                                onChange={(e) => updateListSectionItem("projects", proj.id, { title: e.target.value })}
                              />
                              <BrutalInput
                                label="Your Role"
                                value={proj.role}
                                onChange={(e) => updateListSectionItem("projects", proj.id, { role: e.target.value })}
                              />
                              <BrutalInput
                                label="Tech Stack (comma-separated)"
                                value={proj.techStack ? proj.techStack.join(", ") : ""}
                                className="lg:col-span-2"
                                onChange={(e) => updateListSectionItem("projects", proj.id, { techStack: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                              />
                              <BrutalTextarea
                                label="Description"
                                value={proj.description}
                                className="lg:col-span-2"
                                onChange={(e) => updateListSectionItem("projects", proj.id, { description: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <BrutalButton onClick={() => setEditingProjId(null)} className="h-8 px-4 text-[9px] font-black uppercase">
                                Done
                              </BrutalButton>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <SortableItem key={proj.id} id={proj.id}>
                          {({ ref, style, dragHandleProps: itemDragHandle }) => (
                            <div ref={ref} style={style} className="border-2 border-border p-3 flex justify-between items-start hover:bg-surface-secondary/40 rounded-sm bg-surface">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <div {...itemDragHandle} className="p-1 cursor-grab active:cursor-grabbing text-foreground-muted hover:bg-surface-secondary">
                                  <GripVertical className="h-3.5 w-3.5" />
                                </div>
                                <div className="truncate">
                                  <h5 className="font-bold text-xs uppercase text-foreground truncate">{proj.title}</h5>
                                  <p className="text-[10px] text-foreground-secondary uppercase font-bold truncate">{proj.role}</p>
                                  {proj.techStack && proj.techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-1 pt-1.5">
                                      {proj.techStack.map((t, idx) => (
                                        <span key={idx} className="px-1.5 py-0.2 border border-border bg-surface text-[8px] font-bold uppercase rounded-sm">
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1 items-center shrink-0">
                                <button onClick={() => moveItem("projects", proj.id, "up")} className="p-1 border border-border/20 hover:bg-surface-secondary rounded-sm" aria-label="Move Up">
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button onClick={() => moveItem("projects", proj.id, "down")} className="p-1 border border-border/20 hover:bg-surface-secondary rounded-sm" aria-label="Move Down">
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                                <button onClick={() => duplicateSectionItem("projects", proj.id)} className="p-1.5 border-2 border-border hover:bg-surface-secondary rounded-sm brutal-shadow-xs" aria-label="Duplicate">
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => setEditingProjId(proj.id)} className="p-1.5 border-2 border-border hover:bg-surface-secondary rounded-sm brutal-shadow-xs" aria-label="Edit">
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => deleteListSectionItem("projects", proj.id)} className="p-1.5 border-2 border-border text-error hover:bg-error/10 rounded-sm brutal-shadow-xs" aria-label="Delete">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </SortableItem>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add project form */}
              {isAddingProj && (
                <div className="border-3 border-border p-4 bg-[#FFFCEB] rounded-sm space-y-4 brutal-shadow-xs">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <BrutalInput id="new-proj-title" label="Project Title" placeholder="e.g. AI Portal" />
                    <BrutalInput id="new-proj-role" label="Your Role" placeholder="e.g. Lead Architect" />
                    <BrutalInput id="new-proj-tech" label="Tech Stack (comma-separated)" className="lg:col-span-2" placeholder="Next.js, Tailwind, Rust" />
                    <BrutalTextarea id="new-proj-desc" label="Description" className="lg:col-span-2" rows={3} placeholder="Describe scope..." />
                  </div>
                  <div className="flex justify-end gap-2">
                    <BrutalButton variant="secondary" onClick={() => setIsAddingProj(false)} className="h-8 px-4 text-[9px] font-black uppercase">
                      Cancel
                    </BrutalButton>
                    <BrutalButton onClick={() => {
                      const title = (document.getElementById("new-proj-title") as HTMLInputElement)?.value;
                      const role = (document.getElementById("new-proj-role") as HTMLInputElement)?.value;
                      const tech = (document.getElementById("new-proj-tech") as HTMLInputElement)?.value;
                      const desc = (document.getElementById("new-proj-desc") as HTMLTextAreaElement)?.value;
                      if (!title) return;
                      addListSectionItem("projects", {
                        title,
                        role: role || "Developer",
                        techStack: tech ? tech.split(",").map(t => t.trim()).filter(Boolean) : [],
                        description: desc
                      });
                      setIsAddingProj(false);
                    }} className="h-8 px-4 text-[9px] font-black uppercase">
                      Save
                    </BrutalButton>
                  </div>
                </div>
              )}
            </div>
          </ResumeSectionCard>
        );

      case "certifications":
        return (
          <ResumeSectionCard 
            key="certifications"
            id="editor-certifications" 
            title="Certifications" 
            icon={FileBadge}
            dragHandleProps={dragHandleProps}
            isHidden={isHidden}
            onToggleVisibility={() => toggleSectionVisibility("certifications")}
            onMoveUp={() => moveSection("certifications", "up")}
            onMoveDown={() => moveSection("certifications", "down")}
            onAddItem={() => { setIsAddingCert(true); setEditingCertId(null); }}
            addItemLabel="Add Certification"
          >
            <div className="space-y-4">
              {!isAddingCert && certifications.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-border bg-surface-secondary/20 rounded-sm">
                  <Text variant="muted" className="text-xs font-black uppercase">No certifications recorded.</Text>
                </div>
              )}

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCertDragEnd}>
                <SortableContext items={certifications.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {certifications.map((cert) => {
                      const isEditing = editingCertId === cert.id;
                      if (isEditing) {
                        return (
                          <div key={cert.id} className="border-3 border-border p-4 bg-[#FFFCEB] rounded-sm space-y-4 brutal-shadow-xs">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              <BrutalInput
                                label="Certificate Name"
                                value={cert.name}
                                onChange={(e) => updateListSectionItem("certifications", cert.id, { name: e.target.value })}
                              />
                              <BrutalInput
                                label="Issuing Organization"
                                value={cert.issuingOrganization}
                                onChange={(e) => updateListSectionItem("certifications", cert.id, { issuingOrganization: e.target.value })}
                              />
                              <BrutalInput
                                label="Issue Date"
                                value={cert.issueDate}
                                placeholder="e.g. October 2025"
                                onChange={(e) => updateListSectionItem("certifications", cert.id, { issueDate: e.target.value })}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <BrutalButton onClick={() => setEditingCertId(null)} className="h-8 px-4 text-[9px] font-black uppercase">
                                Done
                              </BrutalButton>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <SortableItem key={cert.id} id={cert.id}>
                          {({ ref, style, dragHandleProps: itemDragHandle }) => (
                            <div ref={ref} style={style} className="border-2 border-border p-3 flex justify-between items-start hover:bg-surface-secondary/40 rounded-sm bg-surface">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <div {...itemDragHandle} className="p-1 cursor-grab active:cursor-grabbing text-foreground-muted hover:bg-surface-secondary">
                                  <GripVertical className="h-3.5 w-3.5" />
                                </div>
                                <div className="truncate">
                                  <h5 className="font-bold text-xs uppercase text-foreground truncate">{cert.name}</h5>
                                  <p className="text-[10px] text-foreground-secondary uppercase font-bold truncate">{cert.issuingOrganization}</p>
                                  <p className="text-[9px] font-mono text-foreground-muted">{cert.issueDate}</p>
                                </div>
                              </div>
                              <div className="flex gap-1 items-center shrink-0">
                                <button onClick={() => moveItem("certifications", cert.id, "up")} className="p-1 border border-border/20 hover:bg-surface-secondary rounded-sm" aria-label="Move Up">
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button onClick={() => moveItem("certifications", cert.id, "down")} className="p-1 border border-border/20 hover:bg-surface-secondary rounded-sm" aria-label="Move Down">
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                                <button onClick={() => duplicateSectionItem("certifications", cert.id)} className="p-1.5 border-2 border-border hover:bg-surface-secondary rounded-sm brutal-shadow-xs" aria-label="Duplicate">
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => setEditingCertId(cert.id)} className="p-1.5 border-2 border-border hover:bg-surface-secondary rounded-sm brutal-shadow-xs" aria-label="Edit">
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => deleteListSectionItem("certifications", cert.id)} className="p-1.5 border-2 border-border text-error hover:bg-error/10 rounded-sm brutal-shadow-xs" aria-label="Delete">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </SortableItem>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add certification form */}
              {isAddingCert && (
                <div className="border-3 border-border p-4 bg-[#FFFCEB] rounded-sm space-y-4 brutal-shadow-xs">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <BrutalInput id="new-cert-name" label="Certification Name" placeholder="e.g. AWS Solutions Architect" />
                    <BrutalInput id="new-cert-org" label="Issuing Organization" placeholder="e.g. AWS" />
                    <BrutalInput id="new-cert-date" label="Issue Date" placeholder="e.g. Oct 2025" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <BrutalButton variant="secondary" onClick={() => setIsAddingCert(false)} className="h-8 px-4 text-[9px] font-black uppercase">
                      Cancel
                    </BrutalButton>
                    <BrutalButton onClick={() => {
                      const name = (document.getElementById("new-cert-name") as HTMLInputElement)?.value;
                      const org = (document.getElementById("new-cert-org") as HTMLInputElement)?.value;
                      const date = (document.getElementById("new-cert-date") as HTMLInputElement)?.value;
                      if (!name || !org) return;
                      addListSectionItem("certifications", {
                        name,
                        issuingOrganization: org,
                        issueDate: date
                      });
                      setIsAddingCert(false);
                    }} className="h-8 px-4 text-[9px] font-black uppercase">
                      Save
                    </BrutalButton>
                  </div>
                </div>
              )}
            </div>
          </ResumeSectionCard>
        );

      case "languages":
        return (
          <ResumeSectionCard 
            key="languages"
            id="editor-languages" 
            title="Languages" 
            icon={Languages}
            dragHandleProps={dragHandleProps}
            isHidden={isHidden}
            onToggleVisibility={() => toggleSectionVisibility("languages")}
            onMoveUp={() => moveSection("languages", "up")}
            onMoveDown={() => moveSection("languages", "down")}
            onAddItem={() => { setIsAddingLang(true); setEditingLangId(null); }}
            addItemLabel="Add Language"
          >
            <div className="space-y-4">
              {!isAddingLang && languages.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-border bg-surface-secondary/20 rounded-sm">
                  <Text variant="muted" className="text-xs font-black uppercase">No languages cataloged.</Text>
                </div>
              )}

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLangDragEnd}>
                <SortableContext items={languages.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-wrap gap-2.5">
                    {languages.map((lang) => {
                      const isEditing = editingLangId === lang.id;
                      if (isEditing) {
                        return (
                          <div key={lang.id} className="border-2 border-border p-2 bg-[#FFFCEB] rounded-sm flex items-center gap-2 brutal-shadow-xs">
                            <input
                              type="text"
                              value={lang.language}
                              onChange={(e) => updateListSectionItem("languages", lang.id, { language: e.target.value })}
                              className="border border-border p-1 text-[10px] uppercase font-bold w-20 bg-surface focus:outline-none"
                            />
                            <input
                              type="text"
                              value={lang.speakingLevel}
                              onChange={(e) => updateListSectionItem("languages", lang.id, { speakingLevel: e.target.value })}
                              className="border border-border p-1 text-[10px] w-20 bg-surface text-center focus:outline-none"
                            />
                            <div className="flex items-center gap-1 pl-1">
                              <input
                                type="checkbox"
                                id={`lang-nat-${lang.id}`}
                                checked={lang.nativeLanguage}
                                onChange={(e) => updateListSectionItem("languages", lang.id, { nativeLanguage: e.target.checked })}
                                className="h-3 w-3 accent-primary"
                              />
                              <label htmlFor={`lang-nat-${lang.id}`} className="text-[8px] font-black uppercase">Nat</label>
                            </div>
                            <button onClick={() => setEditingLangId(null)} className="p-1 text-success" aria-label="Confirm">
                              <Check className="h-3.5 w-3.5 stroke-[3px]" />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <SortableItem key={lang.id} id={lang.id}>
                          {({ ref, style, dragHandleProps: itemDragHandle }) => (
                            <div ref={ref} style={style} className="border-2 border-border bg-surface px-2.5 py-1.5 flex items-center gap-2.5 rounded-sm brutal-shadow-xs text-[10px] font-black uppercase tracking-wider">
                              <div {...itemDragHandle} className="cursor-grab active:cursor-grabbing text-foreground-muted hover:bg-surface-secondary mr-1 p-0.5">
                                <GripVertical className="h-3 w-3" />
                              </div>
                              <span>{lang.language} — {lang.nativeLanguage ? "Native" : lang.speakingLevel}</span>
                              <div className="flex gap-1 border-l border-border/20 pl-2 ml-1">
                                <button onClick={() => duplicateSectionItem("languages", lang.id)} className="text-foreground-secondary hover:text-foreground" aria-label="Duplicate">
                                  <Copy className="h-3 w-3" />
                                </button>
                                <button onClick={() => setEditingLangId(lang.id)} className="text-foreground-secondary hover:text-foreground" aria-label="Edit">
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button onClick={() => deleteListSectionItem("languages", lang.id)} className="text-error hover:text-error/80" aria-label="Delete">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </SortableItem>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add language form */}
              {isAddingLang && (
                <div className="border-3 border-border p-4 bg-[#FFFCEB] rounded-sm flex flex-col sm:flex-row gap-3 items-end brutal-shadow-xs">
                  <BrutalInput id="new-lang-name" label="Language" placeholder="e.g. German" />
                  <BrutalInput id="new-lang-level" label="Speaking level" placeholder="e.g. Professional" />
                  <div className="flex items-center gap-2 h-10 pb-1 shrink-0">
                    <input type="checkbox" id="new-lang-native" className="h-4 w-4 accent-primary" />
                    <label htmlFor="new-lang-native" className="text-xs font-black uppercase cursor-pointer">Native language</label>
                  </div>
                  <div className="flex gap-2 shrink-0 pt-2 sm:pt-0">
                    <BrutalButton variant="secondary" onClick={() => setIsAddingLang(false)} className="h-10 px-4 text-[9px] font-black uppercase">
                      <X className="h-4 w-4" />
                    </BrutalButton>
                    <BrutalButton onClick={() => {
                      const langVal = (document.getElementById("new-lang-name") as HTMLInputElement)?.value;
                      const levelVal = (document.getElementById("new-lang-level") as HTMLInputElement)?.value;
                      const nativeVal = (document.getElementById("new-lang-native") as HTMLInputElement)?.checked;
                      if (!langVal) return;
                      addListSectionItem("languages", {
                        language: langVal,
                        speakingLevel: levelVal || "Conversational",
                        nativeLanguage: !!nativeVal
                      });
                      setIsAddingLang(false);
                    }} className="h-10 px-4 text-[9px] font-black uppercase">
                      Add
                    </BrutalButton>
                  </div>
                </div>
              )}
            </div>
          </ResumeSectionCard>
        );

      case "socialLinks":
        return (
          <ResumeSectionCard 
            key="socialLinks"
            id="editor-socialLinks" 
            title="Social Links" 
            icon={Share2}
            dragHandleProps={dragHandleProps}
            isHidden={isHidden}
            onToggleVisibility={() => toggleSectionVisibility("socialLinks")}
            onMoveUp={() => moveSection("socialLinks", "up")}
            onMoveDown={() => moveSection("socialLinks", "down")}
            onAddItem={() => { setIsAddingSoc(true); setEditingSocId(null); }}
            addItemLabel="Add Social Link"
          >
            <div className="space-y-4">
              {!isAddingSoc && socialLinks.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-border bg-surface-secondary/20 rounded-sm">
                  <Text variant="muted" className="text-xs font-black uppercase">No social platforms configured.</Text>
                </div>
              )}

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSocDragEnd}>
                <SortableContext items={socialLinks.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-wrap gap-2.5">
                    {socialLinks.map((soc) => {
                      const isEditing = editingSocId === soc.id;
                      if (isEditing) {
                        return (
                          <div key={soc.id} className="border-2 border-border p-2 bg-[#FFFCEB] rounded-sm flex items-center gap-2 brutal-shadow-xs">
                            <input
                              type="text"
                              value={soc.platform}
                              onChange={(e) => updateListSectionItem("socialLinks", soc.id, { platform: e.target.value })}
                              className="border border-border p-1 text-[10px] uppercase font-bold w-20 bg-surface focus:outline-none"
                            />
                            <input
                              type="text"
                              value={soc.url}
                              onChange={(e) => updateListSectionItem("socialLinks", soc.id, { url: e.target.value })}
                              className="border border-border p-1 text-[10px] w-36 bg-surface focus:outline-none"
                            />
                            <button onClick={() => setEditingSocId(null)} className="p-1 text-success" aria-label="Confirm">
                              <Check className="h-3.5 w-3.5 stroke-[3px]" />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <SortableItem key={soc.id} id={soc.id}>
                          {({ ref, style, dragHandleProps: itemDragHandle }) => (
                            <div ref={ref} style={style} className="border-2 border-border bg-surface px-2.5 py-1.5 flex items-center gap-2.5 rounded-sm brutal-shadow-xs text-[10px] font-black uppercase tracking-wider">
                              <div {...itemDragHandle} className="cursor-grab active:cursor-grabbing text-foreground-muted hover:bg-surface-secondary p-0.5 mr-1">
                                <GripVertical className="h-3 w-3" />
                              </div>
                              <span>{soc.platform}: <a href={soc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline lowercase font-normal">{soc.url}</a></span>
                              <div className="flex gap-1 border-l border-border/20 pl-2 ml-1">
                                <button onClick={() => duplicateSectionItem("socialLinks", soc.id)} className="text-foreground-secondary hover:text-foreground" aria-label="Duplicate">
                                  <Copy className="h-3 w-3" />
                                </button>
                                <button onClick={() => setEditingSocId(soc.id)} className="text-foreground-secondary hover:text-foreground" aria-label="Edit">
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button onClick={() => deleteListSectionItem("socialLinks", soc.id)} className="text-error hover:text-error/80" aria-label="Delete">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </SortableItem>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add social link form */}
              {isAddingSoc && (
                <div className="border-3 border-border p-4 bg-[#FFFCEB] rounded-sm flex flex-col sm:flex-row gap-3 items-end brutal-shadow-xs">
                  <BrutalInput id="new-soc-plat" label="Platform" placeholder="e.g. LinkedIn" />
                  <BrutalInput id="new-soc-url" label="Profile URL" placeholder="e.g. https://linkedin.com/in/user" className="flex-1" />
                  <div className="flex gap-2 shrink-0 pt-2 sm:pt-0">
                    <BrutalButton variant="secondary" onClick={() => setIsAddingSoc(false)} className="h-10 px-4 text-[9px] font-black uppercase">
                      <X className="h-4 w-4" />
                    </BrutalButton>
                    <BrutalButton onClick={() => {
                      const plat = (document.getElementById("new-soc-plat") as HTMLInputElement)?.value;
                      const url = (document.getElementById("new-soc-url") as HTMLInputElement)?.value;
                      if (!plat || !url) return;
                      addListSectionItem("socialLinks", {
                        platform: plat,
                        url: url
                      });
                      setIsAddingSoc(false);
                    }} className="h-10 px-4 text-[9px] font-black uppercase">
                      Add
                    </BrutalButton>
                  </div>
                </div>
              )}
            </div>
          </ResumeSectionCard>
        );

      default:
        return null;
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionsDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div ref={containerRef} className="space-y-8 w-full pb-20">
          
          {order.map((sectionId) => (
            <SortableItem key={sectionId} id={sectionId}>
              {({ ref, style, dragHandleProps }) => (
                <div ref={ref} style={style}>
                  {renderSectionCard(sectionId, dragHandleProps)}
                </div>
              )}
            </SortableItem>
          ))}

          {/* Add Custom Section Control Panel */}
          <BrutalCard className="p-4 bg-surface-secondary/10 border-2 border-dashed border-border flex flex-col sm:flex-row items-end gap-3 rounded-sm brutal-shadow-sm select-none">
            <div className="flex-1 w-full">
              <Heading level="h5" className="text-[10px] font-black uppercase tracking-wider text-foreground-secondary pb-1">
                Add Custom Section
              </Heading>
              <BrutalInput
                value={newCustomTitle}
                onChange={(e) => setNewCustomTitle(e.target.value)}
                placeholder="e.g. Achievements, Volunteer Work, Open Source"
                className="w-full"
              />
            </div>
            <BrutalButton
              onClick={() => {
                if (!newCustomTitle.trim()) return;
                addCustomSection(newCustomTitle.trim());
                setNewCustomTitle("");
              }}
              className="h-10 px-4 text-[10px] font-black uppercase shrink-0 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-1 stroke-[3px]" />
              Create Section
            </BrutalButton>
          </BrutalCard>
          
        </div>
      </SortableContext>
    </DndContext>
  );
}
