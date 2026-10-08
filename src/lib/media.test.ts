import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validarMedio, enlaceWhatsapp, avisosUrgentes, oportunidadVigente } from './media';

describe('Medios y prioridades', () => {
  it('permite fotos y videos', () => {
    assert.equal(validarMedio({ size: 100, type: 'image/jpeg' }), null);
    assert.equal(validarMedio({ size: 100, type: 'video/mp4' }), null);
    assert.equal(validarMedio({ size: 100, type: 'video/webm' }), null);
    assert.ok(validarMedio({ size: 100, type: 'text/html' }));
  });
  it('limita cada archivo a 50 MB', () => {
    assert.equal(validarMedio({size: 50 * 1024 * 1024, type:'video/mp4'}), null);
    assert.ok(validarMedio({size: 50 * 1024 * 1024 + 1, type:'video/mp4'}));
  });
  it('la urgencia máxima incluye solo avisos publicados', () => {
    assert.deepEqual(avisosUrgentes([{id:1,urgente:true,estado:'publicado'},{id:2,urgente:true,estado:'borrador'},{id:3,urgente:false,estado:'publicado'}]).map(a=>a.id),[1]);
  });
  it('el acceso de difusión abre solo WhatsApp seguro', () => {
    assert.equal(enlaceWhatsapp('https://chat.whatsapp.com/mi-grupo'),'https://chat.whatsapp.com/mi-grupo');
    assert.equal(enlaceWhatsapp('javascript:alert(1)'),null);
    assert.equal(enlaceWhatsapp('https://whatsapp.com.ejemplo.com/'),null);
  });
  it('las vacantes se muestran hasta su fecha de cierre inclusive', () => {
    assert.equal(oportunidadVigente('2026-10-07','2026-10-07'),true);
    assert.equal(oportunidadVigente('2026-10-06','2026-10-07'),false);
    assert.equal(oportunidadVigente(null,'2026-10-07'),true);
  });
});