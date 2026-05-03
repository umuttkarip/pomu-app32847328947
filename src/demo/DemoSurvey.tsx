import { useState } from 'react';
import { saveFeedback } from './demoState';

type Answer = string;

interface Question {
  id: string;
  text: string;
  sub?: string;
  options: string[];
  showIf?: (a: Record<string, Answer>) => boolean;
  followUp?: {
    condition: (val: string) => boolean;
    id: string;
    text: string;
    options: string[];
  };
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Yapacaklarını takip etmek için bir uygulama kullanıyor musun?',
    options: ['Evet', 'Hayır'],
  },
  {
    id: 'q2a',
    text: 'Kullandığın uygulamanın yerine Pomu\'yu dener miydin?',
    options: ['Evet', 'Belki', 'Sanmıyorum'],
    showIf: a => a['q1'] === 'Evet',
  },
  {
    id: 'q2b',
    text: 'Bunu kullanır mıydın?',
    options: ['Evet', 'Belki', 'Sanmıyorum'],
    showIf: a => a['q1'] === 'Hayır',
  },
  {
    id: 'q3',
    text: 'Fikri beğendin mi?',
    options: ['Evet', 'Kararsızım', 'Hayır'],
  },
  {
    id: 'q4',
    text: 'Pomu\'nun zamanla seni daha iyi tanıması ilgini çeker mi?',
    sub: 'Okuduğun kitapları, çalıştığın konuları, tamamladığın işleri hatırlayabilir.',
    options: ['Evet', 'Belki', 'Hayır'],
  },
  {
    id: 'q5',
    text: 'Daha kişisel bir Pomu için ödeme yapar mıydın?',
    sub: 'Ücretli planda Pomu daha fazla etkileşim kurar, seni daha iyi hatırlar.',
    options: ['Evet', 'Fiyata bağlı', 'Hayır'],
  },
];

const PRICE_OPTIONS = ['49,9 ₺ / ay', '99,9 ₺ / ay', '149,9 ₺ / ay'];

interface Props {
  name: string;
}

