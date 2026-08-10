/**
 * @decision-auditor - Auditoría de Decisiones (FASE 3, Día 7)
 *
 * Responsabilidades:
 * - Registrar todas las decisiones (append-only log)
 * - Inmutabilidad garantizada
 * - Trail completo de cambios
 * - Compliance checking
 * - Reportes de auditoría
 */

const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// ============================================================================
// TIPOS Y CONFIGURACIÓN
// ============================================================================

const DECISION_TYPES = {
  TASK_CREATED: 'task_created',
  TASK_ASSIGNED: 'task_assigned',
  TASK_STARTED: 'task_started',
  TASK_COMPLETED: 'task_completed',
  TASK_FAILED: 'task_failed',
  VALIDATION_APPROVED: 'validation_approved',
  VALIDATION_REJECTED: 'validation_rejected',
  VALIDATION_CONDITIONAL: 'validation_conditional',
  RETRABAJO_REQUESTED: 'retrabajo_requested',
  ALERT_CREATED: 'alert_created',
  ALERT_RESOLVED: 'alert_resolved'
};

// ============================================================================
// DECISION AUDITOR CLASS
// ============================================================================

class DecisionAuditor {
  constructor() {
    this.decisions = [];       // Append-only log inmutable
    this.entityTrails = new Map();  // Trail por entidad
    this.previousHash = null;  // Hash anterior para cadena

    this.log = {
      info: (msg) => console.log(`[📝 AUDITOR] ${msg}`),
      warn: (msg) => console.warn(`[⚠️  AUDITOR] ${msg}`),
      error: (msg) => console.error(`[❌ AUDITOR] ${msg}`)
    };
  }

  // ==========================================================================
  // REGISTRO INMUTABLE DE DECISIONES
  // ==========================================================================

  recordDecision(type, entityId, actor, description, metadata = {}) {
    // Crear decisión
    const decision = {
      id: uuidv4(),
      type,
      entityId,
      actor,
      description,
      metadata,
      timestamp: new Date().toISOString(),
      sequenceNumber: this.decisions.length + 1
    };

    // Calcular hash (para integridad)
    decision.hash = this.calculateHash(decision);

    // Vincular con decisión anterior
    if (this.previousHash) {
      decision.previousHash = this.previousHash;
    }

    this.previousHash = decision.hash;

    // Agregar a log
    this.decisions.push(decision);

    // Agregar a trail de entidad
    if (!this.entityTrails.has(entityId)) {
      this.entityTrails.set(entityId, []);
    }
    this.entityTrails.get(entityId).push(decision);

    this.log.info(`📝 ${type}: ${entityId} (por: ${actor})`);

    return decision;
  }

  // Métodos de conveniencia
  recordTaskCreated(taskId, actor, type, priority) {
    return this.recordDecision(
      DECISION_TYPES.TASK_CREATED,
      taskId,
      actor,
      `Tarea creada: ${type} (prioridad: ${priority})`,
      { type, priority }
    );
  }

  recordTaskAssigned(taskId, actor, agent) {
    return this.recordDecision(
      DECISION_TYPES.TASK_ASSIGNED,
      taskId,
      actor,
      `Tarea asignada a: ${agent}`,
      { agent }
    );
  }

  recordTaskStarted(taskId, actor, agent) {
    return this.recordDecision(
      DECISION_TYPES.TASK_STARTED,
      taskId,
      actor,
      `Tarea iniciada en: ${agent}`,
      { agent }
    );
  }

  recordTaskCompleted(taskId, actor, duration) {
    return this.recordDecision(
      DECISION_TYPES.TASK_COMPLETED,
      taskId,
      actor,
      `Tarea completada en: ${duration}ms`,
      { duration }
    );
  }

  recordTaskFailed(taskId, actor, error) {
    return this.recordDecision(
      DECISION_TYPES.TASK_FAILED,
      taskId,
      actor,
      `Tarea fallida: ${error}`,
      { error }
    );
  }

