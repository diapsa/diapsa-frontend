/**
 * Script de prueba para verificar que los casos de éxito
 * devuelven 404 en lugar de 5xx cuando no existen
 */

const slugsToTest = [
  'tla-monitoreo-integral-condicion',
  'keken-mantenimiento-predictivo-termografia',
  'diapsa-start-mitinfra',
  'monitoreo-predictivo-en-central-de-ciclo-combinado'
];

async function testSlug(slug) {
  const url = `http://localhost:3000/casos-exito/${slug}`;
  
  try {
    const response = await fetch(url);
    console.log(`\n✓ ${slug}`);
    console.log(`  Status: ${response.status} ${response.statusText}`);
    
    if (response.status >= 500) {
      console.log(`  ❌ ERROR: Devuelve 5xx (debería ser 404)`);
      return false;
    } else if (response.status === 404) {
      console.log(`  ✓ Correcto: Devuelve 404`);
      return true;
    } else if (response.status === 200) {
      console.log(`  ✓ Existe en el CMS`);
      return true;
    }
  } catch (error) {
    console.log(`\n✗ ${slug}`);
    console.log(`  Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Testing Casos de Éxito - Error 5xx Fix');
  console.log('='.repeat(60));
  console.log('\nNOTA: Asegúrate de que el servidor dev esté corriendo en http://localhost:3000');
  console.log('      npm run dev\n');
  
  const results = [];
  for (const slug of slugsToTest) {
    const result = await testSlug(slug);
    results.push({ slug, passed: result });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('RESUMEN');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log(`\n✓ Pasaron: ${passed}/${results.length}`);
  console.log(`✗ Fallaron: ${failed}/${results.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 ¡Todas las pruebas pasaron! Ya no hay errores 5xx.');
  } else {
    console.log('\n⚠️  Algunos tests fallaron. Revisar logs arriba.');
    process.exit(1);
  }
}

main();
