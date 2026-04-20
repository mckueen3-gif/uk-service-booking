'use client';

import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  History,
  Loader2,
  FileText,
  Send,
  Users
} from 'lucide-react';
import { generateQuizFromContext, saveQuizAttempt, shareResultWithTutor } from '@/app/actions/ai_education';
import { useTranslation } from '@/components/LanguageContext';

interface AIStudyHubProps {
  usedToday: number;
  limit: number;
  recentAttempts: any[];
  bookings: any[];
}

export default function AIStudyHub({ usedToday, limit, recentAttempts, bookings }: AIStudyHubProps) {
  const { t, format } = useTranslation();
  const [step, setStep] = useState<'idle' | 'generating' | 'quiz' | 'result'>('idle');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [latestAttemptId, setLatestAttemptId] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<'text' | 'image'>('text');
  const [subject, setSubject] = useState('General');
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 轉換圖片為 Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 觸發 AI 出題
  const handleGenerate = async () => {
    if (sourceType === 'text' && !textInput.trim()) return;
    if (sourceType === 'image' && !imagePreview) return;

    setIsLoading(true);
    setError(null);
    setStep('generating');

    try {
      const result = await generateQuizFromContext({
        subject,
        textContext: sourceType === 'text' ? textInput : undefined,
        imageBase64: sourceType === 'image' ? imagePreview || undefined : undefined
      });

      setActiveQuiz(result.quiz);
      setStep('quiz');
    } catch (err: any) {
      setError(err.message || t.member_dashboard.hero.errors.unknown);
      setStep('idle');
    } finally {
      setIsLoading(false);
    }
  };

  // 提交作答
  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setIsLoading(true);
    try {
      const result = await saveQuizAttempt(activeQuiz.id, userAnswers);
      setFinalScore(result.attempt.score);
      setDiagnosis(result.attempt.aiDiagnosis);
      setLatestAttemptId(result.attempt.id);
      setStep('result');
    } catch (err: any) {
      setError(err.message || t.member_dashboard.hero.errors.unknown);
    } finally {
      setIsLoading(false);
    }
  };

  // 執行分享
  const handleShare = async () => {
    if (!latestAttemptId || !selectedMerchantId) return;
    setIsLoading(true);
    try {
      await shareResultWithTutor(latestAttemptId, selectedMerchantId);
      setShareSuccess(true);
      setTimeout(() => {
        setShowShareModal(false);
        setShareSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError('分享失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const remaining = Math.max(0, limit - usedToday);
  
  // 過濾出教育類商家的導師列表
  const tutors = Array.from(new Set(
    bookings
      .filter(b => b.isEducation && b.merchant)
      .map(b => ({
        id: b.merchant.id,
        name: b.merchant.companyName || b.merchant.user?.name || t.common.status.unknown
      }))
      .map(t => JSON.stringify(t))
  )).map(t => JSON.parse(t));
  
  // 智慧選項拆分：防止 AI 將選項擠在一起
  const parseOptions = (options: any): string[] => {
    if (!Array.isArray(options)) return [];
    if (options.length === 1 && typeof options[0] === 'string') {
      const raw = options[0];
      // 如果包含 ●A. 或 A. 這種明顯的分隔符
      if (raw.includes('●') || (raw.includes('A.') && raw.includes('B.'))) {
        // 使用正則拆分：找 ● 或 A. B. C. D.
        const parts = raw.split(/●[A-Z]\.?|[A-Z]\.\s?|[A-D]\)\s?/).filter((s: string) => s.trim().length > 0);
        if (parts.length >= 2) return parts.map((s: string) => s.trim());
      }
    }
    // 過濾掉前綴（防禦性處理）
    return options.map((opt: string) => {
      if (typeof opt !== 'string') return String(opt);
      return opt.replace(/^[A-Z]\.\s?|^●[A-Z]\.?\s?|^[A-D]\)\s?/, '').trim();
    });
  };

  // ── Render States ──────────────────────────────────────────────────

  if (step === 'generating') {
    return (
      <div className="study-hub-card loading-state">
        <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
        <h3>{t.member_dashboard.study_hub.generating.title}</h3>
        <p>{t.member_dashboard.study_hub.generating.sub}</p>
      </div>
    );
  }

  if (step === 'quiz') {
    return (
      <div className="study-hub-card quiz-mode">
        <div className="quiz-header">
          <h2>{activeQuiz.title}</h2>
          <span className="quiz-subject-tag">{activeQuiz.subject}</span>
        </div>
        
        <div className="questions-list">
          {activeQuiz.questions.map((q: any, idx: number) => (
            <div key={q.id} className="question-item">
              <p className="question-text"><strong>Q{idx + 1}.</strong> {q.questionText}</p>
              <div className="options-grid">
                {parseOptions(q.options).map((opt: string) => (
                  <label key={opt} className={`option-label ${userAnswers[q.id] === opt ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name={`q-${q.id}`} 
                      value={opt} 
                      onChange={() => setUserAnswers({...userAnswers, [q.id]: opt})}
                      checked={userAnswers[q.id] === opt}
                    />
                    <span className="option-text">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button 
          className="submit-quiz-btn" 
          onClick={handleSubmitQuiz}
          disabled={Object.keys(userAnswers).length < activeQuiz.questions.length || isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : t.member_dashboard.study_hub.quiz.complete}
        </button>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="study-hub-card result-mode">
        <div className="score-circle">
          <span className="score-num">{finalScore}</span>
          <span className="score-total">/ 5</span>
        </div>
        <h3>{t.member_dashboard.study_hub.quiz.finish}</h3>
        
        <div className="diagnosis-box">
          <h4><Sparkles size={18} /> {t.member_dashboard.study_hub.quiz.report}</h4>
          <div className="diagnosis-content">
            {diagnosis}
          </div>
        </div>

        <div className="result-actions">
          <button className="primary-btn" onClick={() => setStep('idle')}>{t.member_dashboard.study_hub.quiz.back}</button>
          {tutors.length > 0 && (
            <button className="secondary-btn" onClick={() => setShowShareModal(true)}>
              <Users size={16} /> {t.member_dashboard.study_hub.quiz.share}
            </button>
          )}
        </div>

        {showShareModal && (
          <div className="share-overlay">
            <div className="share-modal">
              {shareSuccess ? (
                <div className="share-success">
                  <CheckCircle2 size={48} color="#10b981" />
                  <h4>{t.member_dashboard.study_hub.share.success}</h4>
                  <p>{t.member_dashboard.study_hub.share.successDesc}</p>
                </div>
              ) : (
                <>
                  <h4>{t.member_dashboard.study_hub.share.title}</h4>
                  <p>{t.member_dashboard.study_hub.share.desc}</p>
                  <select 
                    className="share-select"
                    value={selectedMerchantId} 
                    onChange={(e) => setSelectedMerchantId(e.target.value)}
                  >
                    <option value="">{t.member_dashboard.study_hub.placeholders.selectTutor}</option>
                    {tutors.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <div className="modal-btns">
                    <button className="cancel-btn" onClick={() => setShowShareModal(false)}>{t.member_dashboard.study_hub.share.cancel}</button>
                    <button 
                      className="confirm-share-btn" 
                      disabled={!selectedMerchantId || isLoading}
                      onClick={handleShare}
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={16} /> : t.member_dashboard.study_hub.share.confirm}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="study-hub-card idle-mode">
      <div className="hub-header">
        <div className="hub-title">
          <BookOpen className="hub-icon" />
          <h3>{t.member_dashboard.study_hub.title}</h3>
        </div>
        <div className={`quota-badge ${usedToday >= limit ? 'out' : ''}`}>
          {format(t.member_dashboard.study_hub.quota, { remaining: Math.max(0, limit - usedToday), limit })}
        </div>
      </div>

      <div className="hub-content">
        <p className="hub-intro">{t.member_dashboard.study_hub.intro}</p>
        
        <div className="source-tabs">
          <button 
            className={`tab-btn ${sourceType === 'text' ? 'active' : ''}`}
            onClick={() => setSourceType('text')}
          >
            <FileText size={16} /> {t.member_dashboard.study_hub.tabs.text}
          </button>
          <button 
            className={`tab-btn ${sourceType === 'image' ? 'active' : ''}`}
            onClick={() => setSourceType('image')}
          >
            <Upload size={16} /> {t.member_dashboard.study_hub.tabs.photo}
          </button>
        </div>

        {sourceType === 'text' ? (
          <textarea 
            className="hub-textarea"
            placeholder="輸入您想練習的主題（例如：GCSE Maths Algebra, DSE English Reading...）"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        ) : (
          <div className="image-upload-zone" onClick={() => fileInputRef.current?.click()}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="upload-preview" />
            ) : (
              <>
                <Upload size={32} />
                <p>點擊或拖放筆記照片</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        )}

        <div className="subject-row">
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="General">通用學科</option>
            <option value="Mathematics">數學 (Mathematics)</option>
            <option value="English">英文 (English)</option>
            <option value="Science">科學 (Science)</option>
            <option value="History">歷史 (History)</option>
          </select>
          <button 
            className="generate-btn" 
            onClick={handleGenerate}
            disabled={remaining === 0 || isLoading}
          >
            <Sparkles size={18} /> 開始生成題目
          </button>
        </div>

        {error && <div className="error-msg"><AlertCircle size={14} /> {error}</div>}

        {recentAttempts.length > 0 && (
          <div className="recent-history">
            <h4><History size={16} /> 最近挑戰</h4>
            {recentAttempts.map((a: any) => (
              <div key={a.id} className="history-item">
                <span className="history-title">{a.quiz.title}</span>
                <span className="history-score">{a.score}/5</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .study-hub-card {
          background: var(--surface-1);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-color);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 480px;
          position: relative;
          overflow: hidden;
        }
        
        .loading-state {
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .hub-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .hub-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .hub-icon {
          color: var(--accent-color);
        }

        .hub-title h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .quota-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.65rem;
          background: #f59e0b15;
          color: #f59e0b;
          border-radius: 2rem;
          font-weight: 700;
          border: 1px solid #f59e0b30;
        }

        .quota-badge.out {
          background: #ef444415;
          color: #ef4444;
          border-color: #ef444430;
        }

        .hub-intro {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .source-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.65rem;
          font-size: 0.82rem;
          font-weight: 600;
          border-radius: 0.75rem;
          border: 1px solid var(--border-color);
          background: var(--surface-2);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: var(--accent-light);
          color: var(--accent-color);
          border-color: var(--accent-color);
        }

        .hub-textarea {
          width: 100%;
          height: 120px;
          padding: 1rem;
          border-radius: 0.85rem;
          border: 1px solid var(--border-color);
          background: var(--surface-2);
          color: var(--text-primary);
          font-size: 0.88rem;
          resize: none;
          margin-bottom: 1rem;
        }

        .image-upload-zone {
          width: 100%;
          height: 120px;
          border: 2px dashed var(--border-color);
          border-radius: 0.85rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--text-muted);
          cursor: pointer;
          margin-bottom: 1rem;
          overflow: hidden;
        }

        .upload-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .subject-row {
          display: flex;
          gap: 1rem;
        }

        .subject-row select {
          flex: 1;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border-color);
          background: var(--surface-2);
          color: var(--text-primary);
          font-weight: 600;
        }

        .generate-btn {
          flex: 1.5;
          padding: 0.75rem;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .generate-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .question-item {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .question-text {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        @media (min-width: 640px) {
          .options-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .option-label {
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border-color);
          background: var(--surface-2);
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .option-label.selected {
          border-color: var(--accent-color);
          background: var(--accent-light);
          color: var(--accent-color);
        }

        .submit-quiz-btn {
          margin-top: 1rem;
          padding: 1rem;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 0.85rem;
          font-weight: 800;
          cursor: pointer;
        }

        .submit-quiz-btn:disabled {
          opacity: 0.5;
        }

        .score-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--accent-light);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          align-self: center;
          margin-bottom: 1rem;
        }

        .score-num {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--accent-color);
        }

        .score-total {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .diagnosis-box {
          background: rgba(var(--accent-rgb, 191, 155, 48), 0.08); 
          border: 1px solid rgba(var(--accent-rgb, 191, 155, 48), 0.3);
          border-radius: 1rem;
          padding: 1.25rem;
          margin-top: 1rem;
        }

        .diagnosis-box h4 {
          margin: 0 0 0.75rem 0;
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--accent-color);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .diagnosis-content {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--text-primary);
          white-space: pre-wrap;
        }

        .result-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .primary-btn {
          flex: 1;
          padding: 0.85rem;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .secondary-btn {
          flex: 1;
          padding: 0.85rem;
          background: var(--surface-2);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .recent-history {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .error-msg {
          color: #ef4444;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .share-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .share-modal {
          background: white;
          padding: 2rem;
          border-radius: 1.5rem;
          width: 90%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .share-modal h4 { margin: 0; font-weight: 800; }
        .share-modal p { font-size: 0.88rem; color: var(--text-muted); line-height: 1.4; }
        
        .share-select {
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border-color);
          width: 100%;
        }

        .modal-btns {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .cancel-btn {
          flex: 1; padding: 0.75rem; border: none; background: #f3f4f6; border-radius: 0.75rem; font-weight: 700; cursor: pointer;
        }

        .confirm-share-btn {
          flex: 1; padding: 0.75rem; border: none; background: var(--accent-color); color: white; border-radius: 0.75rem; font-weight: 700; cursor: pointer;
        }

        .confirm-share-btn:disabled { opacity: 0.5; }

        .share-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}

function GraduationCap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