  recordValidation(taskId, actor, verdict, score) {
    // Normalizar veredicto
    const normalizedVerdict = verdict === 'APRUEBA' ? 'APPROVED' :
                             verdict === 'RECHAZA' ? 'REJECTED' :
                             verdict === 'CONDICIONA' ? 'CONDITIONAL' :
                             verdict.toUpperCase();

    return this.recordDecision(
      DECISION_TYPES[`VALIDATION_${normalizedVerdict}`],
      taskId,
      actor,
      `Validación: ${verdict} (score: ${score}%)`,
      { verdict, score }
    );
  }

  recordRetrabajo(taskId, actor, specificChanges) {
    return this.recordDecision(
      DECISION_TYPES.RETRABAJO_REQUESTED,
      taskId,
      actor,
      `Retrabajo solicitado: ${specificChanges.join(', ')}`,
      { changes: specificChanges }
    );
  }

  recordAlertCreated(alertId, actor, severity, title) {
    return this.recordDecision(
      DECISION_TYPES.ALERT_CREATED,
      alertId,
      actor,
      `Alerta creada: ${title} (${severity})`,
      { severity, title }
    );
  }

  recordAlertResolved(alertId, actor) {
    return this.recordDecision(
      DECISION_TYPES.ALERT_RESOLVED,
      alertId,
      actor,
      'Alerta resuelta',
      {}
    );
  }

  // ==========================================================================
  // GARANTÍA DE INTEGRIDAD
  // ==========================================================================

  calculateHash(decision) {
    const content = JSON.stringify({
      type: decision.type,
      entityId: decision.entityId,
      actor: decision.actor,
      description: decision.description,
      timestamp: decision.timestamp,
      previousHash: decision.previousHash
    });

    return crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');
  }

  verifyIntegrity() {
    let previousHash = null;
    let isValid = true;

    for (const decision of this.decisions) {
      // Recalcular hash
      const expectedHash = this.calculateHash(decision);

      if (expectedHash !== decision.hash) {
        this.log.error(`❌ Hash mismatch en decisión: ${decision.id}`);
        isValid = false;
      }

      // Verificar cadena
      if (decision.previousHash && decision.previousHash !== previousHash) {
        this.log.error(`❌ Cadena rota en decisión: ${decision.id}`);
        isValid = false;
      }

      previousHash = decision.hash;
    }

    if (isValid) {
      this.log.info(`✅ Integridad verificada: ${this.decisions.length} decisiones válidas`);
    }

    return isValid;
  }

  // ==========================================================================
  // TRAIL DE AUDITORÍA
  // ==========================================================================

  getEntityTrail(entityId) {
    return this.entityTrails.get(entityId) || [];
  }

  getTrailReport(entityId) {
    const trail = this.getEntityTrail(entityId);

    const report = {
      entityId,
      totalDecisions: trail.length,
      timeline: trail.map(d => ({
        timestamp: d.timestamp,
        type: d.type,
        actor: d.actor,
        description: d.description
      })),
      summary: this.summarizeTrail(trail)
    };

    return report;
  }

  summarizeTrail(trail) {
    const summary = {
      byType: {},
      byActor: {},
      timeline: {
        start: trail.length > 0 ? trail[0].timestamp : null,
        end: trail.length > 0 ? trail[trail.length - 1].timestamp : null
      }
    };

    for (const decision of trail) {
      // Por tipo
      summary.byType[decision.type] = (summary.byType[decision.type] || 0) + 1;

      // Por actor
      summary.byActor[decision.actor] = (summary.byActor[decision.actor] || 0) + 1;
    }

    return summary;
  }

  // ==========================================================================
  // COMPLIANCE CHECKING
  // ==========================================================================

