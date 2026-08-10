/**
 * @quality-gate - Validación de Calidad Centralizada (FASE 2, Día 4)
 *
 * Responsabilidades:
 * - Validar outputs de todas las tareas
 * - Decisiones: APRUEBA / RECHAZA / CONDICIONA
 * - Matrix de testing automático
 * - Reportes de calidad detallados
 */

const { v4: uuidv4 } = require('uuid');

// ============================================================================
// TIPOS Y CONFIGURACIÓN
// ============================================================================

const QUALITY_VERDICT = {
  APPROVED: 'APRUEBA',
  REJECTED: 'RECHAZA',
  CONDITIONAL: 'CONDICIONA'
};

const TASK_TYPES = {
  AUDIT: 'audit',
  PROPOSAL: 'proposal',
  LANDING: 'landing',
  VALIDATE: 'validate',
  DEPLOY: 'deploy'
};

// ============================================================================
// QUALITY RULES POR TIPO DE TAREA
// ============================================================================

const QUALITY_RULES = {
  [TASK_TYPES.AUDIT]: {
    name: 'Auditoría Neuro-Persuasiva',
    rules: [
      {
        id: 'audit-score-present',
        name: 'Score de auditoría presente',
        weight: 20,
        check: (output) => output.score !== undefined && output.score >= 0 && output.score <= 100
      },
      {
        id: 'audit-issues-identified',
        name: 'Problemas identificados',
        weight: 20,
        check: (output) => Array.isArray(output.issues) && output.issues.length > 0
      },
      {
        id: 'audit-roi-calculated',
        name: 'ROI calculado',
        weight: 20,
        check: (output) => output.roiEstimate !== undefined && output.roiEstimate > 0
      },
      {
        id: 'audit-recommendations',
        name: 'Recomendaciones incluidas',
        weight: 20,
        check: (output) => Array.isArray(output.recommendations) && output.recommendations.length > 0
      },
      {
        id: 'audit-framework-applied',
        name: 'Frameworks aplicados (Brunson/Hormozi)',
        weight: 20,
        check: (output) => output.frameworks && Array.isArray(output.frameworks) && output.frameworks.length > 0
      }
    ],
    thresholds: {
      approved: 85,    // 85% de score = APRUEBA
      rejected: 60     // < 60% = RECHAZA (entre 60-85 = CONDICIONA)
    }
  },

  [TASK_TYPES.PROPOSAL]: {
    name: 'Generación de Propuesta',
    rules: [
      {
        id: 'proposal-title',
        name: 'Título de propuesta presente',
        weight: 15,
        check: (output) => output.title && output.title.length > 10
      },
      {
        id: 'proposal-sections',
        name: 'Secciones completas (executive summary, análisis, solución)',
        weight: 25,
        check: (output) => {
          const requiredSections = ['executive_summary', 'analysis', 'solution', 'timeline', 'pricing'];
          return requiredSections.every(section => output[section] !== undefined);
        }
      },
      {
        id: 'proposal-pricing',
        name: 'Pricing definido y justificado',
        weight: 20,
        check: (output) => output.pricing && output.pricing.amount > 0 && output.pricing.justification
      },
      {
        id: 'proposal-timeline',
        name: 'Timeline realista',
        weight: 20,
        check: (output) => output.timeline && output.timeline.days > 0 && output.timeline.phases > 0
      },
      {
        id: 'proposal-guarantee',
        name: 'Garantía incluida',
        weight: 20,
        check: (output) => output.guarantee && output.guarantee.length > 0
      }
    ],
    thresholds: {
      approved: 80,
      rejected: 50
    }
  },

  [TASK_TYPES.LANDING]: {
    name: 'Creación de Landing Page',
    rules: [
      {
        id: 'landing-html-valid',
        name: 'HTML válido y bien formado',
        weight: 25,
        check: (output) => output.html && output.html.includes('<html') && output.html.includes('</html>')
      },
      {
        id: 'landing-sections',
        name: 'Secciones principales (hero, features, cta, footer)',
        weight: 25,
        check: (output) => {
          const requiredSections = ['hero', 'features', 'cta', 'footer'];
          return requiredSections.every(section => output.sections && output.sections[section]);
        }
      },
      {
        id: 'landing-responsive',
        name: 'Responsive design confirmado',
        weight: 25,
        check: (output) => output.responsive === true && output.breakpoints
      },
      {
        id: 'landing-accessibility',
        name: 'Accesibilidad (alt text, contrast, etc)',
        weight: 25,
        check: (output) => output.accessibility && output.accessibility.passed === true
      }
    ],
    thresholds: {
      approved: 80,
      rejected: 50
    }
  },

  [TASK_TYPES.VALIDATE]: {
    name: 'Validación de Datos',
    rules: [
      {
        id: 'validate-data-present',
        name: 'Datos presentes y válidos',
        weight: 50,
        check: (output) => output.isValid === true
      },
      {
        id: 'validate-no-errors',
        name: 'Sin errores críticos',
        weight: 50,
        check: (output) => !output.errors || output.errors.length === 0
      }
    ],
    thresholds: {
      approved: 90,
      rejected: 70
    }
  },

  [TASK_TYPES.DEPLOY]: {
    name: 'Deployment a Producción',
    rules: [
      {
        id: 'deploy-build-success',
        name: 'Build completado exitosamente',
        weight: 40,
        check: (output) => output.buildSuccess === true
      },
      {
        id: 'deploy-tests-pass',
        name: 'Tests pasados (80%+)',
        weight: 30,
        check: (output) => output.testPass >= 0.80
      },
      {
        id: 'deploy-no-critical-issues',
        name: 'Sin issues críticos de seguridad',
        weight: 30,
        check: (output) => !output.securityIssues || output.securityIssues.critical === 0
      }
    ],
    thresholds: {
      approved: 85,
      rejected: 60
    }
  }
};

