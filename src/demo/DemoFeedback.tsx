import { useState } from 'react';
import { saveFeedback } from './demoState';

interface Props {
  name: string;
}

type Answer = string;

const QUESTIONS = [
  {
    id: 'q1',
    text: 'Yapacaklarını takip etmek için bir uygulama kullanıyor musun?',
    options: ['Evet', 'Hayır'],
  },
  {
    id: 'q2_yes',
    text: 'Kullandığın uygulamanın yerine Pomu\'yu dener miydin?',
    options: ['Evet', 'Belki', 'Sanmıyorum'],
    showIf: (a: Record<string, Answer>) => a['q1'] === 'Evet',
  },
  {
    id: 'q2_no',
    text: 'Bunu kullanır mıydın?',
    options: ['Evet', 'Belki', 'Sanmıyorum'],
    showIf: (a: Record<string, Answer>) => a['q1'] === 'Hayır',
  },
  {
    id: 'q3',
    text: 'Fikri beğendin mi?',
    options: ['Evet', 'Kararsızım', 'Hayır'],
  },
  {
    id: 'q4',
    text: 'Pomu\'nun zamanla seni daha iyi tanıması ilgini çeker mi?',
    sub: 'Gerçek uygulamada Pomu okuduğun kitapları, çalıştığın konuları ve tamamladığın işleri hatırlayabilir.',
    options: ['Evet', 'Belki', 'Hayır'],
  },
  {
    id: 'q5',
    text: 'Daha kişisel bir Pomu için ödeme yapar mıydın?',
    sub: 'Ücretli planda Pomu daha fazla etkileşim kurar, seni daha iyi hatırlar ve dış görünüşünü değiştirebilirsin.',
    options: ['Evet', 'Fiyata bağlı', 'Hayır'],
  },
];

export function DemoFeedback({ name }: Props) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [note, setNote] = useState('');
  const [responderName, setResponderName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const visibleQuestions = QUESTIONS.filter(q => !q.showIf || q.showIf(answers));

  function handleAnswer(id: string, value: string) {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }

  function handleSubmit() {
    saveFeedback({ answers, note, responderName, submittedAt: new Date().toISOString() });
    setSubmitted(true);
  }

  const allAnswered = visibleQuestions.every(q => answers[q.id]);

  if (submitted) {
    return (
      <div style={{
        fontFamily: "'Nunito', sans-serif",
        background: '#F6FBFA',
        minHeight: '100dvh', width: '390px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', textAlign: 'center', gap: 16,
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

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#F6FBFA',
      minHeight: '100dvh', width: '390px',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      <div style={{ padding: '56px 24px 24px' }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#264653', marginBottom: 8 }}>
          Birkaç kısa soru
        </div>
        <div style={{ fontSize: 14, color: '#8BADA8', fontWeight: 500, lineHeight: 1.6 }}>
          Cevapların fikri geliştirmem için yeterli. İstersen en sona adını da bırakabilirsin.
        </div>
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {visibleQuestions.map(q => (
          <div key={q.id}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#264653', marginBottom: q.sub ? 6 : 12, lineHeight: 1.4 }}>
              {q.text}
            </div>
            {q.sub && (
              <div style={{ fontSize: 13, color: '#8BADA8', fontWeight: 500, lineHeight: 1.5, marginBottom: 12 }}>
                {q.sub}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {q.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(q.id, opt)}
                  style={{
                    padding: '9px 18px', borderRadius: 20,
                    background: answers[q.id] === opt ? '#9FC9C3' : '#FFFFFF',
                    border: `1.5px solid ${answers[q.id] === opt ? '#9FC9C3' : '#E4EFED'}`,
                    cursor: 'pointer', fontSize: 14, fontWeight: 600,
                    color: answers[q.id] === opt ? '#264653' : '#8BADA8',
                    transition: 'all 0.15s',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Not alanı */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#8BADA8', marginBottom: 8 }}>
            İstersen kısa bir not bırak
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Aklına gelen ilk şey..."
            rows={3}
            style={{
              width: '100%', borderRadius: 14, padding: '12px 14px',
              border: '1.5px solid #E4EFED', background: '#FFFFFF',
              fontSize: 14, fontWeight: 500, color: '#264653',
              outline: 'none', resize: 'none', fontFamily: "'Nunito', sans-serif",
            }}
          />
        </div>

        {/* İsim */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#8BADA8', marginBottom: 8 }}>
            İstersen adını bırak
          </div>
          <input
            value={responderName}
            onChange={e => setResponderName(e.target.value)}
            placeholder="Adın"
            style={{
              width: '100%', borderRadius: 14, padding: '12px 14px',
              border: '1.5px solid #E4EFED', background: '#FFFFFF',
              fontSize: 14, fontWeight: 500, color: '#264653',
              outline: 'none', fontFamily: "'Nunito', sans-serif",
            }}
          />
        </div>

        {/* Gönder */}
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{
            width: '100%', padding: '16px 0', borderRadius: 16,
            background: allAnswered ? '#F6B089' : '#E4EFED',
            border: 'none', cursor: allAnswered ? 'pointer' : 'default',
            fontSize: 16, fontWeight: 700,
            color: allAnswered ? '#FFFFFF' : '#AABCB8',
            boxShadow: allAnswered ? '0 4px 14px rgba(246,176,137,0.3)' : 'none',
            transition: 'all 0.2s',
            marginBottom: 40,
          }}
        >
          Gönder
        </button>
      </div>
    </div>
  );
}
