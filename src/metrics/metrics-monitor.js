/**
 * @metrics-monitor - Observabilidad Centralizada (FASE 3, Día 6)
 *
 * Responsabilidades:
 * - Recolectar métricas de todos los sistemas
 * - Calcular KPIs en tiempo real
 * - Mantener series temporales
 * - Generar alertas automáticas
 * - Proveer dashboard data
 */

const { v4: uuidv4 } = require('uuid');

// ============================================================================
// TIPOS Y CONFIGURACIÓN
// ============================================================================

const METRIC_TYPES = {
  TASK_CREATED: 'task_created',
  TASK_STARTED: 'task_started',
  TASK_COMPLETED: 'task_completed',
  TASK_FAILED: 'task_failed',
  VALIDATION_APPROVED: 'validation_approved',
  VALIDATION_REJECTED: 'validation_rejected',
  VALIDATION_CONDITIONAL: 'validation_conditional',
  AGENT_ASSIGNED: 'agent_assigned',
  AGENT_WORKLOAD: 'agent_workload',
  SYSTEM_ERROR: 'system_error'
};

const ALERT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical'
};

const ALERT_THRESHOLDS = {
  errorRateHigh: 0.05,           // > 5% errores
  taskTimeoutHigh: 300000,       // > 5 minutos
  agentWorkloadHigh: 10,         // > 10 tareas
  approvalRateLow: 0.60          // < 60% aprobación
};

// ============================================================================
// METRICS MONITOR CLASS
// ============================================================================

class MetricsMonitor {
  constructor() {
    this.metrics = [];               // Todas las métricas
    this.timeSeries = new Map();     // Series temporales por métrica
    this.alerts = [];                // Alertas generadas
    this.kpis = {};                  // KPIs calculados
    this.startTime = Date.now();

    this.log = {
      info: (msg) => console.log(`[📊 METRICS] ${msg}`),
      warn: (msg) => console.warn(`[⚠️  METRICS] ${msg}`),
      error: (msg) => console.error(`[❌ METRICS] ${msg}`)
    };

    // Calcular KPIs iniciales
    this.calculateKPIs();

    // Iniciar cálculo periódico de KPIs
    this.startKpiCalculation();
  }

  // ==========================================================================
  // REGISTRO DE MÉTRICAS
  // ==========================================================================

  recordMetric(type, value, metadata = {}) {
    const metric = {
      id: uuidv4(),
      type,
      value,
      timestamp: new Date(),
      metadata
    };

    this.metrics.push(metric);

    // Agregar a serie temporal
    if (!this.timeSeries.has(type)) {
      this.timeSeries.set(type, []);
    }
    this.timeSeries.get(type).push(metric);

    return metric;
  }

  // Métodos de conveniencia para registrar eventos comunes
  recordTaskCreated(taskId, type, priority) {
    return this.recordMetric(METRIC_TYPES.TASK_CREATED, 1, {
      taskId, type, priority
    });
  }

  recordTaskStarted(taskId, agent) {
    return this.recordMetric(METRIC_TYPES.TASK_STARTED, 1, {
      taskId, agent
    });
  }

  recordTaskCompleted(taskId, duration) {
    return this.recordMetric(METRIC_TYPES.TASK_COMPLETED, 1, {
      taskId, duration
    });
  }

  recordTaskFailed(taskId, error) {
    return this.recordMetric(METRIC_TYPES.TASK_FAILED, 1, {
      taskId, error
    });
  }

  recordValidation(taskId, verdict, score) {
    const typeMap = {
      'APRUEBA': METRIC_TYPES.VALIDATION_APPROVED,
      'RECHAZA': METRIC_TYPES.VALIDATION_REJECTED,
      'CONDICIONA': METRIC_TYPES.VALIDATION_CONDITIONAL
    };

    return this.recordMetric(typeMap[verdict], 1, {
      taskId, verdict, score
    });
  }

  recordAgentAssigned(agent, taskId) {
    return this.recordMetric(METRIC_TYPES.AGENT_ASSIGNED, 1, {
      agent, taskId
    });
  }

  recordAgentWorkload(agent, workload) {
    return this.recordMetric(METRIC_TYPES.AGENT_WORKLOAD, workload, {
      agent
    });
  }

  // ==========================================================================
  // CÁLCULO DE KPIs
  // ==========================================================================