// ============================================================================
// QUALITY GATE CLASS
// ============================================================================

class QualityGate {
  constructor() {
    this.validationReports = new Map();
    this.appealQueue = new Map();

    this.log = {
      info: (msg) => console.log(`[🚪 QUALITY-GATE] ${msg}`),
      warn: (msg) => console.warn(`[⚠️  QUALITY-GATE] ${msg}`),
      error: (msg) => console.error(`[❌ QUALITY-GATE] ${msg}`)
    };
  }

  // ==========================================================================
  // VALIDACIÓN DE OUTPUTS
  // ==========================================================================

  validateOutput(taskId, taskType, output) {
    const rules = QUALITY_RULES[taskType];

    if (!rules) {
      this.log.error(`❌ Tipo de tarea no soportado: ${taskType}`);
      return null;
    }

    // Evaluar cada regla
    const evaluations = [];
    let totalScore = 0;
    let totalWeight = 0;

    for (const rule of rules.rules) {
      const passed = rule.check(output);
      evaluations.push({
        ruleId: rule.id,
        name: rule.name,
        passed: passed,
        weight: rule.weight
      });

      if (passed) {
        totalScore += rule.weight;
      }
      totalWeight += rule.weight;
    }

    // Calcular score
    const score = (totalScore / totalWeight) * 100;

    // Determinar veredicto
    let verdict;
    let reasoning = [];

    if (score >= rules.thresholds.approved) {
      verdict = QUALITY_VERDICT.APPROVED;
      reasoning.push(`✅ Score ${score.toFixed(2)}% supera threshold de ${rules.thresholds.approved}%`);
    } else if (score < rules.thresholds.rejected) {
      verdict = QUALITY_VERDICT.REJECTED;
      reasoning.push(`❌ Score ${score.toFixed(2)}% está por debajo de threshold de ${rules.thresholds.rejected}%`);

      // Identificar problemas principales
      const failedRules = evaluations.filter(e => !e.passed);
      reasoning.push(...failedRules.map(r => `  - ${r.name}`));
    } else {
      verdict = QUALITY_VERDICT.CONDITIONAL;
      reasoning.push(`⚠️  Score ${score.toFixed(2)}% requiere retrabajos menores`);

      // Identificar qué necesita mejora
      const failedRules = evaluations.filter(e => !e.passed);
      reasoning.push(...failedRules.map(r => `  - Mejorar: ${r.name}`));
    }

    // Crear reporte
    const report = {
      reportId: uuidv4(),
      taskId: taskId,
      taskType: taskType,
      verdict: verdict,
      score: score.toFixed(2),
      timestamp: new Date().toISOString(),
      evaluations: evaluations,
      reasoning: reasoning,
      summary: {
        passed: evaluations.filter(e => e.passed).length,
        failed: evaluations.filter(e => !e.passed).length,
        total: evaluations.length
      }
    };

    this.validationReports.set(taskId, report);

    this.log.info(`📋 Validación completada: ${taskId} → ${verdict} (${report.score}%)`);

    return report;
  }

