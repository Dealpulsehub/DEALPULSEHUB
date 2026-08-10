/**
 * @task-orchestrator - Gestor Central de Tareas (FASE 2, Día 3)
 *
 * Responsabilidades:
 * - Asignar tareas a agentes especializados
 * - Priorizar tareas por deadline
 * - Rastear progreso en tiempo real
 * - Escalamiento automático por timeout
 * - Gestión de reintentos
 */

const { v4: uuidv4 } = require('uuid');

// ============================================================================
// TIPOS Y CONFIGURACIÓN
// ============================================================================

const TASK_TYPES = {
  AUDIT: 'audit',
  PROPOSAL: 'proposal',
  LANDING: 'landing',
  VALIDATE: 'validate',
  DEPLOY: 'deploy'
};

const TASK_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  ESCALATED: 'escalated'
};

const PRIORITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

const PRIORITY_VALUES = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3
};

const TASK_TIMEOUT_MS = 300000; // 5 minutos
const MAX_RETRIES = 3;

// ============================================================================
// AGENTES ESPECIALIZADOS
// ============================================================================

const AGENT_ASSIGNMENTS = {
  [TASK_TYPES.AUDIT]: {
    primary: '@qa-auditor',
    backup: '@quality-gate',
    timeout: 60000, // 1 minuto
    critical: true
  },
  [TASK_TYPES.PROPOSAL]: {
    primary: '@proposal-generator',
    backup: '@pm',
    timeout: 120000, // 2 minutos
    critical: true
  },
  [TASK_TYPES.LANDING]: {
    primary: '@landing-generator',
    backup: '@cxo',
    timeout: 90000, // 1.5 minutos
    critical: true
  },
  [TASK_TYPES.VALIDATE]: {
    primary: '@quality-gate',
    backup: '@qa',
    timeout: 30000, // 30 segundos
    critical: false
  },
  [TASK_TYPES.DEPLOY]: {
    primary: '@devops',
    backup: '@architect',
    timeout: 180000, // 3 minutos
    critical: true
  }
};

// ============================================================================
// TASK ORCHESTRATOR CLASS
// ============================================================================

class TaskOrchestrator {
  constructor() {
    this.taskQueue = new Map();           // Tareas en espera
    this.runningTasks = new Map();        // Tareas en ejecución
    this.completedTasks = new Map();      // Tareas completadas
    this.failedTasks = new Map();         // Tareas fallidas
    this.escalatedTasks = new Map();      // Tareas escaladas
    this.taskAssignments = new Map();     // Tareas → Agentes
    this.agentWorkload = new Map();       // Carga de trabajo por agente
    this.timeoutCheckers = new Map();     // Timers de timeout

    this.log = {
      info: (msg) => console.log(`[🎯 ORCHESTRATOR] ${msg}`),
      warn: (msg) => console.warn(`[⚠️  ORCHESTRATOR] ${msg}`),
      error: (msg) => console.error(`[❌ ORCHESTRATOR] ${msg}`)
    };
  }

  // ==========================================================================
  // ENCOLAMIENTO DE TAREAS
  // ==========================================================================

  enqueueTask(taskData) {
    const task = {
      id: uuidv4(),
      type: taskData.type,
      priority: taskData.priority || PRIORITY_LEVELS.MEDIUM,
      status: TASK_STATUS.PENDING,
      payload: taskData.payload,
      createdAt: new Date(),
      attempts: 0,
      maxRetries: MAX_RETRIES,
      timeline: {
        createdAt: new Date(),
        assignedAt: null,
        startedAt: null,
        completedAt: null
      }
    };

    this.taskQueue.set(task.id, task);

    this.log.info(`📥 Tarea encolada: ${task.id} (${task.type}, ${task.priority})`);

    return task;
  }

  // ==========================================================================
  // ASIGNACIÓN AUTOMÁTICA DE TAREAS
  // ==========================================================================

  assignTask(taskId) {
    const task = this.taskQueue.get(taskId);

    if (!task) {
      this.log.error(`❌ Tarea no encontrada: ${taskId}`);
      return null;
    }

    // Obtener agente apropiado
    const agentConfig = AGENT_ASSIGNMENTS[task.type];
    if (!agentConfig) {
      this.log.error(`❌ Tipo de tarea no soportado: ${task.type}`);
      return null;
    }

    // Seleccionar agente (primario o backup según carga)
    const agent = this.selectAgent(agentConfig);

    // Asignar tarea
    task.status = TASK_STATUS.ASSIGNED;
    task.assignedAgent = agent;
    task.timeline.assignedAt = new Date();

    this.taskAssignments.set(taskId, agent);
    this.updateAgentWorkload(agent, 1);

    this.log.info(`✅ Tarea asignada: ${taskId} → ${agent}`);

    return {
      taskId: task.id,
      agent: agent,
      type: task.type,
      priority: task.priority
    };
  }