  calculateKPIs() {
    const now = Date.now();
    const uptime = now - this.startTime;

    // Contar eventos
    const tasksCreated = this.countMetricType(METRIC_TYPES.TASK_CREATED);
    const tasksCompleted = this.countMetricType(METRIC_TYPES.TASK_COMPLETED);
    const tasksFailed = this.countMetricType(METRIC_TYPES.TASK_FAILED);
    const validationsApproved = this.countMetricType(METRIC_TYPES.VALIDATION_APPROVED);
    const validationsRejected = this.countMetricType(METRIC_TYPES.VALIDATION_REJECTED);
    const validationsConditional = this.countMetricType(METRIC_TYPES.VALIDATION_CONDITIONAL);

    // Calcular tasas
    const totalValidations = validationsApproved + validationsRejected + validationsConditional;
    const successRate = tasksCreated > 0
      ? ((tasksCompleted / tasksCreated) * 100).toFixed(2)
      : 0;
    const approvalRate = totalValidations > 0
      ? ((validationsApproved / totalValidations) * 100).toFixed(2)
      : 0;
    const errorRate = tasksCreated > 0
      ? ((tasksFailed / tasksCreated) * 100).toFixed(2)
      : 0;

    // Calcular tiempos promedio
    const avgTaskDuration = this.calculateAverageTaskDuration();
    const avgValidationScore = this.calculateAverageValidationScore();

    // Calcular throughput (tareas/minuto)
    const minutesElapsed = Math.max(1, uptime / 60000);
    const throughput = (tasksCompleted / minutesElapsed).toFixed(2);

    this.kpis = {
      timestamp: new Date().toISOString(),
      uptime: Math.round(uptime / 1000),
      tasks: {
        created: tasksCreated,
        completed: tasksCompleted,
        failed: tasksFailed,
        inProgress: tasksCreated - tasksCompleted - tasksFailed,
        successRate: parseFloat(successRate)
      },
      validations: {
        approved: validationsApproved,
        rejected: validationsRejected,
        conditional: validationsConditional,
        total: totalValidations,
        approvalRate: parseFloat(approvalRate)
      },
      performance: {
        errorRate: parseFloat(errorRate),
        avgTaskDuration: Math.round(avgTaskDuration),
        avgValidationScore: avgValidationScore.toFixed(2),
        throughput: parseFloat(throughput)
      }
    };

    // Revisar alertas
    this.checkAlerts();

    return this.kpis;
  }

  countMetricType(type) {
    return this.timeSeries.get(type)?.length || 0;
  }

  calculateAverageTaskDuration() {
    const durations = this.timeSeries.get(METRIC_TYPES.TASK_COMPLETED)?.map(m => m.metadata.duration) || [];
    if (durations.length === 0) return 0;
    return durations.reduce((a, b) => a + b, 0) / durations.length;
  }

