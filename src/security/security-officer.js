/**
 * @security-officer - Seguridad Centralizada (FASE 4, Día 9)
 *
 * Responsabilidades:
 * - Auditar seguridad del sistema
 * - Detectar vulnerabilidades
 * - Enforcer políticas de seguridad
 * - Incident response
 * - Reportes de seguridad
 */

const { v4: uuidv4 } = require('uuid');

// ============================================================================
// TIPOS Y CONFIGURACIÓN
// ============================================================================

const SECURITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

const VULNERABILITY_TYPES = {
  INJECTION: 'injection',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  ENCRYPTION: 'encryption',
  RATE_LIMIT: 'rate_limit',
  INPUT_VALIDATION: 'input_validation',
  LOG_MONITORING: 'log_monitoring',
  DATA_EXPOSURE: 'data_exposure'
};

const SECURITY_POLICIES = {
  REQUIRE_HTTPS: true,
  RATE_LIMIT_PER_MINUTE: 1000,
  MAX_REQUEST_SIZE: 10 * 1024 * 1024, // 10 MB
  TOKEN_EXPIRY_MINUTES: 60,
  PASSWORD_MIN_LENGTH: 12,
  REQUIRE_2FA: false,
  LOG_ALL_OPERATIONS: true,
  ENCRYPT_AT_REST: true
};

// ============================================================================
// SECURITY OFFICER CLASS
// ============================================================================

class SecurityOfficer {
  constructor() {
    this.vulnerabilities = [];
    this.incidents = [];
    this.policies = { ...SECURITY_POLICIES };
    this.accessLog = [];
    this.securityScore = 100;

    this.log = {
      info: (msg) => console.log(`[🔐 SECURITY] ${msg}`),
      warn: (msg) => console.warn(`[⚠️  SECURITY] ${msg}`),
      error: (msg) => console.error(`[❌ SECURITY] ${msg}`)
    };
  }

  // ==========================================================================
  // AUDITORÍA DE CÓDIGO
  // ==========================================================================

  auditCode(codeContent, codeType = 'javascript') {
    const findings = [];

    // Detectar patrones peligrosos
    const dangers = [
      {
        pattern: /eval\s*\(/g,
        severity: SECURITY_LEVELS.CRITICAL,
        message: 'Uso de eval() - Riesgo de code injection'
      },
      {
        pattern: /exec\s*\(/g,
        severity: SECURITY_LEVELS.CRITICAL,
        message: 'Uso de exec() - Riesgo de command injection'
      },
      {
        pattern: /\.innerHTML\s*=/g,
        severity: SECURITY_LEVELS.HIGH,
        message: 'Uso de innerHTML - Riesgo de XSS'
      },
      {
        pattern: /password\s*=\s*['"][^'"]+['"]/i,
        severity: SECURITY_LEVELS.CRITICAL,
        message: 'Contraseña hardcodeada en código'
      },
      {
        pattern: /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
        severity: SECURITY_LEVELS.CRITICAL,
        message: 'API key hardcodeada en código'
      },
      {
        pattern: /http:\/\//g,
        severity: SECURITY_LEVELS.HIGH,
        message: 'Conexión HTTP sin encriptación'
      }
    ];

    for (const danger of dangers) {
      if (danger.pattern.test(codeContent)) {
        findings.push({
          type: danger.message,
          severity: danger.severity
        });
      }
    }

    return findings;
  }

  // ==========================================================================
  // DETECCIÓN DE VULNERABILIDADES
  // ==========================================================================

  reportVulnerability(type, severity, description, component) {
    const vulnerability = {
      id: uuidv4(),
      type,
      severity,
      description,
      component,
      discoveredAt: new Date(),
      status: 'open', // open, fixed, ignored
      remediation: null
    };

    this.vulnerabilities.push(vulnerability);

    // Ajustar security score
    this.updateSecurityScore();

    const emoji = severity === SECURITY_LEVELS.CRITICAL ? '🚨' : '⚠️ ';
    this.log.warn(`${emoji} Vulnerabilidad: ${description} (${severity})`);

    return vulnerability;
  }

  remediateVulnerability(vulnerabilityId, remediation) {
    const vuln = this.vulnerabilities.find(v => v.id === vulnerabilityId);

    if (vuln) {
      vuln.status = 'fixed';
      vuln.remediation = remediation;
      vuln.fixedAt = new Date();

      this.updateSecurityScore();
      this.log.info(`✅ Vulnerabilidad remediada: ${vulnerabilityId}`);
    }

    return vuln;
  }

  // ==========================================================================
  // LOGGING DE ACCESO
  // ==========================================================================

  logAccess(actor, resource, action, result = 'success') {
    const logEntry = {
      id: uuidv4(),
      timestamp: new Date(),
      actor,
      resource,
      action,
      result,
      ipAddress: '127.0.0.1', // Mock
      userAgent: 'Claude'      // Mock
    };

    this.accessLog.push(logEntry);

    // Detectar patrones sospechosos
    this.detectAnomalies(actor, action);

    return logEntry;
  }

  detectAnomalies(actor, action) {
    // Contar acciones recientes del actor
    const recentActions = this.accessLog.filter(log =>
      log.actor === actor &&
      (Date.now() - log.timestamp) < 60000 // Últimos 60 segundos
    );

    // Alerta por tasa de acceso alta
    if (recentActions.length > 100) {
      this.log.warn(`🚨 Posible ataque: ${actor} tiene ${recentActions.length} acciones en 60s`);

      this.recordIncident(
        'anomaly_detected',
        SECURITY_LEVELS.HIGH,
        `Tasa anormal de acceso detectada para ${actor}`,
        { actor, count: recentActions.length }
      );
    }
  }

  // ==========================================================================
  // INCIDENT RESPONSE
  // ==========================================================================

  recordIncident(type, severity, description, metadata = {}) {
    const incident = {
      id: uuidv4(),
      type,
      severity,
      description,
      metadata,
      timestamp: new Date(),
      status: 'open', // open, investigating, resolved
      resolution: null
    };

    this.incidents.push(incident);

    const emoji = severity === SECURITY_LEVELS.CRITICAL ? '🚨' : '⚠️ ';
    this.log.error(`${emoji} Incident: ${description}`);

    return incident;
  }

  resolveIncident(incidentId, resolution) {
    const incident = this.incidents.find(i => i.id === incidentId);

    if (incident) {
      incident.status = 'resolved';
      incident.resolution = resolution;
      incident.resolvedAt = new Date();

      this.log.info(`✅ Incident resuelto: ${incidentId}`);
    }

    return incident;
  }

  // ==========================================================================
  // VALIDACIÓN DE ENTRADAS
  // ==========================================================================

  validateInput(input, type = 'string', maxLength = 1000) {
    // Detectar inyecciones comunes
    const injectionPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /union\s+select/i,
      /drop\s+table/i,
      /--\s*$/
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(input)) {
        this.log.warn(`🚨 Inyección detectada: ${pattern}`);
        return {
          valid: false,
          error: 'Input contiene patrones sospechosos'
        };
      }
    }

    // Validar longitud
    if (input.length > maxLength) {
      return {
        valid: false,
        error: `Input excede máximo de ${maxLength} caracteres`
      };
    }

    return {
      valid: true
    };
  }

