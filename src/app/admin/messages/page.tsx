'use client';

import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen, AlertCircle } from 'lucide-react';
import { fetchAdminAPI } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminAPI<Message[]>('/admin/messages');
      setMessages(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await fetchAdminAPI(`/admin/messages/${id}`, { method: 'DELETE' });
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleReadMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      try {
        await fetchAdminAPI(`/admin/messages/${msg.id}`, { method: 'GET' }); // This triggers the read action in backend
        setMessages(messages.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m)));
      } catch (err) {
        console.error('Failed to mark as read', err);
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Loading messages...
      </div>
    );
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Messages" description="Manage incoming messages from contact form" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-y-auto flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <MailOpen size={48} className="text-slate-300 mb-4" />
              <p>Your inbox is empty</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  onClick={() => handleReadMessage(msg)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${selectedMessage?.id === msg.id ? 'bg-primary/5 border-l-4 border-primary' : 'border-l-4 border-transparent'} ${!msg.is_read ? 'bg-slate-50/80' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      {!msg.is_read && (
                        <span
                          className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0"
                          title="Unread"
                        ></span>
                      )}
                      <h4
                        className={`font-semibold text-sm truncate ${!msg.is_read ? 'text-slate-900' : 'text-slate-700'}`}
                      >
                        {msg.name}
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p
                    className={`text-sm truncate mb-2 ${!msg.is_read ? 'font-medium text-slate-800' : 'text-slate-500'}`}
                  >
                    {msg.subject || 'No Subject'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{msg.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Message Viewer */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {selectedMessage.subject || '(No Subject)'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-slate-700">{selectedMessage.name}</span>
                    <span className="text-slate-400">&lt;{selectedMessage.email}&gt;</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Received on {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(selectedMessage.id, e)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Message"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700">
                  {selectedMessage.content}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Mail size={64} className="text-slate-200 mb-4" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