  selectAgent(agentConfig) {
    // Seleccionar agente con menor carga de trabajo
    const primaryWorkload = this.getAgentWorkload(agentConfig.primary) || 0;
    const backupWorkload = this.getAgentWorkload(agentConfig.backup) || 0;

    if (primaryWorkload <= backupWorkload) {
      return agentConfig.primary;
    } else {
      return agentConfig.backup;
    }
  }

  // ==========================================================================
  // EJECUCIÓN DE TAREAS
  // ==========================================================================

  startTask(taskId) {
    const task = this.taskQueue.get(taskId);

    if (!task) {
      this.log.error(`❌ Tarea no encontrada: ${taskId}`);
      return null;
    }

    if (task.status !== TASK_STATUS.ASSIGNED) {
      this.log.warn(`⚠️  Tarea no está asignada: ${taskId} (status: ${task.status})`);
      return null;
    }

    // Mover a ejecución
    task.status = TASK_STATUS.RUNNING;
    task.timeline.startedAt = new Date();
    task.attempts += 1;

    this.taskQueue.delete(taskId);
    this.runningTasks.set(taskId, task);

    // Configurar timeout
    this.setTaskTimeout(taskId, task);

    this.log.info(`▶️  Tarea iniciada: ${taskId} (intento ${task.attempts}/${task.maxRetries + 1})`);

    return {
      taskId: task.id,
      status: task.status,
      startedAt: task.timeline.startedAt,
      agent: task.assignedAgent
    };
  }

  setTaskTimeout(taskId, task) {
    const agentConfig = AGENT_ASSIGNMENTS[task.type];
    const timeout = agentConfig?.timeout || TASK_TIMEOUT_MS;

    const timeoutId = setTimeout(() => {
      this.handleTaskTimeout(taskId);
    }, timeout);

    this.timeoutCheckers.set(taskId, timeoutId);
  }

  handleTaskTimeout(taskId) {
    const task = this.runningTasks.get(taskId);

    if (!task) return;

    this.log.warn(`⏱️  Timeout en tarea: ${taskId}`);

    // Reintentar si hay intentos disponibles
    if (task.attempts < task.maxRetries + 1) {
      this.retryTask(taskId);
    } else {
      this.failTask(taskId, 'Timeout después de máximos reintentos');
    }
  }

  retryTask(taskId) {
    const task = this.runningTasks.get(taskId);

    if (!task) return;

    this.log.info(`🔄 Reintentando tarea: ${taskId} (intento ${task.attempts + 1})`);

    // Mover de vuelta a cola
    this.runningTasks.delete(taskId);
    task.status = TASK_STATUS.PENDING;
    this.taskQueue.set(taskId, task);

    // Limpiar timeout
    const timeoutId = this.timeoutCheckers.get(taskId);
    if (timeoutId) clearTimeout(timeoutId);
    this.timeoutCheckers.delete(taskId);

    // Reasignar
    this.assignTask(taskId);
  }

  // ==========================================================================
  // COMPLETACIÓN DE TAREAS
  // ==========================================================================

  completeTask(taskId, result = null) {
    const task = this.runningTasks.get(taskId);

    if (!task) {
      this.log.error(`❌ Tarea en ejecución no encontrada: ${taskId}`);
      return null;
    }

    task.status = TASK_STATUS.COMPLETED;
    task.timeline.completedAt = new Date();
    task.result = result;

    const duration = task.timeline.completedAt - task.timeline.startedAt;

    this.runningTasks.delete(taskId);
    this.completedTasks.set(taskId, task);

    // Limpiar timeout
    const timeoutId = this.timeoutCheckers.get(taskId);
    if (timeoutId) clearTimeout(timeoutId);
    this.timeoutCheckers.delete(taskId);

    // Actualizar carga de agente
    this.updateAgentWorkload(task.assignedAgent, -1);

    this.log.info(`✨ Tarea completada: ${taskId} en ${duration}ms`);

    return {
      taskId: task.id,
      status: task.status,
      completedAt: task.timeline.completedAt,
      duration: duration,
      result: result
    };
  }

  // ==========================================================================
  // MANEJO DE FALLOS
  // ==========================================================================

