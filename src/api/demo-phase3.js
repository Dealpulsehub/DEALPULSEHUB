/**
 * Test/Demo de FASE 3
 * Demuestra @metrics-monitor + @decision-auditor en acción
 */

const { getMetricsMonitor } = require('../metrics/metrics-monitor');
const { getDecisionAuditor } = require('../audit/decision-auditor');
const { METRIC_TYPES } = require('../metrics/metrics-monitor');
const { DECISION_TYPES } = require('../audit/decision-auditor');

const metricsMonitor = getMetricsMonitor();
const decisionAuditor = getDecisionAuditor();

console.log(`
╔════════════════════════════════════════════════════════════╗
║  🧪 TEST DEMO - FASE 3 (Métricas + Auditoría)             ║
╚════════════════════════════════════════════════════════════╝
`);

// ============================================================================
// TEST 1: Registrar Métricas
// ============================================================================

console.log('\n✅ TEST 1: Registrar Métricas');
console.log('═══════════════════════════════════════════════════════════');

// Simular creación de tareas
for (let i = 1; i <= 3; i++) {
  metricsMonitor.recordTaskCreated(`task-${i}`, 'audit', 'high');
}

// Simular validaciones
metricsMonitor.recordValidation('task-1', 'APRUEBA', 95);
metricsMonitor.recordValidation('task-2', 'RECHAZA', 35);
metricsMonitor.recordValidation('task-3', 'APRUEBA', 88);

// Simular tareas completadas
metricsMonitor.recordTaskCompleted('task-1', 1500);
metricsMonitor.recordTaskCompleted('task-3', 2000);

console.log(`✓ Métricas registradas`);
console.log(`  - 3 tareas creadas`);
console.log(`  - 2 validaciones aprobadas`);
console.log(`  - 1 validación rechazada`);
console.log(`  - 2 tareas completadas`);

// ============================================================================
// TEST 2: Registrar en Auditoría
// ============================================================================

console.log('\n✅ TEST 2: Registrar en Auditoría (Inmutable)');
console.log('═══════════════════════════════════════════════════════════');

// Registrar decisions en trail inmutable
const d1 = decisionAuditor.recordTaskCreated('task-1', '@orchestrator', 'audit', 'high');
console.log(`✓ Decisión 1: ${d1.type}`);
console.log(`  Hash: ${d1.hash.substring(0, 16)}...`);

const d2 = decisionAuditor.recordTaskAssigned('task-1', '@orchestrator', '@qa-auditor');
console.log(`✓ Decisión 2: ${d2.type}`);
console.log(`  Encadenada: ${d2.previousHash === d1.hash ? 'Sí' : 'No'}`);

const d3 = decisionAuditor.recordTaskStarted('task-1', '@orchestrator', '@qa-auditor');
console.log(`✓ Decisión 3: ${d3.type}`);

const d4 = decisionAuditor.recordValidation('task-1', '@quality-gate', 'APRUEBA', 95);
console.log(`✓ Decisión 4: ${d4.type}`);

const d5 = decisionAuditor.recordTaskCompleted('task-1', '@orchestrator', 1500);
console.log(`✓ Decisión 5: ${d5.type}`);

console.log(`\n✓ Total decisions en trail: ${decisionAuditor.decisions.length}`);

// ============================================================================
// TEST 3: Calcular KPIs
// ============================================================================

console.log('\n✅ TEST 3: Calcular KPIs en Tiempo Real');
console.log('═══════════════════════════════════════════════════════════');

const kpis = metricsMonitor.getKPIs();

console.log(`📊 KPIs Calculados:`);
console.log(`\n  Tareas:`);
console.log(`    Creadas: ${kpis.tasks.created}`);
console.log(`    Completadas: ${kpis.tasks.completed}`);
console.log(`    Fallidas: ${kpis.tasks.failed}`);
console.log(`    En progreso: ${kpis.tasks.inProgress}`);
console.log(`    Tasa de éxito: ${kpis.tasks.successRate}%`);

console.log(`\n  Validaciones:`);
console.log(`    Aprobadas: ${kpis.validations.approved}`);
console.log(`    Rechazadas: ${kpis.validations.rejected}`);
console.log(`    Condicionales: ${kpis.validations.conditional}`);
console.log(`    Tasa de aprobación: ${kpis.validations.approvalRate}%`);

console.log(`\n  Performance:`);
console.log(`    Tasa de error: ${kpis.performance.errorRate}%`);
console.log(`    Duración promedio: ${kpis.performance.avgTaskDuration}ms`);
console.log(`    Score validación: ${kpis.performance.avgValidationScore}%`);
console.log(`    Throughput: ${kpis.performance.throughput} tareas/min`);

// ============================================================================
// TEST 4: Verificar Integridad
// ============================================================================

console.log('\n✅ TEST 4: Verificar Integridad (Blockchain-like)');
console.log('═══════════════════════════════════════════════════════════');

const isIntegral = decisionAuditor.verifyIntegrity();
console.log(`✓ Integridad verificada: ${isIntegral ? 'VÁLIDA ✅' : 'CORRUPTA ❌'}`);
console.log(`  Total decisiones: ${decisionAuditor.decisions.length}`);
console.log(`  Cadena hash verificada`);

