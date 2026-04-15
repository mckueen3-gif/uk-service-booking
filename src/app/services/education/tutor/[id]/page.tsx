"use client";

import React, { useState } from 'react';
import { MapPin, Star, Sparkles, BookOpen, Clock, Video, UserCheck, ShieldCheck, GraduationCap, Lock } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/components/LanguageContext';
import { useSession } from 'next-auth/react';

export default function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { t, locale } = useTranslation();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAITrial, setShowAITrial] = useState(false);
  const [challengeState, setChallengeState] = useState<'idle' | 'loading' | 'active' | 'completed' | 'error' | 'login-required'>('idle');
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  React.useEffect(() => {
    fetch(`/api/education/tutors/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setProfile(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [id]);

  // 🚀 AI Challenge Logic
  const startChallenge = async () => {
    if (!profile) return;
    
    // 🛡️ 引導登入：若未登入則切換至引導狀態
    if (status === 'unauthenticated') {
      setChallengeState('login-required');
      return;
    }

    setChallengeState('loading');
    setQuestions([]);
    setCurrentStep(0);
    setScore(0);
    setSelectedIdx(null);
    setShowExplanation(false);

    try {
      const subject = typeof profile.subjects === 'string' ? profile.subjects.split(",")[0] : "Education";
      const res = await fetch('/api/ai/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject,
          level: "GCSE",
          tutorName: profile.name,
          locale: locale
        })
      });

      if (!res.ok) throw new Error("Failed to load questions");
      const data = await res.json();
      setQuestions(data.questions);
      setChallengeState('active');
    } catch (e) {
      console.error(e);
      setChallengeState('error');
    }
  };

  const handleAnswer = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    setShowExplanation(true);
    
    if (idx === questions[currentStep].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(s => s + 1);
      setSelectedIdx(null);
      setShowExplanation(false);
    } else {
      setChallengeState('completed');
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '10rem 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid var(--accent-color)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Curating expert profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '10rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Expert Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We couldn't find the tutor you're looking for.</p>
        <Link href="/services/education/search" style={{ color: 'var(--accent-color)', fontWeight: 800 }}>Back to Search Results →</Link>
      </div>
    );
  }

  const subjectList = typeof profile.subjects === 'string' ? profile.subjects.split(", ") : [profile.subjects || "Expert Tutor"];

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container" style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
        
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--surface-1)', boxShadow: 'var(--shadow-md)' }} />
              ) : (
                <div style={{ 
                  width: '120px', height: '120px', borderRadius: '50%', 
                  backgroundColor: 'var(--surface-2)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)'
                }}>
                  {profile.name?.charAt(0)}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{profile.name}</h1>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {subjectList.map((sub: string) => (
                        <span key={sub} style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 700 }}>
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>£{profile.rate}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{t?.education_sec?.common?.hr || "/hr"}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <Star size={18} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{Number(profile.rating).toFixed(1)}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({profile.reviews} {t?.education_sec?.common?.reviews || "Reviews"})</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18} /> {profile.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Video size={18} /> {profile.mode}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#facc15' }}><ShieldCheck size={18} /> {t?.education_sec?.tutorProfile?.verified || "Shield Verified"}</span>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{t?.education_sec?.tutorProfile?.about || "About Professional"}</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {profile.bio}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-2)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <GraduationCap size={20} color="var(--accent-color)" />
                  <h4 style={{ fontWeight: 800 }}>{t?.education_sec?.tutorProfile?.education || "Education"}</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>{profile.education}</p>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-2)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <UserCheck size={20} color="var(--accent-color)" />
                  <h4 style={{ fontWeight: 800 }}>{t?.education_sec?.tutorProfile?.experience || "Experience"}</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>{profile.experience}</p>
              </div>
            </div>
          </div>
          
          {/* Portfolio Section */}
          {profile.portfolioImages && profile.portfolioImages.length > 0 && (
            <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>{t?.education_sec?.tutorProfile?.portfolio || "Portfolio"}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Take a look at my past work, learning environments, and successful case studies.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {profile.portfolioImages.map((imgUrl: string, idx: number) => (
                  <div key={idx} style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3' }}>
                    <img 
                      src={imgUrl} 
                      alt={`Portfolio item ${idx + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} 
                      className="hover-scale"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>{t?.education_sec?.tutorProfile?.reviews || "Client Feedback"}</h3>
            {profile.recentReviews && profile.recentReviews.length > 0 ? (
              profile.recentReviews.map((r: any) => (
                <div key={r.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h5 style={{ fontWeight: 700 }}>{r.user}</h5>
                    <div style={{ display: 'flex' }}>
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} size={14} fill={i < r.rating ? "#f59e0b" : "transparent"} color="#f59e0b" />
                       ))}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{r.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to book a lesson!</p>
            )}
          </div>
        </div>

        {/* Sidebar - Booking */}
        <aside style={{ width: '380px' }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', position: 'sticky', top: '100px' }}>
            
            <button 
              onClick={() => {
                setShowAITrial(true);
                setChallengeState('idle');
              }}
              style={{ 
                width: '100%', padding: '1rem', borderRadius: '16px', 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                cursor: 'pointer', marginBottom: '2rem', transition: 'transform 0.2s'
              }}
              className="hover-scale"
            >
              <Sparkles size={20} color="#facc15" /> {t?.education_sec?.tutorProfile?.aiTrial || "AI Trial Discovery"}
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} /> {t?.education_sec?.tutorProfile?.availability || "Schedule"}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {profile.availability && profile.availability.map((day: any) => (
                <div key={day.day}>
                  <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{day.day}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {day.slots.map((slot: any) => (
                      <button key={slot} style={{ 
                        padding: '0.5rem 1rem', borderRadius: '8px', 
                        border: '1px solid var(--accent-color)', background: 'transparent',
                        color: 'var(--accent-color)', fontWeight: 600, cursor: 'pointer'
                      }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px' }}>
              {t?.education_sec?.tutorProfile?.bookNow || "Book Masterclass"}
            </button>
          </div>
        </aside>

      </div>

      {/* 🚀 AI CHALLENGE MODAL */}
      {showAITrial && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="animate-fade-up" style={{ 
            backgroundColor: 'var(--surface-1)', padding: '3rem', borderRadius: '32px', 
            width: '95%', maxWidth: '650px', border: '1px solid var(--border-color)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            
            {/* Step 0: Idle/Intro */}
            {challengeState === 'idle' && (
              <div style={{ textAlign: 'center' }}>
                <Sparkles size={64} color="#facc15" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>{t.education_sec.tutorProfile.trialChallenge}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.15rem', lineHeight: 1.6 }}>
                  Generate 5 quick diagnostic questions for <b>{subjectList[0]}</b> level to let <b>{profile.name}</b> know your current level before booking!
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button onClick={startChallenge} className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                    {t.education_sec.tutorProfile.startChallenge}
                  </button>
                  <button onClick={() => setShowAITrial(false)} style={{ padding: '1rem 2.5rem', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                    {t.education_sec.tutorProfile.cancel}
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Loading */}
            {challengeState === 'loading' && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div className="loader" style={{ marginBottom: '2rem' }}>
                   <Sparkles size={48} className="animate-pulse" color="#facc15" style={{ margin: '0 auto' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.education_sec.tutorProfile.loadingChallenge}</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{t.education_sec.tutorProfile.analyzing.replace('{subject}', subjectList[0])}</p>
              </div>
            )}

            {/* Step 2: Active Challenge */}
            {challengeState === 'active' && questions.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-color)' }}>
                      {t.education_sec.tutorProfile.questionLabel} {currentStep + 1} {t.education_sec.tutorProfile.of} {questions.length}
                   </div>
                   <div style={{ width: '200px', height: '6px', backgroundColor: 'var(--surface-2)', borderRadius: '3px', position: 'relative' }}>
                      <div style={{ 
                        position: 'absolute', left: 0, top: 0, height: '100%', 
                        width: `${((currentStep + 1) / questions.length) * 100}%`, 
                        backgroundColor: 'var(--accent-color)', borderRadius: '3px',
                        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} />
                   </div>
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2rem', lineHeight: 1.4 }}>
                  {questions[currentStep].question}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {questions[currentStep].options.map((opt: string, idx: number) => {
                    const isSelected = selectedIdx === idx;
                    const isCorrect = questions[currentStep].correctIndex === idx;
                    const showResult = selectedIdx !== null;
                    
                    let bg = 'var(--surface-2)';
                    let border = '1px solid transparent';
                    if (showResult) {
                      if (isCorrect) {
                        bg = 'rgba(16, 185, 129, 0.1)';
                        border = '1px solid #facc15';
                      } else if (isSelected) {
                        bg = 'rgba(239, 68, 68, 0.1)';
                        border = '1px solid #ef4444';
                      }
                    } else if (isSelected) {
                      bg = 'rgba(99, 102, 241, 0.1)';
                      border = '1px solid var(--accent-color)';
                    }

                    return (
                      <button 
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={showResult}
                        style={{ 
                          padding: '1.25rem 1.5rem', borderRadius: '16px', textAlign: 'left',
                          backgroundColor: bg, border, cursor: showResult ? 'default' : 'pointer',
                          transition: 'all 0.2s', fontSize: '1.05rem', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: '1rem'
                        }}
                        className={showResult ? "" : "hover-lift"}
                      >
                         <div style={{ 
                           width: '28px', height: '28px', borderRadius: '50%', 
                           backgroundColor: isSelected ? 'white' : 'rgba(0,0,0,0.05)',
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           fontSize: '0.8rem', fontWeight: 900
                         }}>
                            {String.fromCharCode(65 + idx)}
                         </div>
                         {opt}
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <div className="animate-fade-up" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', marginBottom: '2rem', borderLeft: '4px solid #facc15' }}>
                     <h5 style={{ fontWeight: 800, marginBottom: '0.4rem', color: '#facc15' }}>{t.education_sec.tutorProfile.explanation}</h5>
                     <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {questions[currentStep].explanation}
                     </p>
                  </div>
                )}

                {selectedIdx !== null && (
                  <button onClick={nextQuestion} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                    {currentStep === questions.length - 1 ? t.education_sec.tutorProfile.finishChallenge : t.education_sec.tutorProfile.nextQuestion}
                  </button>
                )}
              </div>
            )}

            {/* Step 3: Completed */}
            {challengeState === 'completed' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '100px', height: '100px', borderRadius: '50%', 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <UserCheck size={48} color="#facc15" />
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{t.education_sec.tutorProfile.scoreResult} {score} / {questions.length}</h2>
                <div style={{ fontSize: '1.2rem', color: 'var(--accent-color)', fontWeight: 800, marginBottom: '2rem' }}>
                   {t.education_sec.tutorProfile.assessment} {score >= 4 ? t.education_sec.tutorProfile.assessmentLevels.excellent : score >= 2 ? t.education_sec.tutorProfile.assessmentLevels.progress : t.education_sec.tutorProfile.assessmentLevels.starting}
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
                   {t.education_sec.tutorProfile.assessmentDesc}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button onClick={() => setShowAITrial(false)} className="btn btn-primary" style={{ padding: '1rem 3rem' }}>
                    {t.education_sec.tutorProfile.bookFirstLesson}
                  </button>
                  <button onClick={() => setChallengeState('idle')} style={{ padding: '1rem 2rem', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                    {t.education_sec.tutorProfile.tryAgain}
                  </button>
                </div>
              </div>
            )}

            {/* 🛡️ login-required State: 專業登入引導面板 */}
            {challengeState === 'login-required' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', 
                  backgroundColor: 'rgba(99, 102, 241, 0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <Lock size={40} color="var(--accent-color)" />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>{t?.education_sec?.tutorProfile?.authPanel?.title || "Member-Only Feature"}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {t?.education_sec?.tutorProfile?.authPanel?.desc || "The AI Diagnostic Trial is an exclusive service for ConciergeAI members. Please log in to your account so we can record and analyze your learning progress."}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                   <button onClick={() => setShowAITrial(false)} style={{ padding: '1rem 2rem', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                    {t?.education_sec?.tutorProfile?.authPanel?.dismiss || "Maybe Later"}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {challengeState === 'error' && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Oops! Something went wrong.</h3>
                <p style={{ marginBottom: '2rem' }}>AI tutor is briefly unavailable. Please check your connection and try again.</p>
                <button onClick={startChallenge} className="btn btn-primary">Try Again</button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
