import { useState } from 'react';
import DatePicker from 'react-datepicker';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { Notice, TFile } from 'obsidian';
import { usePlugin } from '@/hooks/usePlugin';

interface Dream {
  date: Date;
  content: string;
  title: string;
}

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

    const pdf = new jsPDF();
    let yPosition = 20;

    pdf.setFontSize(20);
    pdf.text('Dream Journal', 20, yPosition);
    yPosition += 20;

    dreams.forEach((dream: Dream) => {
      pdf.setFontSize(16);
      pdf.text(dream.title, 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(14);
      pdf.text(format(new Date(dream.date), 'PPP'), 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      const splitContent = pdf.splitTextToSize(dream.content, 170);
      pdf.text(splitContent, 20, yPosition);
      yPosition += (splitContent.length * 7) + 15;

      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
    });

    pdf.save('dream-journal.pdf'); // TODO: make this dynamic (default to date range)
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
        onClick={exportToPDF}
        >
        {/* disabled={!startDate || !endDate} */}
        Export to PDF
      </button>
    </div>
  );
};