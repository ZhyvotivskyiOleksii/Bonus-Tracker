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
import { Download, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface EmailTableProps {
  emails: { email: string }[];
}

export function EmailTable({ emails }: EmailTableProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

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

  const syncToBrevo = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/brevo/sync', { method: 'POST' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Sync failed (${res.status})`);
      }
      toast({ title: 'Synced to Brevo', description: `Synced: ${json.synced}, Failed: ${json.failed}` });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Brevo Sync Failed', description: e?.message || 'Unknown error' });
    } finally {
      setIsSyncing(false);
    }
  };

  const checkBrevo = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/brevo/check');
      const json = await res.json();
      if (!res.ok || !json.ok) {
        const extra = json?.accountStatus ? ` (status ${json.accountStatus})` : ` (${res.status})`;
        const body = typeof json?.accountBody === 'string' ? ` — ${json.accountBody.slice(0, 120)}` : '';
        throw new Error((json?.reason || 'Check failed') + extra + body);
      }
      toast({ title: 'Brevo OK', description: `Key: ${json.hasKey ? 'yes' : 'no'}, Lists: ${json.listIds?.join(',') || 'none'}, Status: ${json.accountStatus}` });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Brevo Check Failed', description: e?.message || 'Unknown error' });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={checkBrevo} disabled={isChecking}>
          {isChecking ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Check Brevo
        </Button>
        <Button variant="outline" onClick={syncToBrevo} disabled={isSyncing}>
          {isSyncing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Sync to Brevo
        </Button>
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
