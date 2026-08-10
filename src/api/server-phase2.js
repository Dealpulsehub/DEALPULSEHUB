/**
 * DealPulseHub - API REST v2 (FASE 2)
 * Integración de @task-orchestrator + @quality-gate
 *
 * ENDPOINTS NUEVOS:
 * POST /api/v2/orchestrate    - Crear y orquestar tarea
 * POST /api/v2/validate       - Validar output de tarea
 * GET  /api/v2/orchestration  - Estado de orquestación
 * GET  /api/v2/quality-stats  - Estadísticas de calidad
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar orquestadores
const { getOrchestrator, TASK_TYPES, PRIORITY_LEVELS } = require('../orchestration/task-orchestrator');
const { getQualityGate, QUALITY_VERDICT } = require('../quality/quality-gate');

// Crear app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Inicializar
const orchestrator = getOrchestrator();
const qualityGate = getQualityGate();

// Logger
const log = {
  info: (msg) => console.log(`[✅ API v2] ${msg}`),
  error: (msg) => console.error(`[❌ API v2] ${msg}`)
};

// ============================================================================
// RUTAS: ORQUESTACIÓN
// ============================================================================

// Crear tarea con orquestación automática
app.post('/api/v2/orchestrate', (req, res) => {
  const { type, priority, payload } = req.body;

  if (!type || !payload) {
    return res.status(400).json({
      error: 'Missing required fields: type, payload'
    });
  }

  try {
    // Encolar tarea
    const task = orchestrator.enqueueTask({
      type,
      priority: priority || PRIORITY_LEVELS.MEDIUM,
      payload
    });

    // Asignar automáticamente
    const assignment = orchestrator.assignTask(task.id);

    log.info(`📥➡️  Tarea orquestada: ${task.id} → ${assignment.agent}`);

    res.status(201).json({
      taskId: task.id,
      status: task.status,
      assignedAgent: assignment.agent,
      type: task.type,
      priority: task.priority,
      createdAt: task.timeline.createdAt
    });
  } catch (error) {
    log.error(`Error en orquestación: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar ejecución de tarea
app.post('/api/v2/tasks/:id/start', (req, res) => {
  try {
    const result = orchestrator.startTask(req.params.id);

    if (!result) {
      return res.status(400).json({ error: 'Cannot start task' });
    }

    log.info(`▶️  Tarea iniciada: ${req.params.id}`);

    res.status(200).json(result);
  } catch (error) {
    log.error(`Error al iniciar: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Completar tarea y validar
app.post('/api/v2/tasks/:id/complete', (req, res) => {
  const { output } = req.body;

  if (!output) {
    return res.status(400).json({ error: 'Missing output field' });
  }

  try {
    // Obtener tarea
    const task = orchestrator.getTask(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validar output automáticamente
    const validation = qualityGate.validateOutput(req.params.id, task.type, output);

    if (!validation) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    let completionResult;

    // Decidir basado en validación
    if (validation.verdict === QUALITY_VERDICT.APPROVED) {
      // Aprobar y completar
      completionResult = orchestrator.completeTask(req.params.id, {
        output: output,
        validation: validation,
        status: 'approved'
      });

      log.info(`✨✅ Tarea completada y validada: ${req.params.id}`);
    } else if (validation.verdict === QUALITY_VERDICT.REJECTED) {
      // Rechazar
      completionResult = orchestrator.failTask(req.params.id, 'Quality gate: RECHAZA');
      log.error(`❌ Tarea rechazada por quality gate: ${req.params.id}`);
    } else {
      // Condicional - completar pero marcar para retrabajo
      completionResult = orchestrator.completeTask(req.params.id, {
        output: output,
        validation: validation,
        status: 'conditional'
      });

      // Solicitar retrabajo
      qualityGate.requestRework(req.params.id, validation);
      log.info(`⚠️  Tarea completada pero requiere retrabajo: ${req.params.id}`);
    }

    res.status(200).json({
      taskId: req.params.id,
      completion: completionResult,
      validation: validation,
      nextAction: qualityGate.getNextAction(validation.verdict)
    });
  } catch (error) {
    log.error(`Error al completar: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Fallar tarea
app.post('/api/v2/tasks/:id/fail', (req, res) => {
  const { error } = req.body;

  try {
    const result = orchestrator.failTask(req.params.id, error || 'Unknown error');

    if (!result) {
      return res.status(400).json({ error: 'Cannot fail task' });
    }

    log.error(`❌ Tarea marcada como fallida: ${req.params.id}`);

    res.status(200).json(result);
  } catch (error) {
    log.error(`Error al fallar: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// RUTAS: ESTATUS Y ESTADÍSTICAS
// ============================================================================

// Estado de orquestación
app.get('/api/v2/orchestration', (req, res) => {
  try {
    const stats = orchestrator.getStats();
    res.status(200).json(stats);
  } catch (error) {
    log.error(`Error obteniendo stats: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Estadísticas de calidad
app.get('/api/v2/quality-stats', (req, res) => {
  try {
    const stats = qualityGate.getStats();
    res.status(200).json(stats);
  } catch (error) {
    log.error(`Error obteniendo quality stats: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Obtener tarea específica
app.get('/api/v2/tasks/:id', (req, res) => {
  try {
    const task = orchestrator.getTask(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const validation = qualityGate.getReport(req.params.id);

    res.status(200).json({
      task: task,
      validation: validation
    });
  } catch (error) {
    log.error(`Error obteniendo tarea: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Listar todas las tareas
app.get('/api/v2/tasks', (req, res) => {
  try {
    const { status } = req.query;
    const tasks = orchestrator.listTasks(status);

    res.status(200).json({
      count: tasks.length,
      tasks: tasks
    });
  } catch (error) {
    log.error(`Error listando tareas: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// RUTAS: DEMO Y TESTING
// ============================================================================

// Demo: crear tarea de prueba
app.post('/api/v2/demo/audit', (req, res) => {
  try {
    const task = orchestrator.enqueueTask({
      type: TASK_TYPES.AUDIT,
      priority: PRIORITY_LEVELS.HIGH,
      payload: {
        cliente: 'Demo Client',
        url: 'https://example.com',
        timestamp: new Date()
      }
    });

    const assignment = orchestrator.assignTask(task.id);

    res.status(201).json({
      message: 'Demo audit task created',
      taskId: task.id,
      agent: assignment.agent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Demo: validar output
app.post('/api/v2/demo/validate', (req, res) => {
  try {
    const output = {
      score: 82,
      issues: [
        { id: 1, severity: 'high', description: 'Falta CTA' }
      ],
      roiEstimate: 5000,
      recommendations: [
        'Agregar CTA más visible',
        'Mejorar contraste'
      ],
      frameworks: ['Brunson', 'Hormozi']
    };

    const validation = qualityGate.validateOutput('demo-123', TASK_TYPES.AUDIT, output);

    res.status(200).json(validation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// RUTA RAÍZ
// ============================================================================

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'DealPulseHub API v2.0 (FASE 2 - Orquestación)',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    features: [
      'Task Orchestration (@task-orchestrator)',
      'Quality Gate (@quality-gate)',
      'Automatic Agent Assignment',
      'Auto Validation & Feedback'
    ],
    endpoints: {
      orchestration: {
        create: 'POST /api/v2/orchestrate',
        start: 'POST /api/v2/tasks/:id/start',
        complete: 'POST /api/v2/tasks/:id/complete',
        fail: 'POST /api/v2/tasks/:id/fail',
        list: 'GET /api/v2/tasks',
        get: 'GET /api/v2/tasks/:id'
      },
      stats: {
        orchestration: 'GET /api/v2/orchestration',
        quality: 'GET /api/v2/quality-stats'
      },
      demo: {
        createAudit: 'POST /api/v2/demo/audit',
        validateOutput: 'POST /api/v2/demo/validate'
      }
    }
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🚀 DealPulseHub API v2.0 (FASE 2 - Orquestación)          ║
║  Listening on http://localhost:${PORT}                     ║
║  Endpoints:                                                 ║
║    POST /api/v2/orchestrate         - Crear tarea          ║
║    GET  /api/v2/orchestration       - Stats                ║
║    GET  /api/v2/quality-stats       - Quality stats        ║
║  Demo:                                                      ║
║    POST /api/v2/demo/audit          - Crear demo           ║
║    POST /api/v2/demo/validate       - Validar demo         ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
