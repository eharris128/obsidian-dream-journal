import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { PDFDocument, StandardFonts, type PDFFont } from 'pdf-lib';
import { format } from 'date-fns';
import { Notice, TFile } from 'obsidian';
import { usePlugin } from '@/hooks/usePlugin';

interface Dream {
  date: Date;
  content: string;
  title: string;
}

// Standard PDF fonts use WinAnsi encoding and throw on characters they can't
// represent (emoji, most non-Latin scripts). Drop anything outside the
// printable ASCII / Latin-1 range so export never fails on freeform content.
const sanitize = (text: string): string =>
  text.replace(/[^\t\n\x20-\x7E\xA0-\xFF]/g, '');

// Replacement for jsPDF's splitTextToSize: greedily wrap each paragraph to
// maxWidth, preserving the user's own line breaks.
const wrapText = (
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] => {
  const lines: string[] = [];
  for (const paragraph of sanitize(text).split('\n')) {
    if (paragraph === '') {
      lines.push('');
      continue;
    }
    let current = '';
    for (const word of paragraph.split(' ')) {
      const candidate = current ? `${current} ${word}` : word;
      if (current && font.widthOfTextAtSize(candidate, fontSize) > maxWidth) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
};

export const DreamExport: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const plugin = usePlugin();

  const exportToPDF = async () => {
    if (!startDate || !endDate) return;

    if (!plugin) return;
    const vault = plugin.app.vault;
    const dreamsFolder = vault.getFolderByPath(plugin.settings.dreamsDir);
    if (!dreamsFolder) {
      new Notice('No dreams folder found');
      return;
    }

    const dreamFiles = dreamsFolder.children
      .filter((file): file is TFile => file instanceof TFile && file.extension === 'md')
      .filter(file => {
        const fileDate = new Date(file.stat.ctime);
        const isInRange = fileDate >= startDate && fileDate <= endDate;
        return isInRange;
      });

    const dreams: Dream[] = await Promise.all(
      dreamFiles.map(async file => {
        const content = await vault.cachedRead(file);
        return {
          date: new Date(file.stat.ctime),
          title: file.basename,
          content
        };
      })
    );

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const margin = 50;
    const pageWidth = 612; // US Letter, points
    const pageHeight = 792;
    const contentWidth = pageWidth - margin * 2;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    // Draw lines, paginating as needed. lineHeight is per-line vertical advance.
    const drawLines = (lines: string[], size: number, lineHeight: number) => {
      for (const line of lines) {
        if (y - lineHeight < margin) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        y -= lineHeight;
        if (line) page.drawText(line, { x: margin, y, size, font });
      }
    };

    drawLines(['Dream Journal'], 20, 28);
    y -= 10;

    dreams.forEach((dream: Dream) => {
      drawLines(wrapText(dream.title, font, 16, contentWidth), 16, 22);
      drawLines([format(new Date(dream.date), 'PPP')], 14, 20);
      drawLines(wrapText(dream.content, font, 12, contentWidth), 12, 16);
      y -= 15;
    });

    const pdfBytes = await pdfDoc.save();
    // Trigger a browser download (mobile-safe — no Electron/Node APIs).
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'dream-journal.pdf'; // TODO: make this dynamic (default to date range)
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="date-picker-container test-datepicker-styles">
      <DatePicker
        selected={startDate}
        onChange={(date: Date | null) => setStartDate(date)}
        selectsStart
        startDate={startDate ?? undefined}
        endDate={endDate ?? undefined}
        placeholderText="Start date"
        className="date-picker"
        dateFormat="MM/dd/yyyy"
        icon={null}
      />
      <DatePicker
        selected={endDate}
        onChange={(date: Date | null) => setEndDate(date)}
        selectsEnd
        startDate={startDate ?? undefined}
        endDate={endDate ?? undefined}
        minDate={startDate ?? undefined}
        placeholderText="End date"
        className="date-picker"
        dateFormat="MM/dd/yyyy"
        icon={null}
      />
      <button
        className="export-btn"
        onClick={() => void exportToPDF()}
        >
        {/* disabled={!startDate || !endDate} */}
        Export to PDF
      </button>
    </div>
  );
};