  calculateAverageValidationScore() {
    const scores = [];
    for (const type of [
      METRIC_TYPES.VALIDATION_APPROVED,
      METRIC_TYPES.VALIDATION_REJECTED,
      METRIC_TYPES.VALIDATION_CONDITIONAL
    ]) {
      const metrics = this.timeSeries.get(type) || [];
      metrics.forEach(m => {
        if (m.metadata.score !== undefined) {
          scores.push(parseFloat(m.metadata.score));
        }
      });
    }
    if (scores.length === 0) return 0;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  // ==========================================================================
  // SISTEMA DE ALERTAS
  // ==========================================================================

  checkAlerts() {
    // Limpiar alertas antiguas (> 1 hora)
    const oneHourAgo = Date.now() - 3600000;
    this.alerts = this.alerts.filter(a => a.timestamp > oneHourAgo);

    // Revisar thresholds
    if (this.kpis.performance?.errorRate > ALERT_THRESHOLDS.errorRateHigh * 100) {
      this.createAlert(
        ALERT_SEVERITY.CRITICAL,
        'Error Rate Alto',
        `Tasa de error: ${this.kpis.performance.errorRate}%`
      );
    }

    if (this.kpis.validations?.approvalRate < ALERT_THRESHOLDS.approvalRateLow * 100) {
      this.createAlert(
        ALERT_SEVERITY.WARNING,
        'Aprobación Baja',
        `Tasa de aprobación: ${this.kpis.validations.approvalRate}%`
      );
    }

    if (this.kpis.performance?.avgTaskDuration > ALERT_THRESHOLDS.taskTimeoutHigh) {
      this.createAlert(
        ALERT_SEVERITY.WARNING,
        'Tareas Lentas',
        `Duración promedio: ${this.kpis.performance.avgTaskDuration}ms`
      );
    }
  }

  createAlert(severity, title, message) {
    const alert = {
      id: uuidv4(),
      severity,
      title,
      message,
      timestamp: new Date(),
      resolved: false
    };

    this.alerts.push(alert);

    const emoji = severity === ALERT_SEVERITY.CRITICAL ? '🚨' : '⚠️ ';
    this.log.warn(`${emoji} ${title}: ${message}`);

    return alert;
  }

  resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      this.log.info(`✅ Alerta resuelta: ${alert.title}`);
    }
    return alert;
  }

  getActiveAlerts() {
    return this.alerts.filter(a => !a.resolved);
  }

  // ==========================================================================
  // CÁLCULO PERIÓDICO DE KPIs
  // ==========================================================================

  startKpiCalculation() {
    // Calcular KPIs cada 10 segundos
    this.kpiInterval = setInterval(() => {
      this.calculateKPIs();
    }, 10000);
  }

  stopKpiCalculation() {
    if (this.kpiInterval) {
      clearInterval(this.kpiInterval);
    }
  }

  // ==========================================================================
  // REPORTES Y DASHBOARDS
  // ==========================================================================

  getKPIs() {
    return this.kpis;
  }

  getDashboardData() {
    return {
      timestamp: new Date().toISOString(),
      kpis: this.kpis,
      alerts: this.getActiveAlerts(),
      recentMetrics: this.metrics.slice(-100), // Últimas 100 métricas
      charts: {
        taskTimeline: this.getTaskTimeline(),
        validationDistribution: this.getValidationDistribution(),
        agentWorkload: this.getAgentWorkloadDistribution(),
        errorRate: this.kpis.performance?.errorRate || 0
      }
    };
  }

  getTaskTimeline() {
    const timeline = {};
    const tasksCreated = this.timeSeries.get(METRIC_TYPES.TASK_CREATED) || [];
    const tasksCompleted = this.timeSeries.get(METRIC_TYPES.TASK_COMPLETED) || [];

    tasksCreated.forEach(m => {
      const hour = new Date(m.timestamp).toISOString().split('T')[0];
      timeline[hour] = (timeline[hour] || 0) + 1;
    });

    return {
      labels: Object.keys(timeline).sort(),
      created: Object.values(timeline),
      completed: tasksCompleted.length
    };
  }

  getValidationDistribution() {
    return {
      approved: this.countMetricType(METRIC_TYPES.VALIDATION_APPROVED),
      rejected: this.countMetricType(METRIC_TYPES.VALIDATION_REJECTED),
      conditional: this.countMetricType(METRIC_TYPES.VALIDATION_CONDITIONAL)
    };
  }

  getAgentWorkloadDistribution() {
    const agentMetrics = this.timeSeries.get(METRIC_TYPES.AGENT_ASSIGNED) || [];
    const workload = {};

    agentMetrics.forEach(m => {
      const agent = m.metadata.agent;
      workload[agent] = (workload[agent] || 0) + 1;
    });

    return workload;
  }

  getHistoricalData(metricType, hoursBack = 24) {
    const series = this.timeSeries.get(metricType) || [];
    const cutoff = Date.now() - (hoursBack * 3600000);

    return series.filter(m => m.timestamp > cutoff);
  }

  // ==========================================================================
  // EXPORTAR DATOS
  // ==========================================================================

  exportMetrics(format = 'json') {
    if (format === 'json') {
      return {
        exportDate: new Date().toISOString(),
        totalMetrics: this.metrics.length,
        kpis: this.kpis,
        alerts: this.alerts,
        metrics: this.metrics
      };
    } else if (format === 'csv') {
      const csv = ['timestamp,type,value,metadata'];
      this.metrics.forEach(m => {
        csv.push(`${m.timestamp},${m.type},${m.value},"${JSON.stringify(m.metadata)}"`);
      });
      return csv.join('\n');
    }
  }

  // ==========================================================================
  // LIMPIEZA
  // ==========================================================================

  cleanup() {
    this.stopKpiCalculation();
    this.log.info('🧹 Metrics Monitor limpiado');
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let monitor = null;

function getMetricsMonitor() {
  if (!monitor) {
    monitor = new MetricsMonitor();
  }
  return monitor;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  MetricsMonitor,
  getMetricsMonitor,
  METRIC_TYPES,
  ALERT_SEVERITY
};
