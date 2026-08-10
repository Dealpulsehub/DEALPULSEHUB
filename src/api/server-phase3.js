/**
 * DealPulseHub - API REST v3 (FASE 3)
 * Integración de @metrics-monitor + @decision-auditor
 *
 * ENDPOINTS NUEVOS:
 * GET  /api/v3/metrics          - KPIs en tiempo real
 * GET  /api/v3/dashboard        - Dashboard data
 * GET  /api/v3/alerts           - Alertas activas
 * GET  /api/v3/audit-trail/:id  - Trail de entidad
 * GET  /api/v3/compliance       - Reporte de compliance
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar agentes de FASE 2 y 3
const { getOrchestrator, TASK_TYPES } = require('../orchestration/task-orchestrator');
const { getQualityGate } = require('../quality/quality-gate');
const { getMetricsMonitor } = require('../metrics/metrics-monitor');
const { getDecisionAuditor } = require('../audit/decision-auditor');

// Crear app
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(cors());

// Inicializar
const orchestrator = getOrchestrator();
const qualityGate = getQualityGate();
const metricsMonitor = getMetricsMonitor();
const decisionAuditor = getDecisionAuditor();

// Logger
const log = {
  info: (msg) => console.log(`[✅ API v3] ${msg}`),
  error: (msg) => console.error(`[❌ API v3] ${msg}`)
};

// ============================================================================
// RUTAS: MÉTRICAS
// ============================================================================

app.get('/api/v3/metrics', (req, res) => {
  try {
    const kpis = metricsMonitor.getKPIs();

    res.status(200).json({
      timestamp: new Date().toISOString(),
      kpis: kpis
    });
  } catch (error) {
    log.error(`Error obteniendo métricas: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Dashboard data completo
app.get('/api/v3/dashboard', (req, res) => {
  try {
    const dashboardData = metricsMonitor.getDashboardData();

    res.status(200).json(dashboardData);
  } catch (error) {
    log.error(`Error obteniendo dashboard: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Alertas activas
app.get('/api/v3/alerts', (req, res) => {
  try {
    const alerts = metricsMonitor.getActiveAlerts();

    res.status(200).json({
      count: alerts.length,
      alerts: alerts
    });
  } catch (error) {
    log.error(`Error obteniendo alertas: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Resolver alerta
app.post('/api/v3/alerts/:id/resolve', (req, res) => {
  try {
    const alert = metricsMonitor.resolveAlert(req.params.id);

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.status(200).json(alert);
  } catch (error) {
    log.error(`Error resolviendo alerta: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// RUTAS: AUDITORÍA
// ============================================================================

// Trail de auditoría de entidad
app.get('/api/v3/audit-trail/:entityId', (req, res) => {
  try {
    const trail = decisionAuditor.getTrailReport(req.params.entityId);

    res.status(200).json(trail);
  } catch (error) {
    log.error(`Error obteniendo trail: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Audit log con filtros
app.get('/api/v3/audit-log', (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      actor: req.query.actor,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const auditLog = decisionAuditor.getAuditLog(filters);

    res.status(200).json(auditLog);
  } catch (error) {
    log.error(`Error obteniendo audit log: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Verificar integridad
app.get('/api/v3/audit/integrity', (req, res) => {
  try {
    const isValid = decisionAuditor.verifyIntegrity();

    res.status(200).json({
      timestamp: new Date().toISOString(),
      integrity: isValid,
      totalDecisions: decisionAuditor.decisions.length
    });
  } catch (error) {
    log.error(`Error verificando integridad: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// RUTAS: COMPLIANCE
// ============================================================================

// Compliance de entidad específica
app.get('/api/v3/compliance/:entityId', (req, res) => {
  try {
    const compliance = decisionAuditor.checkCompliance(req.params.entityId);

    res.status(200).json(compliance);
  } catch (error) {
    log.error(`Error verificando compliance: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Reporte de compliance general
app.get('/api/v3/compliance-report', (req, res) => {
  try {
    const report = decisionAuditor.getComplianceReport();

    res.status(200).json(report);
  } catch (error) {
    log.error(`Error obteniendo compliance report: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// RUTAS: ESTADÍSTICAS DE AUDITORÍA
// ============================================================================

app.get('/api/v3/audit-stats', (req, res) => {
  try {
    const stats = decisionAuditor.getStatistics();

    res.status(200).json(stats);
  } catch (error) {
    log.error(`Error obteniendo audit stats: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// RUTAS: DEMOSTRACIÓN
// ============================================================================

// Demo: Simular flujo completo
app.post('/api/v3/demo/flow', (req, res) => {
  try {
    // Crear tarea
    const task = orchestrator.enqueueTask({
      type: TASK_TYPES.AUDIT,
      priority: 'high',
      payload: { cliente: 'Demo' }
    });

    // Registrar en auditoría
    decisionAuditor.recordTaskCreated(task.id, '@system', TASK_TYPES.AUDIT, 'high');

    // Asignar
    const assignment = orchestrator.assignTask(task.id);
    decisionAuditor.recordTaskAssigned(task.id, '@system', assignment.agent);

    // Iniciar
    const start = orchestrator.startTask(task.id);
    decisionAuditor.recordTaskStarted(task.id, '@system', assignment.agent);

    // Registrar métrica
    metricsMonitor.recordTaskStarted(task.id, assignment.agent);

    // Simular completion con validación
    const output = {
      score: 90,
      issues: [],
      roiEstimate: 20000,
      recommendations: [],
      frameworks: ['Brunson']
    };

    const validation = qualityGate.validateOutput(task.id, TASK_TYPES.AUDIT, output);
    decisionAuditor.recordValidation(task.id, '@system', validation.verdict, validation.score);

    // Completar
    orchestrator.completeTask(task.id, output);
    metricsMonitor.recordTaskCompleted(task.id, 50);
    decisionAuditor.recordTaskCompleted(task.id, '@system', 50);

    // Registrar validación en métricas
    metricsMonitor.recordValidation(task.id, validation.verdict, validation.score);

    res.status(200).json({
      message: 'Demo flow completed',
      taskId: task.id,
      trail: decisionAuditor.getEntityTrail(task.id)
    });
  } catch (error) {
    log.error(`Error en demo: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// RUTA RAÍZ
// ============================================================================

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'DealPulseHub API v3.0 (FASE 3 - Observabilidad)',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    features: [
      'Task Orchestration (@task-orchestrator)',
      'Quality Gate (@quality-gate)',
      'Metrics Monitoring (@metrics-monitor)',
      'Decision Auditing (@decision-auditor)',
      'Real-time Dashboards',
      'Compliance Checking',
      'Immutable Audit Trail'
    ],
    endpoints: {
      metrics: {
        kpis: 'GET /api/v3/metrics',
        dashboard: 'GET /api/v3/dashboard',
        alerts: 'GET /api/v3/alerts',
        resolveAlert: 'POST /api/v3/alerts/:id/resolve'
      },
      audit: {
        trail: 'GET /api/v3/audit-trail/:entityId',
        auditLog: 'GET /api/v3/audit-log',
        integrity: 'GET /api/v3/audit/integrity',
        statistics: 'GET /api/v3/audit-stats'
      },
      compliance: {
        entity: 'GET /api/v3/compliance/:entityId',
        report: 'GET /api/v3/compliance-report'
      },
      demo: {
        flow: 'POST /api/v3/demo/flow'
      }
    }
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🚀 DealPulseHub API v3.0 (FASE 3 - Observabilidad)        ║
║  Listening on http://localhost:${PORT}                     ║
║  Endpoints:                                                 ║
║    GET  /api/v3/metrics                 - KPIs             ║
║    GET  /api/v3/dashboard               - Dashboard        ║
║    GET  /api/v3/alerts                  - Alertas          ║
║    GET  /api/v3/audit-trail/:id         - Trail            ║
║    GET  /api/v3/compliance-report       - Compliance       ║
║  Demo:                                                      ║
║    POST /api/v3/demo/flow               - Full flow        ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
