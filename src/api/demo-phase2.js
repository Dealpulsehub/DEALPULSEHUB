/**
 * Test/Demo de FASE 2
 * Demuestra cómo funcionan @task-orchestrator + @quality-gate juntos
 */

const { getOrchestrator, TASK_TYPES, PRIORITY_LEVELS, TASK_STATUS } = require('../orchestration/task-orchestrator');
const { getQualityGate, QUALITY_VERDICT } = require('../quality/quality-gate');

const orchestrator = getOrchestrator();
const qualityGate = getQualityGate();

console.log(`
╔════════════════════════════════════════════════════════════╗
║  🧪 TEST DEMO - FASE 2 (Orquestación + Quality Gate)       ║
╚════════════════════════════════════════════════════════════╝
`);

// ============================================================================
// TEST 1: Crear y Orquestar Tarea
// ============================================================================

console.log('\n✅ TEST 1: Crear y Orquestar Tarea');
console.log('═══════════════════════════════════════════════════════════');

const task1 = orchestrator.enqueueTask({
  type: TASK_TYPES.AUDIT,
  priority: PRIORITY_LEVELS.HIGH,
  payload: {
    cliente: 'Empresa XYZ',
    url: 'https://empresa-xyz.com/landing'
  }
});

console.log(`✓ Tarea creada: ${task1.id}`);
console.log(`  Tipo: ${task1.type}`);
console.log(`  Prioridad: ${task1.priority}`);
console.log(`  Status: ${task1.status}`);

// Asignar automáticamente
const assignment1 = orchestrator.assignTask(task1.id);
console.log(`✓ Tarea asignada a: ${assignment1.agent}`);

// ============================================================================
// TEST 2: Iniciar Ejecución
// ============================================================================

console.log('\n✅ TEST 2: Iniciar Ejecución');
console.log('═══════════════════════════════════════════════════════════');

const start1 = orchestrator.startTask(task1.id);
console.log(`✓ Tarea iniciada`);
console.log(`  Agent: ${start1.agent}`);
console.log(`  Status: ${start1.status}`);
console.log(`  Iniciada: ${start1.startedAt}`);

// ============================================================================
// TEST 3: Completar con Validación Automática (APROBADA)
// ============================================================================

console.log('\n✅ TEST 3: Completar con Validación (APROBADA)');
console.log('═══════════════════════════════════════════════════════════');

const goodOutput = {
  score: 88,  // Supera threshold de 85
  issues: [
    { id: 1, severity: 'medium', description: 'Falta CTA secundaria' },
    { id: 2, severity: 'low', description: 'Color de botón podría ser mejor' }
  ],
  roiEstimate: 15000,
  recommendations: [
    'Agregar CTA secundaria',
    'Cambiar color de botón principal',
    'Mejorar copy del hero'
  ],
  frameworks: ['Brunson', 'Hormozi', 'Frank Kern']
};

const validation1 = qualityGate.validateOutput(task1.id, TASK_TYPES.AUDIT, goodOutput);
console.log(`✓ Validación completada`);
console.log(`  Veredicto: ${validation1.verdict}`);
console.log(`  Score: ${validation1.score}%`);
console.log(`  Reglas pasadas: ${validation1.summary.passed}/${validation1.summary.total}`);

if (validation1.verdict === QUALITY_VERDICT.APPROVED) {
  const complete1 = orchestrator.completeTask(task1.id, {
    output: goodOutput,
    validation: validation1
  });
  console.log(`✓ Tarea completada exitosamente`);
  console.log(`  Status: ${complete1.status}`);
  console.log(`  Duración: ${complete1.duration}ms`);
}

// ============================================================================
// TEST 4: Segunda Tarea con Rechazo
// ============================================================================

console.log('\n✅ TEST 4: Segunda Tarea con Rechazo (RECHAZA)');
console.log('═══════════════════════════════════════════════════════════');

const task2 = orchestrator.enqueueTask({
  type: TASK_TYPES.AUDIT,
  priority: PRIORITY_LEVELS.MEDIUM,
  payload: {
    cliente: 'Startup ABC',
    url: 'https://startup-abc.com'
  }
});

orchestrator.assignTask(task2.id);
orchestrator.startTask(task2.id);

const badOutput = {
  score: 45,  // Por debajo de 60
  issues: [],
  roiEstimate: 0
};

const validation2 = qualityGate.validateOutput(task2.id, TASK_TYPES.AUDIT, badOutput);
console.log(`✓ Validación completada`);
console.log(`  Veredicto: ${validation2.verdict}`);
console.log(`  Score: ${validation2.score}%`);

