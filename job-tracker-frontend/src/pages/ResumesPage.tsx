import { useState, useEffect } from 'react';
import { resumeService } from '../services/resumeService';
import { Resume } from '../types/models';
import { useToastContext } from '../context/ToastContext';
import { FileText, Plus, CheckCircle, Trash2, Star } from 'lucide-react';

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
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
            <FileText className="text-indigo-600 dark:text-indigo-400" size={22} /> Resume Versions Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain multiple versions of your resume for target role matching and AI analysis.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
        >
          <Plus size={14} /> Add Resume Version
        </button>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {resumes.length === 0 ? (
            <div className="col-span-2 rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
              No resumes uploaded yet. Add a resume to unlock job matching & tailoring!
            </div>
          ) : (
            resumes.map((r) => (
              <div key={r._id} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{r.title}</h3>
                    {r.isPrimary && (
                      <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        <Star size={10} fill="currentColor" /> Primary
                      </span>
                    )}
                  </div>
                  <button onClick={() => handleDelete(r._id)} className="text-slate-400 hover:text-rose-600">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {r.skills?.map((s) => (
                    <span key={s} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-slate-500 line-clamp-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-100 dark:border-slate-800/80">
                  {r.content}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <form onSubmit={handleCreate} className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Add Resume Version</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Resume Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full Stack Developer - 2026"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Node.js, TypeScript, MongoDB"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Resume Text Content</label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste raw markdown or text of your resume..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
              />
              <label htmlFor="isPrimary" className="text-xs text-slate-700 dark:text-slate-300 font-medium">Set as primary resume</label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
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
