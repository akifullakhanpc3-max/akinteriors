'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { getAdminFAQs, createFAQ, updateFAQ, deleteFAQ } from '@/lib/actions/admin-actions';

interface FAQItem {
  _id: string;
  question: string;
  answer?: string;
  category?: string;
  order: number;
  isActive?: boolean;
}

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<FAQItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', category: '', order: 0, isActive: true });

  const loadFAQs = useCallback(async (p: number) => {
    setLoading(true);
    const data = await getAdminFAQs(p);
    if (data.success) {
      const result = data as Record<string, unknown>;
      setFaqs((result.items || result.faqs || []) as FAQItem[]);
      setTotalPages((result.totalPages as number) || 1);
      setTotalItems((result.total as number) || 0);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadFAQs(page); }, [page, loadFAQs]);

  const resetForm = () => {
    setForm({ question: '', answer: '', category: '', order: 0, isActive: true });
  };

  const openCreate = () => { resetForm(); setEditing(null); setShowDialog(true); };

  const openEdit = (faq: FAQItem) => {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer || '',
      category: faq.category || '',
      order: faq.order,
      isActive: faq.isActive ?? true,
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.question || !form.answer) {
      toast({ title: 'Error', description: 'Question and answer are required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await updateFAQ(editing._id, form);
        if (res.success) {
          toast({ title: 'Success', description: 'FAQ updated' });
          setShowDialog(false);
          loadFAQs(page);
        } else {
          toast({ title: 'Error', description: res.error || 'Update failed', variant: 'destructive' });
        }
      } else {
        const res = await createFAQ(form);
        if (res.success) {
          toast({ title: 'Success', description: 'FAQ created' });
          setShowDialog(false);
          loadFAQs(1);
          setPage(1);
        } else {
          toast({ title: 'Error', description: res.error || 'Creation failed', variant: 'destructive' });
        }
      }
    } catch {
      toast({ title: 'Error', description: 'Operation failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const res = await deleteFAQ(deleteConfirm._id);
    if (res.success) {
      toast({ title: 'Success', description: 'FAQ deleted' });
      setDeleteConfirm(null);
      loadFAQs(page);
    } else {
      toast({ title: 'Error', description: res.error || 'Delete failed', variant: 'destructive' });
    }
  };

  const columns: Column<FAQItem>[] = [
    {
      key: 'question',
      header: 'Question',
      render: (f) => (
        <div>
          <span className="font-medium text-[#111827]">{f.question}</span>
          {f.category && <span className="text-xs text-gray-400 ml-2">({f.category})</span>}
        </div>
      ),
    },
    { key: 'order', header: 'Order', render: (f) => <span className="text-sm text-gray-500">{f.order}</span> },
    { key: 'isActive', header: 'Status', render: (f) => <StatusBadge status={f.isActive ? 'active' : 'inactive'} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions."
        actionLabel="Add FAQ"
        onAction={openCreate}
      />

      <DataTable
        columns={columns}
        data={faqs}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteConfirm}
        emptyMessage='No FAQs yet. Click "Add FAQ" to create one.'
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        keyExtractor={(f) => f._id}
        hideSearch
      />

      <Dialog open={showDialog} onOpenChange={v => { if (!v) { setShowDialog(false); resetForm(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the FAQ details.' : 'Add a new frequently asked question.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="question">Question *</Label>
              <Input id="question" value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} placeholder="Frequently asked question" />
            </div>
            <div>
              <Label htmlFor="answer">Answer *</Label>
              <Textarea id="answer" value={form.answer} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} placeholder="Answer to the question" rows={4} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Services, Pricing" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="order">Order</Label>
                <Input id="order" type="number" min={0} value={form.order} onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch id="active" checked={form.isActive} onCheckedChange={v => setForm(p => ({ ...p, isActive: v }))} />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDialog(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(v) => { if (!v) setDeleteConfirm(null); }}
        onConfirm={handleDelete}
        title="Delete FAQ"
        description={`Are you sure you want to delete "${deleteConfirm?.question}"? This action cannot be undone.`}
      />
    </div>
  );
}
