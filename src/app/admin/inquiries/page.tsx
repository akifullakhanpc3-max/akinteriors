'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, Archive, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchInput } from '@/components/admin/SearchInput';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Pagination } from '@/components/admin/Pagination';
import { getAdminInquiries, updateInquiryStatus, deleteInquiry } from '@/lib/actions/admin-actions';

interface InquiryItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

export default function AdminInquiries() {
  const [search, setSearch] = useState('');
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadInquiries = useCallback(async (p: number) => {
    setLoading(true);
    const data = await getAdminInquiries(p) as Record<string, unknown>;
    if (data.success) {
      setInquiries((data.items || data.inquiries || []) as InquiryItem[]);
      setTotalPages((data.totalPages as number) || 1);
      setTotalItems((data.total as number) || 0);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadInquiries(page); }, [page, loadInquiries]);

  const handleStatus = async (id: string, status: 'unread' | 'read' | 'archived') => {
    const data = await updateInquiryStatus(id, status);
    if (data.success) {
      setInquiries((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
    }
  };

  const handleDelete = async (id: string) => {
    const data = await deleteInquiry(id);
    if (data.success) {
      setInquiries((prev) => prev.filter((i) => i._id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  };

  const toggleOpen = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
    const inquiry = inquiries.find((i) => i._id === id);
    if (inquiry && inquiry.status === 'unread') {
      handleStatus(id, 'read');
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Service', 'Budget', 'Company', 'Message', 'Status', 'Date'];
    const rows = inquiries.map(i => [
      i.name, i.email, i.phone || '', i.service || '', i.budget || '', i.company || '',
      (i.message || '').replace(/"/g, '""'), i.status, new Date(i.createdAt).toLocaleString(),
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `inquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const filtered = inquiries.filter((i) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || (i.service || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Inquiries" description="Manage customer inquiries.">
        <Button variant="outline" size="sm" className="rounded-full" onClick={exportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search inquiries..." />
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No inquiries found.</div>
          ) : (
            <>
              {filtered.map((inquiry) => {
                const isOpen = selectedId === inquiry._id;
                return (
                  <div key={inquiry._id}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => toggleOpen(inquiry._id)}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#C8A97E]/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#C8A97E]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-[#111827]">{inquiry.name}</h3>
                          {inquiry.status === 'unread' && <span className="w-2 h-2 rounded-full bg-[#C8A97E]" />}
                        </div>
                        <p className="text-xs text-gray-500">{inquiry.email} &bull; {inquiry.service || 'N/A'} &bull; {new Date(inquiry.createdAt).toLocaleDateString()}</p>
                      </div>
                      <StatusBadge status={inquiry.status} />
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {inquiry.status !== 'read' && (
                          <button onClick={() => handleStatus(inquiry._id, 'read')} className="p-2 hover:bg-gray-100 rounded-lg"><Check className="w-4 h-4 text-gray-500" /></button>
                        )}
                        {inquiry.status !== 'archived' && (
                          <button onClick={() => handleStatus(inquiry._id, 'archived')} className="p-2 hover:bg-gray-100 rounded-lg"><Archive className="w-4 h-4 text-gray-500" /></button>
                        )}
                        <button onClick={() => handleDelete(inquiry._id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </motion.div>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="bg-[#F9F7F4] px-4 py-6 border-b border-gray-100"
                      >
                        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                          <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="text-sm font-medium text-[#111827]">{inquiry.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium text-[#111827]">{inquiry.email}</p>
                          </div>
                          {inquiry.phone && (
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="text-sm font-medium text-[#111827]">{inquiry.phone}</p>
                            </div>
                          )}
                          {inquiry.service && (
                            <div>
                              <p className="text-xs text-gray-500">Service</p>
                              <p className="text-sm font-medium text-[#111827]">{inquiry.service}</p>
                            </div>
                          )}
                          {inquiry.budget && (
                            <div>
                              <p className="text-xs text-gray-500">Budget</p>
                              <p className="text-sm font-medium text-[#111827]">{inquiry.budget}</p>
                            </div>
                          )}
                          {inquiry.company && (
                            <div>
                              <p className="text-xs text-gray-500">Company</p>
                              <p className="text-sm font-medium text-[#111827]">{inquiry.company}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm font-medium text-[#111827]">{new Date(inquiry.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        {inquiry.message && (
                          <div className="mt-4">
                            <p className="text-xs text-gray-500 mb-1">Message</p>
                            <p className="text-sm text-[#111827] bg-white rounded-lg p-4 border border-gray-200">{inquiry.message}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
