interface Props {
  onStartFeedback: () => void;
  onSkip: () => void;
}

export function DemoTourEnd({ onStartFeedback, onSkip }: Props) {
  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#F6FBFA',
      minHeight: '100dvh', height: '100%', width: '390px',
      display: 'flex', flexDirection: 'column',
      padding: '0 24px',
    }}>
      <div style={{ flex: '0 0 80px' }} />

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <img src="/images/wawing.png" alt="Pomu"
          style={{ width: 110, height: 110, objectFit: 'contain' }} />
      </div>

      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#264653', margin: '0 0 12px', lineHeight: 1.2 }}>
          Kısaca Pomu
        </h1>
        <p style={{ fontSize: 15, color: '#5A8A84', fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
          Bu kısa tur ürünün nasıl hissettireceğini göstermek için hazırlandı.
        </p>
      </div>

      {/* Tek kart, sade */}
      <div style={{
        background: '#FFFFFF', borderRadius: 20,
        boxShadow: '0 1px 8px rgba(38,70,83,0.05)',
        padding: '22px 20px', marginBottom: 32,
      }}>
        <p style={{
          fontSize: 15, color: '#264653', fontWeight: 500,
          lineHeight: 1.75, margin: 0,
        }}>
          Pomu hedeflerine ulaşırken yalnız hissetmemen için tasarlandı. Hedeflerine ulaşman için seninle birlikte çalışan, sevimli bir çalışma arkadaşı. Odaklanman gerektiğinde Pomu da seninle birlikte masaya oturur ve işe koyulur. Zamanla adını, okuduğun kitapları ve verdiğin cevapları öğrenerek seni daha yakından tanır. İleride kendi hobileri, okuyacağı bir kütüphanesi ve anlatacak hikayeleri bile olacak. Sen işlerini hallederken onun da her gün nasıl geliştiğine şahit olacaksın.
        </p>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 48 }}>
        <button onClick={onStartFeedback} style={{
          width: '100%', padding: '16px 0', borderRadius: 16,
          background: '#F6B089', border: 'none', cursor: 'pointer',
          fontSize: 16, fontWeight: 700, color: '#FFFFFF',
          boxShadow: '0 4px 14px rgba(246,176,137,0.3)',
          fontFamily: "'Nunito', sans-serif",
        }}>
          Birkaç soru yanıtlamak ister misin?
        </button>
        <button onClick={onSkip} style={{
          width: '100%', padding: '14px 0', borderRadius: 16,
          background: 'transparent', border: '1.5px solid #E4EFED',
          cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#8BADA8',
          fontFamily: "'Nunito', sans-serif",
        }}>
          Geç
        </button>
      </div>
    </div>
  );
}
