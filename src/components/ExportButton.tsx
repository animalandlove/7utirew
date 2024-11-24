import React from 'react';
import { FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { AnimalInfo } from '../services/gemini';

interface ExportButtonProps {
  data: AnimalInfo;
  imageUrl: string;
  format: 'pdf' | 'csv';
}

export const ExportButton: React.FC<ExportButtonProps> = ({ data, imageUrl, format }) => {
  const handleExportPDF = async () => {
    try {
      const doc = new jsPDF();
      const img = new Image();
      
      // Convert data URL to image for PDF
      img.src = imageUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Add title
      doc.setFontSize(20);
      doc.text('Animal Identification Report', 20, 20);

      // Add image
      const imgWidth = 170;
      const imgHeight = (img.height * imgWidth) / img.width;
      doc.addImage(img, 'JPEG', 20, 30, imgWidth, imgHeight);

      // Add animal information
      const startY = imgHeight + 40;
      doc.setFontSize(12);
      doc.text(`Species: ${data.species}`, 20, startY);
      doc.text(`Scientific Name: ${data.scientificName}`, 20, startY + 10);
      doc.text(`Confidence: ${data.confidence}%`, 20, startY + 20);
      doc.text(`Habitat: ${data.habitat}`, 20, startY + 30);
      doc.text(`Diet: ${data.diet}`, 20, startY + 40);
      doc.text(`Conservation Status: ${data.conservationStatus}`, 20, startY + 50);

      // Save the PDF
      doc.save('animal-identification.pdf');
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const handleExportCSV = () => {
    try {
      const csvData = [{
        Species: data.species,
        ScientificName: data.scientificName,
        Confidence: `${data.confidence}%`,
        Habitat: data.habitat,
        Diet: data.diet,
        ConservationStatus: data.conservationStatus
      }];

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', 'animal-identification.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('CSV downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate CSV');
    }
  };

  return (
    <button
      onClick={format === 'pdf' ? handleExportPDF : handleExportCSV}
      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors group"
      title={`Export as ${format.toUpperCase()}`}
    >
      <FileDown className="h-5 w-5 text-gray-600 group-hover:text-emerald-600" />
    </button>
  );
};