  // ==========================================================================
  // APELACIONES (RETRABAJOS)
  // ==========================================================================

  requestRework(taskId, report, specificChanges = []) {
    const appeal = {
      appealId: uuidv4(),
      taskId: taskId,
      originalReport: report,
      requestedAt: new Date().toISOString(),
      specificChanges: specificChanges,
      status: 'pending'  // pending → resubmitted → accepted → rejected
    };

    this.appealQueue.set(taskId, appeal);

    this.log.info(`🔄 Retrabajos solicitados: ${taskId}`);
    this.log.info(`   Cambios específicos: ${specificChanges.join(', ')}`);

    return appeal;
  }

  resubmitForValidation(taskId, newOutput) {
    const appeal = this.appealQueue.get(taskId);

    if (!appeal) {
      this.log.error(`❌ No hay apelación pendiente: ${taskId}`);
      return null;
    }

    // Re-validar
    const originalReport = appeal.originalReport;
    const newReport = this.validateOutput(
      taskId,
      originalReport.taskType,
      newOutput
    );

    appeal.status = 'resubmitted';
    appeal.newReport = newReport;
    appeal.resubmittedAt = new Date().toISOString();

    // Decidir si acepta
    if (newReport.verdict === QUALITY_VERDICT.APPROVED) {
      appeal.status = 'accepted';
      this.log.info(`✅ Retrabajos aceptados: ${taskId}`);
    } else if (newReport.verdict === QUALITY_VERDICT.CONDITIONAL) {
      appeal.status = 'partial';
      this.log.warn(`⚠️  Retrabajos parcialmente aceptados: ${taskId}`);
    } else {
      appeal.status = 'rejected';
      this.log.error(`❌ Retrabajos rechazados: ${taskId}`);
    }

    return {
      appeal: appeal,
      nextAction: this.getNextAction(newReport.verdict)
    };
  }

  // ==========================================================================
  // REPORTES Y ESTADÍSTICAS
  // ==========================================================================

  getReport(taskId) {
    return this.validationReports.get(taskId);
  }

  getStats() {
    const reports = Array.from(this.validationReports.values());

    const stats = {
      timestamp: new Date().toISOString(),
      total: reports.length,
      approved: reports.filter(r => r.verdict === QUALITY_VERDICT.APPROVED).length,
      rejected: reports.filter(r => r.verdict === QUALITY_VERDICT.REJECTED).length,
      conditional: reports.filter(r => r.verdict === QUALITY_VERDICT.CONDITIONAL).length,
      pendingRework: this.appealQueue.size,
      averageScore: reports.length > 0
        ? (reports.reduce((sum, r) => sum + parseFloat(r.score), 0) / reports.length).toFixed(2)
        : 0,
      approvalRate: reports.length > 0
        ? ((reports.filter(r => r.verdict === QUALITY_VERDICT.APPROVED).length / reports.length) * 100).toFixed(2) + '%'
        : 'N/A'
    };

    return stats;
  }

  // ==========================================================================
  // DECISIONES Y ACCIONES SIGUIENTE
  // ==========================================================================

  getNextAction(verdict) {
    const actions = {
      [QUALITY_VERDICT.APPROVED]: {
        action: 'PROCEDER',
        message: 'Tarea aprobada. Proceder a siguiente fase.',
        escalation: false
      },
      [QUALITY_VERDICT.CONDITIONAL]: {
        action: 'RETRABAJO',
        message: 'Se requieren cambios menores. Resubmitir cuando estén listos.',
        escalation: false,
        maxRetries: 2
      },
      [QUALITY_VERDICT.REJECTED]: {
        action: 'RECHAZAR',
        message: 'Tarea no cumple estándares. Requiere revisión completa.',
        escalation: true
      }
    };

    return actions[verdict];
  }

  // ==========================================================================
  // LIMPIEZA
  // ==========================================================================

  cleanup() {
    this.log.info('🧹 Quality Gate limpiado');
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let qualityGate = null;

function getQualityGate() {
  if (!qualityGate) {
    qualityGate = new QualityGate();
  }
  return qualityGate;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  QualityGate,
  getQualityGate,
  QUALITY_VERDICT,
  QUALITY_RULES
};