  // ==========================================================================
  // GESTIÓN DE POLÍTICAS
  // ==========================================================================

  updatePolicy(policyName, value) {
    if (policyName in this.policies) {
      this.policies[policyName] = value;
      this.log.info(`📋 Política actualizada: ${policyName} = ${value}`);
    }

    return this.policies;
  }

  getPolicies() {
    return { ...this.policies };
  }

  // ==========================================================================
  // SCORING DE SEGURIDAD
  // ==========================================================================

  updateSecurityScore() {
    let score = 100;

    // Restar por vulnerabilidades abiertas
    for (const vuln of this.vulnerabilities) {
      if (vuln.status === 'open') {
        const penalty = vuln.severity === SECURITY_LEVELS.CRITICAL ? 20 :
                       vuln.severity === SECURITY_LEVELS.HIGH ? 10 :
                       vuln.severity === SECURITY_LEVELS.MEDIUM ? 5 : 1;
        score -= penalty;
      }
    }

    // Restar por incidents abiertos
    score -= this.incidents.filter(i => i.status === 'open').length * 5;

    this.securityScore = Math.max(0, score);
  }

  getSecurityScore() {
    return {
      score: this.securityScore,
      rating: this.securityScore >= 90 ? 'A' :
              this.securityScore >= 80 ? 'B' :
              this.securityScore >= 70 ? 'C' :
              this.securityScore >= 60 ? 'D' : 'F',
      openVulnerabilities: this.vulnerabilities.filter(v => v.status === 'open').length,
      openIncidents: this.incidents.filter(i => i.status === 'open').length
    };
  }

  // ==========================================================================
  // REPORTES
  // ==========================================================================

  getSecurityReport() {
    return {
      timestamp: new Date().toISOString(),
      overallScore: this.getSecurityScore(),
      vulnerabilities: {
        total: this.vulnerabilities.length,
        open: this.vulnerabilities.filter(v => v.status === 'open'),
        fixed: this.vulnerabilities.filter(v => v.status === 'fixed'),
        byType: this.groupBy(this.vulnerabilities, 'type'),
        bySeverity: this.groupBy(this.vulnerabilities, 'severity')
      },
      incidents: {
        total: this.incidents.length,
        open: this.incidents.filter(i => i.status === 'open'),
        resolved: this.incidents.filter(i => i.status === 'resolved'),
        byType: this.groupBy(this.incidents, 'type')
      },
      policies: this.policies,
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.vulnerabilities.filter(v => v.status === 'open').length > 0) {
      recommendations.push('Remediar todas las vulnerabilidades abiertas');
    }

    if (this.incidents.filter(i => i.status === 'open').length > 0) {
      recommendations.push('Investigar y resolver todos los incidents abiertos');
    }

    if (!this.policies.REQUIRE_HTTPS) {
      recommendations.push('Habilitar HTTPS requerido');
    }

    if (!this.policies.REQUIRE_2FA) {
      recommendations.push('Considerar habilitar 2FA');
    }

    if (this.securityScore < 80) {
      recommendations.push('Realizar auditoría de seguridad completa');
    }

    return recommendations;
  }

  groupBy(array, key) {
    const result = {};
    for (const item of array) {
      const groupKey = item[key];
      result[groupKey] = (result[groupKey] || 0) + 1;
    }
    return result;
  }

  // ==========================================================================
  // LIMPIEZA
  // ==========================================================================

  cleanup() {
    this.log.info('🧹 Security Officer limpiado');
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let officer = null;

function getSecurityOfficer() {
  if (!officer) {
    officer = new SecurityOfficer();
  }
  return officer;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  SecurityOfficer,
  getSecurityOfficer,
  SECURITY_LEVELS,
  VULNERABILITY_TYPES,
  SECURITY_POLICIES
};
