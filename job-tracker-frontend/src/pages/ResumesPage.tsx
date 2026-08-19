import { useState, useEffect } from 'react';
import { resumeService } from '../services/resumeService';
import { Resume } from '../types/models';
import { useToastContext } from '../context/ToastContext';
import { FileText, Plus, Trash2, Star } from 'lucide-react';

export default function ResumesPage() {
  const { pushToast } = useToastContext();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [skills, setSkills] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const data = await resumeService.list();
      setResumes(data);
    } catch (e) {
      pushToast('error', 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      pushToast('error', 'Title and resume content are required.');
      return;
    }
    try {
      await resumeService.create({
        title,
        content,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        isPrimary
      });
      pushToast('success', 'Resume created successfully');
      setShowModal(false);
      setTitle('');
      setContent('');
      setSkills('');
      loadResumes();
    } catch (e) {
      pushToast('error', 'Failed to create resume');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumeService.remove(id);
      pushToast('success', 'Resume deleted');
      loadResumes();
    } catch (e) {
      pushToast('error', 'Failed to delete resume');
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-violet-100 dark:border-haiti-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-haiti-900 dark:text-white flex items-center gap-2 tracking-tight">
            <FileText className="text-violet-500" size={20} /> Resume Versions Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-haiti-300 font-normal mt-0.5">
            Maintain multiple versions of your resume for target role matching and AI analysis.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="quantus-btn-primary text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={14} /> Add Resume Version
        </button>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {resumes.length === 0 ? (
            <div className="col-span-2 quantus-card border-dashed p-8 text-center text-xs text-slate-400 dark:text-haiti-400">
              No resumes uploaded yet. Add a resume to unlock job matching & tailoring!
            </div>
          ) : (
            resumes.map((r) => (
              <div key={r._id} className="quantus-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-haiti-900 dark:text-white">{r.title}</h3>
                    {r.isPrimary && (
                      <span className="quantus-badge-turbo flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Primary
                      </span>
                    )}
                  </div>
                  <button onClick={() => handleDelete(r._id)} className="text-slate-400 hover:text-rose-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {r.skills?.map((s) => (
                    <span key={s} className="quantus-badge-violet">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-slate-500 dark:text-haiti-300 line-clamp-3 bg-violet-50/50 dark:bg-haiti-950 p-2.5 rounded-lg border border-violet-100 dark:border-haiti-800">
                  {r.content}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-haiti-950/40 backdrop-blur-xs p-4">
          <form onSubmit={handleCreate} className="w-full max-w-lg quantus-card p-6 animate-fade-scale space-y-4">
            <h3 className="text-sm font-bold text-haiti-900 dark:text-white">Add Resume Version</h3>
            <div>
              <label className="block text-xs font-semibold text-haiti-900 dark:text-white mb-1">Resume Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full Stack Developer - 2026"
                className="w-full rounded-lg border border-violet-100 bg-white p-2.5 text-xs text-haiti-900 focus:outline-hidden focus:ring-1 focus:ring-violet-500 focus:border-violet-500 dark:border-haiti-800 dark:bg-haiti-950 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-haiti-900 dark:text-white mb-1">Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Node.js, TypeScript, MongoDB"
                className="w-full rounded-lg border border-violet-100 bg-white p-2.5 text-xs text-haiti-900 focus:outline-hidden focus:ring-1 focus:ring-violet-500 focus:border-violet-500 dark:border-haiti-800 dark:bg-haiti-950 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-haiti-900 dark:text-white mb-1">Resume Text Content</label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste raw markdown or text of your resume..."
                className="w-full rounded-lg border border-violet-100 bg-white p-2.5 text-xs text-haiti-900 focus:outline-hidden focus:ring-1 focus:ring-violet-500 focus:border-violet-500 dark:border-haiti-800 dark:bg-haiti-950 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="rounded border-violet-300 text-violet-600 focus:ring-violet-500"
              />
              <label htmlFor="isPrimary" className="text-xs text-haiti-900 dark:text-white font-medium">Set as primary resume</label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="quantus-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="quantus-btn-primary text-xs"
              >
                Save Resume
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