export function DemoSurvey({ name }: Props) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [priceAnswer, setPriceAnswer] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [note, setNote] = useState('');
  const [responderName, setResponderName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const visibleQuestions = QUESTIONS.filter(q => !q.showIf || q.showIf(answers));
  const totalSteps = visibleQuestions.length + 1; // +1 for note/name step

  // Fiyat sorusu göster?
  const showPriceQuestion = answers['q5'] === 'Evet' || answers['q5'] === 'Fiyata bağlı';

  // Gerçek adım sayısı
  const effectiveTotal = totalSteps + (showPriceQuestion ? 1 : 0);

  // Son adım mu?
  const isLastQuestion = currentIdx === visibleQuestions.length - 1;
  const isPriceStep = showPriceQuestion && currentIdx === visibleQuestions.length;
  const isNoteStep = currentIdx === visibleQuestions.length + (showPriceQuestion ? 1 : 0);

  const currentQuestion = !isPriceStep && !isNoteStep ? visibleQuestions[currentIdx] : null;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  function handleAnswer(val: string) {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
    // Otomatik ilerle
    setTimeout(() => {
      if (isLastQuestion && showPriceQuestion) {
        setCurrentIdx(visibleQuestions.length); // fiyat adımına
      } else if (isLastQuestion) {
        setCurrentIdx(visibleQuestions.length + (showPriceQuestion ? 1 : 0)); // not adımına
      } else {
        setCurrentIdx(prev => prev + 1);
      }
    }, 300);
  }

  function handlePriceAnswer(val: string) {
    setPriceAnswer(val);
    setTimeout(() => {
      setCurrentIdx(visibleQuestions.length + 1); // not adımına
    }, 300);
  }

  function buildMessage(): string {
    const displayName = responderName.trim() || 'anonim';
    const qMap: Record<string, string> = {
      q1:  'Uygulama kullanıyor mu',
      q2a: 'Pomu\'yu dener miydi',
      q2b: 'Kullanır mıydı',
      q3:  'Fikri beğendi mi',
      q4:  'Tanıması ilgisini çeker mi',
      q5:  'Ödeme yapar mıydı',
    };

    const parts: string[] = [`👤 ${displayName}`];
    for (const [id, label] of Object.entries(qMap)) {
      if (answers[id]) parts.push(`${label}: ${answers[id]}`);
    }
    if (priceAnswer) parts.push(`Fiyat: ${priceAnswer}`);
    if (note.trim()) parts.push(`Not: ${note.trim()}`);

    return parts.join(' | ');
  }

  async function sendToNtfy() {
    const message = buildMessage();
    try {
      await fetch('https://ntfy.sh/umutappl', {
        method: 'POST',
        body: message,
        headers: { 'Title': 'Pomu Demo Feedback' },
      });
    } catch {
      // Sessizce geç — kullanıcıya hata gösterme
    }
  }

  function handleSubmit() {
    const data = { answers, priceAnswer, note, responderName, submittedAt: new Date().toISOString() };
    saveFeedback(data);
    sendToNtfy();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{
        fontFamily: "'Nunito', sans-serif",
        background: '#F6FBFA',
        minHeight: '844px', width: '390px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', textAlign: 'center', gap: 20,
      }}>
        <img src="/images/jumping.png" alt="Pomu"
          style={{ width: 120, height: 120, objectFit: 'contain' }} />
        <div style={{ fontSize: 24, fontWeight: 800, color: '#264653' }}>Teşekkürler!</div>
        <div style={{ fontSize: 15, color: '#8BADA8', fontWeight: 500, lineHeight: 1.6 }}>
          Geri bildirimin Pomu'nun gelişimine katkı sağlayacak.
        </div>
      </div>
    );
  }

  const stepNum = currentIdx + 1;
  const stepLabel = `${stepNum} / ${effectiveTotal}`;

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#F6FBFA',
      minHeight: '844px', width: '390px',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ padding: '56px 24px 32px' }}>
        <div style={{ fontSize: 12, color: '#AABCB8', fontWeight: 600, marginBottom: 8, letterSpacing: '0.06em' }}>
          {stepLabel}
        </div>
        <div style={{ width: '100%', height: 3, background: '#E4EFED', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(stepNum / effectiveTotal) * 100}%`,
            background: '#9FC9C3', borderRadius: 2,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 24px' }}>

        {/* Normal soru */}
        {currentQuestion && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#264653', marginBottom: currentQuestion.sub ? 10 : 24, lineHeight: 1.3 }}>
              {currentQuestion.text}
            </div>
            {currentQuestion.sub && (
              <div style={{ fontSize: 13, color: '#8BADA8', fontWeight: 500, lineHeight: 1.6, marginBottom: 24 }}>
                {currentQuestion.sub}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentQuestion.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    padding: '16px 20px', borderRadius: 16, textAlign: 'left',
                    background: currentAnswer === opt ? '#EDF6F4' : '#FFFFFF',
                    border: `2px solid ${currentAnswer === opt ? '#9FC9C3' : '#E4EFED'}`,
                    cursor: 'pointer', fontSize: 15, fontWeight: 600,
                    color: currentAnswer === opt ? '#264653' : '#5A8A84',
                    transition: 'all 0.15s',
                    fontFamily: "'Nunito', sans-serif",
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${currentAnswer === opt ? '#9FC9C3' : '#C8DEDA'}`,
                    background: currentAnswer === opt ? '#9FC9C3' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {currentAnswer === opt && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fiyat sorusu */}
        {isPriceStep && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#264653', marginBottom: 10, lineHeight: 1.3 }}>
              Ne kadar ödemeye razı olurdun?
            </div>
            <div style={{ fontSize: 13, color: '#8BADA8', fontWeight: 500, lineHeight: 1.6, marginBottom: 24 }}>
              Aylık abonelik olarak düşün.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PRICE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => handlePriceAnswer(opt)}
                  style={{
                    padding: '16px 20px', borderRadius: 16, textAlign: 'left',
                    background: priceAnswer === opt ? '#EDF6F4' : '#FFFFFF',
                    border: `2px solid ${priceAnswer === opt ? '#9FC9C3' : '#E4EFED'}`,
                    cursor: 'pointer', fontSize: 15, fontWeight: 600,
                    color: priceAnswer === opt ? '#264653' : '#5A8A84',
                    transition: 'all 0.15s',
                    fontFamily: "'Nunito', sans-serif",
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${priceAnswer === opt ? '#9FC9C3' : '#C8DEDA'}`,
                    background: priceAnswer === opt ? '#9FC9C3' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {priceAnswer === opt && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Not + isim adımı */}
        {isNoteStep && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#264653', marginBottom: 8, lineHeight: 1.3 }}>
              Son olarak
            </div>
            <div style={{ fontSize: 14, color: '#8BADA8', fontWeight: 500, lineHeight: 1.6, marginBottom: 24 }}>
              İstersen kısa bir not bırakabilir, adını da ekleyebilirsin. İkisi de zorunlu değil.
            </div>

            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Aklına gelen bir şey... (opsiyonel)"
              rows={4}
              style={{
                width: '100%', borderRadius: 14, padding: '14px 16px',
                border: '1.5px solid #E4EFED', background: '#FFFFFF',
                fontSize: 14, fontWeight: 500, color: '#264653',
                outline: 'none', resize: 'none',
                fontFamily: "'Nunito', sans-serif",
                marginBottom: 14,
              }}
            />

            <input
              value={responderName}
              onChange={e => setResponderName(e.target.value)}
              placeholder="Adın (opsiyonel)"
              style={{
                width: '100%', borderRadius: 14, padding: '14px 16px',
                border: '1.5px solid #E4EFED', background: '#FFFFFF',
                fontSize: 14, fontWeight: 500, color: '#264653',
                outline: 'none', fontFamily: "'Nunito', sans-serif",
                marginBottom: 24,
              }}
            />

            <button onClick={handleSubmit} style={{
              width: '100%', padding: '16px 0', borderRadius: 16,
              background: '#F6B089', border: 'none', cursor: 'pointer',
              fontSize: 16, fontWeight: 700, color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(246,176,137,0.3)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Gönder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