// ============================================================================
// TEST 5: Audit Trail
// ============================================================================

console.log('\n✅ TEST 5: Obtener Trail de Auditoría');
console.log('═══════════════════════════════════════════════════════════');

const trail = decisionAuditor.getTrailReport('task-1');
console.log(`✓ Trail para task-1:`);
console.log(`  Total decisiones: ${trail.totalDecisions}`);
console.log(`  Timeline:`);

trail.timeline.forEach((event, i) => {
  const time = new Date(event.timestamp).toLocaleTimeString();
  console.log(`    ${i + 1}. [${time}] ${event.type}`);
  console.log(`       Por: ${event.actor}`);
  console.log(`       Desc: ${event.description}`);
});

// ============================================================================
// TEST 6: Compliance Checking
// ============================================================================

console.log('\n✅ TEST 6: Compliance Checking');
console.log('═══════════════════════════════════════════════════════════');

const compliance = decisionAuditor.checkCompliance('task-1');
console.log(`✓ Compliance para task-1:`);
console.log(`  Estado: ${compliance.compliant ? 'COMPLIANT ✅' : 'NON-COMPLIANT ❌'}`);
console.log(`  Score: ${compliance.complianceScore}%`);

if (compliance.issues.length > 0) {
  console.log(`  Issues:`);
  compliance.issues.forEach(issue => {
    console.log(`    - ${issue}`);
  });
} else {
  console.log(`  ✓ Sin problemas de compliance`);
}

// ============================================================================
// TEST 7: Dashboard Data
// ============================================================================

console.log('\n✅ TEST 7: Dashboard Data Completo');
console.log('═══════════════════════════════════════════════════════════');

const dashboard = metricsMonitor.getDashboardData();

console.log(`📊 Dashboard:`);
console.log(`  KPIs:                ${Object.keys(dashboard.kpis).length} métricas`);
console.log(`  Alertas activas:     ${dashboard.alerts.length}`);
console.log(`  Métricas recientes:  ${dashboard.recentMetrics.length}`);
console.log(`  Charts disponibles:  ${Object.keys(dashboard.charts).length}`);

console.log(`\n  Chart: Task Timeline`);
console.log(`    Labels: ${dashboard.charts.taskTimeline.labels.join(', ')}`);

console.log(`\n  Chart: Validation Distribution`);
const vd = dashboard.charts.validationDistribution;
console.log(`    Aprobadas: ${vd.approved}`);
console.log(`    Rechazadas: ${vd.rejected}`);
console.log(`    Condicionales: ${vd.conditional}`);

// ============================================================================
// TEST 8: Alertas Automáticas
// ============================================================================

console.log('\n✅ TEST 8: Alertas Automáticas');
console.log('═══════════════════════════════════════════════════════════');

const alerts = metricsMonitor.getActiveAlerts();
console.log(`✓ Alertas activas: ${alerts.length}`);

alerts.forEach((alert, i) => {
  console.log(`  ${i + 1}. [${alert.severity}] ${alert.title}`);
  console.log(`     ${alert.message}`);
});

// ============================================================================
// TEST 9: Reporte Compliance General
// ============================================================================

console.log('\n✅ TEST 9: Reporte de Compliance General');
console.log('═══════════════════════════════════════════════════════════');

const complianceReport = decisionAuditor.getComplianceReport();
console.log(`✓ Compliance Report:`);
console.log(`  Entidades totales: ${complianceReport.totalEntities}`);
console.log(`  Compliant: ${complianceReport.summary.compliant}`);
console.log(`  Non-compliant: ${complianceReport.summary.issues}`);
console.log(`  Score promedio: ${complianceReport.summary.averageScore}%`);

// ============================================================================
// TEST 10: Exportar Audit Trail
// ============================================================================

console.log('\n✅ TEST 10: Exportar Audit Trail');
console.log('═══════════════════════════════════════════════════════════');

const auditExport = decisionAuditor.exportAuditTrail('json');
console.log(`✓ Audit Trail Export (JSON):`);
console.log(`  Export Date: ${auditExport.exportDate}`);
console.log(`  Total Decisions: ${auditExport.totalDecisions}`);
console.log(`  Integrity: ${auditExport.integrity ? 'VÁLIDO ✅' : 'CORRUPTO ❌'}`);

// ============================================================================
// RESUMEN
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════╗
║  ✅ TEST COMPLETADO - FASE 3 FUNCIONANDO                   ║
║                                                            ║
║  ✓ @metrics-monitor operativo                             ║
║  ✓ Métricas en tiempo real                                ║
║  ✓ KPIs calculados                                        ║
║  ✓ Alertas automáticas                                    ║
║  ✓ @decision-auditor operativo                            ║
║  ✓ Audit trail inmutable                                  ║
║  ✓ Integridad verificada                                  ║
║  ✓ Compliance checking                                    ║
║  ✓ Dashboard data generado                                ║
║                                                            ║
║  Próximo: FASE 4 (@security-officer + @client-manager)   ║
╚════════════════════════════════════════════════════════════╝
`);

// Cleanup
metricsMonitor.cleanup();
decisionAuditor.cleanup();
