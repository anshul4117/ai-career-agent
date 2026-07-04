import type { ExportSettings } from "../store/export.store";
import type { Resume } from "../types/resume.types";

export const exportService = {
  /**
   * PDF Generator / Print Abstraction
   * Uses dynamic stylesheet injection to override physical `@page` rules and layout styles
   */
  async printResume(resume: Resume, settings: ExportSettings): Promise<boolean> {
    return new Promise((resolve) => {
      // Find or create styling block
      let styleEl = document.getElementById("resume-print-overrides") as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "resume-print-overrides";
        document.head.appendChild(styleEl);
      }

      // Map padding size values
      const marginMap = {
        narrow: "10mm",
        normal: "20mm",
        wide: "30mm"
      };

      const scaleVal = settings.scale / 100;

      // Compile custom print stylesheet rules
      const styles = `
        @media print {
          /* Hide main UI layout elements */
          body * {
            visibility: hidden;
            background-color: white !important;
          }

          /* Render preview sheet context only */
          #resume-print-preview-container,
          #resume-print-preview-container * {
            visibility: visible;
          }

          #resume-print-preview-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            transform: scale(${scaleVal});
            transform-origin: top left;
            background-color: white !important;
          }

          /* Configure physical page margins and orientations */
          @page {
            size: ${settings.paperSize === "a4" ? "A4" : "letter"} ${settings.orientation};
            margin: ${marginMap[settings.margins]};
          }

          /* Grayscale toggle override */
          ${settings.hideColors ? `
            #resume-print-preview-container {
              filter: grayscale(1) !important;
            }
          ` : ""}

          /* Section breaks toggle */
          ${settings.sectionBreaks ? `
            .transition-all > div {
              page-break-after: always !important;
              break-after: page !important;
            }
          ` : ""}
        }
      `;

      // Inject rules
      styleEl.innerHTML = styles;

      // Trigger standard print prompt dialog
      setTimeout(() => {
        window.print();
        resolve(true);
      }, 300);
    });
  },

  /**
   * Triggers raw browser download of a file string
   */
  triggerDownload(filename: string, content: string, contentType: string) {
    if (typeof window === "undefined") return;
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Direct JSON file exporter
   */
  downloadJSON(resume: Resume) {
    const dataStr = JSON.stringify(resume, null, 2);
    const filename = `${resume.title.toLowerCase().replace(/\s+/g, "-")}-backup.json`;
    this.triggerDownload(filename, dataStr, "application/json");
  },

  /**
   * Direct HTML file exporter
   */
  downloadHTML(resume: Resume) {
    const personal = resume.content?.personal || { firstName: "John", lastName: "Doe", headline: "Headline", email: "", phone: "", city: "", country: "" };
    const summary = resume.content?.summary || { summary: "" };
    
    // Compile clean, simple standalone styled resume HTML markup
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.title}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }
    h1 {
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: -0.025em;
    }
    .headline {
      font-size: 1.1em;
      color: #2563eb;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .contact {
      font-size: 0.9em;
      color: #64748b;
      margin-bottom: 30px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 1.2em;
      text-transform: uppercase;
      font-weight: 800;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <h1>${personal.firstName} ${personal.lastName}</h1>
  <div class="headline">${personal.headline}</div>
  <div class="contact">
    ${personal.phone ? `Phone: ${personal.phone} | ` : ""}
    ${personal.email ? `Email: ${personal.email} | ` : ""}
    Location: ${personal.city || ""}, ${personal.country || ""}
  </div>

  ${summary.summary ? `
  <div class="section">
    <div class="section-title">Summary</div>
    <p>${summary.summary}</p>
  </div>
  ` : ""}

  <div class="section">
    <div class="section-title">Export Details</div>
    <p>This is a backup download representation of your resume configurations.</p>
  </div>
</body>
</html>
    `;

    const filename = `${resume.title.toLowerCase().replace(/\s+/g, "-")}-resume.html`;
    this.triggerDownload(filename, htmlContent, "text/html");
  }
};