  checkCompliance(entityId) {
    const trail = this.getEntityTrail(entityId);

    const issues = [];

    // Verificar que cada tarea tiene todas las fases
    const hasCreated = trail.some(d => d.type === DECISION_TYPES.TASK_CREATED);
    const hasAssigned = trail.some(d => d.type === DECISION_TYPES.TASK_ASSIGNED);
    const hasStarted = trail.some(d => d.type === DECISION_TYPES.TASK_STARTED);
    const isTerminal = trail.some(d =>
      [DECISION_TYPES.TASK_COMPLETED, DECISION_TYPES.TASK_FAILED].includes(d.type)
    );

    if (hasCreated && !hasAssigned) {
      issues.push('⚠️  Tarea creada pero no asignada');
    }

    if (hasAssigned && !hasStarted) {
      issues.push('⚠️  Tarea asignada pero no iniciada');
    }

    if (hasStarted && !isTerminal) {
      issues.push('⚠️  Tarea iniciada pero no completada/fallida');
    }

    const complianceScore = issues.length === 0 ? 100 : 50;

    return {
      entityId,
      compliant: issues.length === 0,
      complianceScore,
      issues,
      audit: this.verifyIntegrity()
    };
  }

  // ==========================================================================
  // REPORTES
  // ==========================================================================

  getAuditLog(filters = {}) {
    let decisions = [...this.decisions];

    // Filtrar por tipo
    if (filters.type) {
      decisions = decisions.filter(d => d.type === filters.type);
    }

    // Filtrar por actor
    if (filters.actor) {
      decisions = decisions.filter(d => d.actor === filters.actor);
    }

    // Filtrar por fecha
    if (filters.startDate) {
      decisions = decisions.filter(d => new Date(d.timestamp) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      decisions = decisions.filter(d => new Date(d.timestamp) <= new Date(filters.endDate));
    }

    return {
      total: decisions.length,
      decisions: decisions.map(d => ({
        timestamp: d.timestamp,
        type: d.type,
        entityId: d.entityId,
        actor: d.actor,
        description: d.description
      }))
    };
  }

  getStatistics() {
    const stats = {
      timestamp: new Date().toISOString(),
      total: this.decisions.length,
      byType: {},
      byActor: {},
      uniqueEntities: this.entityTrails.size
    };

    for (const decision of this.decisions) {
      stats.byType[decision.type] = (stats.byType[decision.type] || 0) + 1;
      stats.byActor[decision.actor] = (stats.byActor[decision.actor] || 0) + 1;
    }

    return stats;
  }

  getComplianceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalEntities: this.entityTrails.size,
      compliance: [],
      summary: {
        compliant: 0,
        issues: 0,
        averageScore: 0
      }
    };

    for (const entityId of this.entityTrails.keys()) {
      const compliance = this.checkCompliance(entityId);
      report.compliance.push(compliance);

      if (compliance.compliant) {
        report.summary.compliant += 1;
      } else {
        report.summary.issues += 1;
      }

      report.summary.averageScore += compliance.complianceScore;
    }

    if (report.compliance.length > 0) {
      report.summary.averageScore = (report.summary.averageScore / report.compliance.length).toFixed(2);
    }

    return report;
  }

  // ==========================================================================
  // EXPORTAR AUDIT TRAIL
  // ==========================================================================

  exportAuditTrail(format = 'json') {
    if (format === 'json') {
      return {
        exportDate: new Date().toISOString(),
        totalDecisions: this.decisions.length,
        integrity: this.verifyIntegrity(),
        decisions: this.decisions
      };
    } else if (format === 'csv') {
      const csv = ['timestamp,type,entityId,actor,description,hash'];
      this.decisions.forEach(d => {
        csv.push(`${d.timestamp},${d.type},${d.entityId},${d.actor},"${d.description}",${d.hash}`);
      });
      return csv.join('\n');
    }
  }

  // ==========================================================================
  // LIMPIEZA
  // ==========================================================================

  cleanup() {
    this.log.info('🧹 Decision Auditor limpiado');
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let auditor = null;

function getDecisionAuditor() {
  if (!auditor) {
    auditor = new DecisionAuditor();
  }
  return auditor;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  DecisionAuditor,
  getDecisionAuditor,
  DECISION_TYPES
};