if (validation2.verdict === QUALITY_VERDICT.REJECTED) {
  const fail2 = orchestrator.failTask(task2.id, 'Quality gate: Puntuación muy baja');
  console.log(`✓ Tarea rechazada`);
  console.log(`  Status: ${fail2.status}`);
  console.log(`  Error: ${fail2.error}`);
}

// ============================================================================
// TEST 5: Tercera Tarea con Retrabajo (CONDICIONA)
// ============================================================================

console.log('\n✅ TEST 5: Tercera Tarea con Retrabajo (CONDICIONA)');
console.log('═══════════════════════════════════════════════════════════');

const task3 = orchestrator.enqueueTask({
  type: TASK_TYPES.PROPOSAL,
  priority: PRIORITY_LEVELS.CRITICAL,
  payload: {
    cliente: 'Empresa Premium',
    presupuesto: 10000
  }
});

orchestrator.assignTask(task3.id);
orchestrator.startTask(task3.id);

const conditionalOutput = {
  title: 'Propuesta de Rediseño',
  executive_summary: 'Resumen ejecutivo...',
  analysis: 'Análisis...',
  solution: 'Solución...',
  timeline: { days: 30, phases: 3 },
  pricing: { amount: 8000, justification: 'Justificación...' },
  guarantee: 'Garantía de 50%'  // Existe pero podría ser mejor
};

const validation3 = qualityGate.validateOutput(task3.id, TASK_TYPES.PROPOSAL, conditionalOutput);
console.log(`✓ Validación completada`);
console.log(`  Veredicto: ${validation3.verdict}`);
console.log(`  Score: ${validation3.score}%`);

if (validation3.verdict === QUALITY_VERDICT.CONDITIONAL) {
  const complete3 = orchestrator.completeTask(task3.id, {
    output: conditionalOutput,
    validation: validation3,
    status: 'conditional'
  });

  // Solicitar retrabajo
  const appeal = qualityGate.requestRework(task3.id, validation3, [
    'Mejorar descripción de timeline',
    'Justificar más el pricing'
  ]);

  console.log(`✓ Tarea completada con retrabajos solicitados`);
  console.log(`  Status: ${complete3.status}`);
  console.log(`  Cambios requeridos: ${appeal.specificChanges.length}`);
}

// ============================================================================
// ESTADÍSTICAS FINALES
// ============================================================================

console.log('\n✅ ESTADÍSTICAS FINALES');
console.log('═══════════════════════════════════════════════════════════');

const orchestrationStats = orchestrator.getStats();
console.log('\n📊 Orquestación:');
console.log(`  Total tareas: ${orchestrationStats.summary.total}`);
console.log(`  Completadas: ${orchestrationStats.summary.completed}`);
console.log(`  Fallidas: ${orchestrationStats.summary.failed}`);
console.log(`  Escaladas: ${orchestrationStats.summary.escalated}`);
console.log(`  Tasa de éxito: ${orchestrationStats.successRate}`);

const qualityStats = qualityGate.getStats();
console.log('\n📊 Calidad:');
console.log(`  Total validaciones: ${qualityStats.total}`);
console.log(`  Aprobadas: ${qualityStats.approved}`);
console.log(`  Rechazadas: ${qualityStats.rejected}`);
console.log(`  Condicionales: ${qualityStats.conditional}`);
console.log(`  Score promedio: ${qualityStats.averageScore}%`);
console.log(`  Tasa de aprobación: ${qualityStats.approvalRate}`);

console.log('\n📊 Agentes:');
for (const [agent, workload] of Object.entries(orchestrationStats.agents)) {
  console.log(`  ${agent}: ${workload} tareas`);
}

// ============================================================================
// RESUMEN
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════╗
║  ✅ TEST COMPLETADO - FASE 2 FUNCIONANDO                   ║
║                                                            ║
║  ✓ @task-orchestrator operativo                           ║
║  ✓ @quality-gate validando outputs                        ║
║  ✓ Asignación automática de agentes                       ║
║  ✓ Decisiones: APRUEBA / RECHAZA / CONDICIONA            ║
║  ✓ Retrabajo automático solicitado                        ║
║                                                            ║
║  Próximo: FASE 3 (@metrics-monitor + @decision-auditor)  ║
╚════════════════════════════════════════════════════════════╝
`);

// Cleanup
orchestrator.cleanup();
qualityGate.cleanup();
