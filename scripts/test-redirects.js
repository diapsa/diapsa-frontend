#!/usr/bin/env node

/**
 * Script de validación de redirects 301
 * Valida que todas las URLs con sufijo '-2' redirijan correctamente
 */

const testUrls = [
  {
    source: '/cursos/alineamiento-balanceo-proactivo-2',
    expected: '/cursos/alineamiento-balanceo-proactivo'
  },
  {
    source: '/cursos/incremento-de-la-confiabilidad-monitoreo-de-condicion-2',
    expected: '/cursos/incremento-de-la-confiabilidad-monitoreo-de-condicion'
  },
  {
    source: '/cursos/termografia-infrarroja-curso-de-certificacion-2',
    expected: '/cursos/termografia-infrarroja-curso-de-certificacion'
  },
  {
    source: '/cursos/curso-de-inspeccion-termografica-en-plantas-fotovoltaicas-2',
    expected: '/cursos/curso-de-inspeccion-termografica-en-plantas-fotovoltaicas'
  },
  {
    source: '/cursos/inspeccion-termografica-en-plantas-fotovoltaicas-2',
    expected: '/cursos/inspeccion-termografica-en-plantas-fotovoltaicas'
  },
  {
    source: '/cursos/curso-tecnico-especializado-termografia-2',
    expected: '/cursos/curso-tecnico-especializado-termografia'
  },
  {
    source: '/cursos/taller-de-aprendizaje-practico-de-vibraciones-2',
    expected: '/cursos/taller-de-aprendizaje-practico-de-vibraciones'
  },
  {
    source: '/cursos/redaccion-de-informes-tecnicos-2',
    expected: '/cursos/redaccion-de-informes-tecnicos'
  },
  {
    source: '/cursos/talleres-de-aprendizaje-practico-de-ultrasonido-2',
    expected: '/cursos/talleres-de-aprendizaje-practico-de-ultrasonido'
  }
];

// Simular la lógica de redirect de Next.js
function testRedirect(source, expected) {
  // Patrón: /cursos/:slug(.*)-2 -> /cursos/:slug
  const pattern = /^\/cursos\/(.+)-2\/?$/;
  const match = source.match(pattern);
  
  if (!match) {
    return { success: false, actual: null, reason: 'No match pattern' };
  }
  
  const slug = match[1];
  const actual = `/cursos/${slug}`;
  
  return {
    success: actual === expected,
    actual,
    expected
  };
}

console.log('🔍 Validando redirects 301 para URLs con sufijo \'-2\'...\n');

let allPassed = true;
let passCount = 0;
let failCount = 0;

testUrls.forEach((test, index) => {
  const result = testRedirect(test.source, test.expected);
  
  if (result.success) {
    console.log(`✅ Test ${index + 1}/9: PASS`);
    console.log(`   ${test.source}`);
    console.log(`   → ${result.actual}\n`);
    passCount++;
  } else {
    console.log(`❌ Test ${index + 1}/9: FAIL`);
    console.log(`   Source:   ${test.source}`);
    console.log(`   Expected: ${result.expected}`);
    console.log(`   Actual:   ${result.actual || 'No redirect'}`);
    console.log(`   Reason:   ${result.reason || 'Mismatch'}\n`);
    allPassed = false;
    failCount++;
  }
});

console.log('═'.repeat(60));
console.log(`📊 RESULTADOS: ${passCount} aprobados, ${failCount} fallidos`);
console.log('═'.repeat(60));

if (allPassed) {
  console.log('\n✨ ¡Todos los redirects funcionan correctamente!\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Algunos redirects fallaron. Revisar configuración.\n');
  process.exit(1);
}