  failTask(taskId, error = null) {
    const task = this.runningTasks.get(taskId);

    if (!task) {
      this.log.error(`❌ Tarea no encontrada: ${taskId}`);
      return null;
    }

    task.status = TASK_STATUS.FAILED;
    task.timeline.failedAt = new Date();
    task.error = error;

    this.runningTasks.delete(taskId);
    this.failedTasks.set(taskId, task);

    // Limpiar timeout
    const timeoutId = this.timeoutCheckers.get(taskId);
    if (timeoutId) clearTimeout(timeoutId);
    this.timeoutCheckers.delete(taskId);

    // Actualizar carga de agente
    this.updateAgentWorkload(task.assignedAgent, -1);

    this.log.error(`❌ Tarea fallida: ${taskId} - ${error}`);

    return {
      taskId: task.id,
      status: task.status,
      failedAt: task.timeline.failedAt,
      error: error
    };
  }

  // ==========================================================================
  // ESCALAMIENTO
  // ==========================================================================

  escalateTask(taskId, reason = null) {
    const task = this.runningTasks.get(taskId) || this.taskQueue.get(taskId);

    if (!task) {
      this.log.error(`❌ Tarea no encontrada: ${taskId}`);
      return null;
    }

    task.status = TASK_STATUS.ESCALATED;
    task.escalationReason = reason;
    task.escalatedAt = new Date();

    if (this.runningTasks.has(taskId)) {
      this.runningTasks.delete(taskId);
    } else {
      this.taskQueue.delete(taskId);
    }

    this.escalatedTasks.set(taskId, task);

    this.log.warn(`🚨 Tarea escalada: ${taskId} - ${reason}`);

    return {
      taskId: task.id,
      status: task.status,
      escalationReason: reason,
      escalatedAt: task.escalatedAt
    };
  }

  // ==========================================================================
  // GESTIÓN DE CARGA DE AGENTES
  // ==========================================================================

  updateAgentWorkload(agent, delta) {
    const current = this.agentWorkload.get(agent) || 0;
    this.agentWorkload.set(agent, Math.max(0, current + delta));
  }

  getAgentWorkload(agent) {
    return this.agentWorkload.get(agent) || 0;
  }

  getAgentStats() {
    const stats = {};
    for (const [agent, workload] of this.agentWorkload) {
      stats[agent] = workload;
    }
    return stats;
  }

  // ==========================================================================
  // QUERY DE TAREAS
  // ==========================================================================

  getTask(taskId) {
    return (
      this.taskQueue.get(taskId) ||
      this.runningTasks.get(taskId) ||
      this.completedTasks.get(taskId) ||
      this.failedTasks.get(taskId) ||
      this.escalatedTasks.get(taskId)
    );
  }

  listTasks(status = null) {
    let tasks = [];

    if (!status || status === TASK_STATUS.PENDING) {
      tasks = tasks.concat(Array.from(this.taskQueue.values()));
    }
    if (!status || status === TASK_STATUS.RUNNING) {
      tasks = tasks.concat(Array.from(this.runningTasks.values()));
    }
    if (!status || status === TASK_STATUS.COMPLETED) {
      tasks = tasks.concat(Array.from(this.completedTasks.values()));
    }
    if (!status || status === TASK_STATUS.FAILED) {
      tasks = tasks.concat(Array.from(this.failedTasks.values()));
    }
    if (!status || status === TASK_STATUS.ESCALATED) {
      tasks = tasks.concat(Array.from(this.escalatedTasks.values()));
    }

    return tasks.sort((a, b) => {
      // Ordenar por prioridad
      return PRIORITY_VALUES[a.priority] - PRIORITY_VALUES[b.priority];
    });
  }

  // ==========================================================================
  // ESTADÍSTICAS
  // ==========================================================================

  getStats() {
    const stats = {
      timestamp: new Date().toISOString(),
      summary: {
        pending: this.taskQueue.size,
        running: this.runningTasks.size,
        completed: this.completedTasks.size,
        failed: this.failedTasks.size,
        escalated: this.escalatedTasks.size,
        total: this.taskQueue.size + this.runningTasks.size +
               this.completedTasks.size + this.failedTasks.size +
               this.escalatedTasks.size
      },
      agents: this.getAgentStats(),
      successRate: this.completedTasks.size > 0
        ? ((this.completedTasks.size /
           (this.completedTasks.size + this.failedTasks.size)) * 100).toFixed(2) + '%'
        : 'N/A'
    };

    return stats;
  }

  // ==========================================================================
  // LIMPIEZA
  // ==========================================================================

  cleanup() {
    // Limpiar todos los timeouts
    for (const [taskId, timeoutId] of this.timeoutCheckers) {
      clearTimeout(timeoutId);
    }
    this.timeoutCheckers.clear();

    this.log.info('🧹 Orchestrator limpiado');
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let orchestrator = null;

function getOrchestrator() {
  if (!orchestrator) {
    orchestrator = new TaskOrchestrator();
  }
  return orchestrator;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  TaskOrchestrator,
  getOrchestrator,
  TASK_TYPES,
  TASK_STATUS,
  PRIORITY_LEVELS,
  AGENT_ASSIGNMENTS
};
