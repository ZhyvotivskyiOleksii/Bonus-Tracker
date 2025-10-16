'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface EmailTableProps {
  emails: { email: string }[];
}

export function EmailTable({ emails }: EmailTableProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPdf = () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("Registered User Emails", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Total emails: ${emails.length}`, 14, 29);
      
      (doc as any).autoTable({
        startY: 35,
        head: [['#', 'Email']],
        body: emails.map((item, index) => [index + 1, item.email]),
        theme: 'striped',
        headStyles: { fillColor: [30, 30, 40] },
        styles: { font: 'helvetica', fontSize: 10 },
      });

      doc.save('user-emails.pdf');

    } catch (e) {
        console.error("Error generating PDF", e);
        alert("Could not generate PDF. See console for details.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Button onClick={downloadPdf} disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Download as PDF
        </Button>
      </div>
      <div className="rounded-lg bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/10 bg-white/5">
              <TableHead className="w-[80px]">#</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emails.length ? (
              emails.map((item, index) => (
                <TableRow key={index} className="border-b border-white/10">
                  <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-semibold">{item.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  No user emails found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
