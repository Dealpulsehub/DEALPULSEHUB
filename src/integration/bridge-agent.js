/**
 * @bridge-agent - Mediador GRAVX ↔ AIOX (FASE 4, Día 10)
 *
 * Responsabilidades:
 * - Traducir requisitos de GRAVX a AIOX
 * - Validar viabilidad técnica
 * - Resolver conflictos
 * - Proponer alternativas
 * - Facilitar feedback loops
 */

const { v4: uuidv4 } = require('uuid');

// ============================================================================
// TIPOS Y CONFIGURACIÓN
// ============================================================================

const CONFLICT_TYPE = {
  TECHNICAL_CONSTRAINT: 'technical_constraint',
  TIMELINE_MISMATCH: 'timeline_mismatch',
  RESOURCE_LIMITATION: 'resource_limitation',
  SCOPE_CREEP: 'scope_creep',
  QUALITY_REQUIREMENT: 'quality_requirement',
  COST_OVERRUN: 'cost_overrun'
};

const RESOLUTION_STATUS = {
  UNRESOLVED: 'unresolved',
  PROPOSED: 'proposed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  ESCALATED: 'escalated'
};

// ============================================================================
// BRIDGE AGENT CLASS
// ============================================================================

class BridgeAgent {
  constructor() {
    this.requirements = [];
    this.conflicts = [];
    this.conversations = [];
    this.agreements = [];

    this.log = {
      info: (msg) => console.log(`[🌉 BRIDGE] ${msg}`),
      warn: (msg) => console.warn(`[⚠️  BRIDGE] ${msg}`),
      error: (msg) => console.error(`[❌ BRIDGE] ${msg}`)
    };
  }

  // ==========================================================================
  // TRADUCCIÓN DE REQUISITOS
  // ==========================================================================

  translateRequirement(gravxRequirement, source = 'CCO') {
    const translation = {
      id: uuidv4(),
      originalRequirement: gravxRequirement,
      source: source, // CCO, CXO, CAO
      timestamp: new Date(),
      technicalAnalysis: this.analyzeTechnical(gravxRequirement),
      timelineAnalysis: this.analyzeTimeline(gravxRequirement),
      resourceAnalysis: this.analyzeResources(gravxRequirement),
      feasible: null,
      alternatives: [],
      status: 'analyzing'
    };

    // Determinar viabilidad
    translation.feasible = this.determineFeasibility(translation);

    if (!translation.feasible) {
      translation.alternatives = this.proposeAlternatives(gravxRequirement);
    }

    this.requirements.push(translation);

    this.log.info(`📋 Requisito traducido: ${gravxRequirement.substring(0, 50)}...`);

    return translation;
  }

  analyzeTechnical(requirement) {
    // Detectar restricciones técnicas comunes
    const concerns = [];

    if (requirement.includes('real-time')) {
      concerns.push('Requiere arquitectura de tiempo real (WebSockets/SSE)');
    }

    if (requirement.includes('machine learning')) {
      concerns.push('Requiere ML pipeline setup (training, inference)');
    }

    if (requirement.includes('integration')) {
      concerns.push('Requiere API integration testing');
    }

    if (requirement.includes('mobile')) {
      concerns.push('Requiere testing en múltiples dispositivos');
    }

    return {
      concerns: concerns,
      complexity: concerns.length > 2 ? 'high' : concerns.length > 0 ? 'medium' : 'low'
    };
  }

  analyzeTimeline(requirement) {
    // Estimar tiempo basado en palabras clave
    let estimatedDays = 5; // default

    if (requirement.includes('urgent') || requirement.includes('asap')) {
      estimatedDays = 2;
    } else if (requirement.includes('complex')) {
      estimatedDays = 14;
    } else if (requirement.includes('simple') || requirement.includes('minor')) {
      estimatedDays = 2;
    }

    return {
      estimatedDays: estimatedDays,
      feasibleWithDeadline: estimatedDays <= 10 // arbitrary threshold
    };
  }

  analyzeResources(requirement) {
    // Estimar recursos necesarios
    const resources = [];

    if (requirement.includes('database')) {
      resources.push('Database architect', 'Schema design');
    }

    if (requirement.includes('ui') || requirement.includes('design')) {
      resources.push('Frontend engineer', 'Designer');
    }

    if (requirement.includes('api')) {
      resources.push('Backend engineer', 'DevOps');
    }

    return {
      estimatedResources: resources,
      teamSize: Math.ceil(resources.length / 2)
    };
  }

  determineFeasibility(translation) {
    // Lógica simple de viabilidad
    const technical = translation.technicalAnalysis;
    const timeline = translation.timelineAnalysis;
    const resources = translation.resourceAnalysis;

    return (
      technical.complexity !== 'high' &&
      timeline.feasibleWithDeadline &&
      resources.teamSize <= 3
    );
  }

  proposeAlternatives(requirement) {
    return [
      {
        alternative: 'Simplificar scope - implementar MVP solo',
        rationale: 'Reducir complejidad inicial'
      },
      {
        alternative: 'Extender timeline - más días de desarrollo',
        rationale: 'Permitir implementación de calidad'
      },
      {
        alternative: 'Usar solución SAAS - integración en lugar de custom',
        rationale: 'Reducir complejidad técnica'
      }
    ];
  }

  // ==========================================================================
  // GESTIÓN DE CONFLICTOS
  // ==========================================================================

  identifyConflict(requirement1, requirement2, description) {
    const conflict = {
      id: uuidv4(),
      type: this.determineConflictType(requirement1, requirement2),
      requirement1: requirement1,
      requirement2: requirement2,
      description: description,
      identifiedAt: new Date(),
      status: RESOLUTION_STATUS.UNRESOLVED,
      proposedResolution: null,
      approvals: { gravx: false, aiox: false }
    };

    this.conflicts.push(conflict);

    this.log.warn(`⚖️  Conflicto identificado: ${conflict.type}`);

    return conflict;
  }

  determineConflictType(req1, req2) {
    if (req1.includes('day') || req2.includes('day')) {
      return CONFLICT_TYPE.TIMELINE_MISMATCH;
    }

    if (req1.includes('complex') || req2.includes('simple')) {
      return CONFLICT_TYPE.TECHNICAL_CONSTRAINT;
    }

    if (req1.includes('resource') || req2.includes('limited')) {
      return CONFLICT_TYPE.RESOURCE_LIMITATION;
    }

    return CONFLICT_TYPE.SCOPE_CREEP;
  }

  proposeResolution(conflictId, proposal, rationale) {
    const conflict = this.conflicts.find(c => c.id === conflictId);

    if (conflict) {
      conflict.proposedResolution = {
        proposal: proposal,
        rationale: rationale,
        proposedAt: new Date()
      };

      conflict.status = RESOLUTION_STATUS.PROPOSED;

      this.log.info(`💡 Resolución propuesta: ${proposal}`);
    }

    return conflict;
  }

  approveResolution(conflictId, team) {
    const conflict = this.conflicts.find(c => c.id === conflictId);

    if (conflict) {
      if (team === 'gravx') {
        conflict.approvals.gravx = true;
      } else if (team === 'aiox') {
        conflict.approvals.aiox = true;
      }

      // Si ambos aprueban, marcar como aceptado
      if (conflict.approvals.gravx && conflict.approvals.aiox) {
        conflict.status = RESOLUTION_STATUS.ACCEPTED;
        this.log.info(`✅ Conflicto resuelto por ambos equipos`);
      }
    }

    return conflict;
  }

  escalateConflict(conflictId, reason) {
    const conflict = this.conflicts.find(c => c.id === conflictId);

    if (conflict) {
      conflict.status = RESOLUTION_STATUS.ESCALATED;
      conflict.escalationReason = reason;
      conflict.escalatedAt = new Date();

      this.log.warn(`🚨 Conflicto escalado: ${reason}`);
    }

    return conflict;
  }

  // ==========================================================================
  // DIÁLOGOS Y CONVERSACIONES
  // ==========================================================================

  startConversation(topic, initiator) {
    const conversation = {
      id: uuidv4(),
      topic,
      initiator, // 'gravx' o 'aiox'
      createdAt: new Date(),
      messages: [],
      status: 'open', // open, resolved
      resolution: null
    };

    this.conversations.push(conversation);

    this.log.info(`💬 Conversación iniciada: ${topic}`);

    return conversation;
  }

  addMessage(conversationId, from, message) {
    const conversation = this.conversations.find(c => c.id === conversationId);

    if (conversation) {
      conversation.messages.push({
        from: from, // 'gravx' o 'aiox'
        text: message,
        timestamp: new Date()
      });
    }

    return conversation;
  }

  resolveConversation(conversationId, resolution) {
    const conversation = this.conversations.find(c => c.id === conversationId);

    if (conversation) {
      conversation.status = 'resolved';
      conversation.resolution = resolution;
      conversation.resolvedAt = new Date();

      this.log.info(`✅ Conversación resuelta`);
    }

    return conversation;
  }

  // ==========================================================================
  // ACUERDOS
  // ==========================================================================

  recordAgreement(topic, terms, signedBy) {
    const agreement = {
      id: uuidv4(),
      topic,
      terms: terms,
      signedBy: signedBy, // array de equipos
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 días
    };

    this.agreements.push(agreement);

    this.log.info(`📜 Acuerdo registrado: ${topic}`);

    return agreement;
  }

  getAgreements() {
    return this.agreements.filter(a => a.expiresAt > new Date());
  }

  // ==========================================================================
  // REPORTES
  // ==========================================================================

  getBridgeReport() {
    return {
      timestamp: new Date().toISOString(),
      requirements: {
        total: this.requirements.length,
        feasible: this.requirements.filter(r => r.feasible).length,
        withAlternatives: this.requirements.filter(r => r.alternatives.length > 0).length
      },
      conflicts: {
        total: this.conflicts.length,
        unresolved: this.conflicts.filter(c => c.status === RESOLUTION_STATUS.UNRESOLVED).length,
        proposed: this.conflicts.filter(c => c.status === RESOLUTION_STATUS.PROPOSED).length,
        accepted: this.conflicts.filter(c => c.status === RESOLUTION_STATUS.ACCEPTED).length,
        escalated: this.conflicts.filter(c => c.status === RESOLUTION_STATUS.ESCALATED).length
      },
      conversations: {
        total: this.conversations.length,
        open: this.conversations.filter(c => c.status === 'open').length,
        resolved: this.conversations.filter(c => c.status === 'resolved').length
      },
      agreements: {
        active: this.getAgreements().length,
        total: this.agreements.length
      }
    };
  }

  // ==========================================================================
  // LIMPIEZA
  // ==========================================================================

  cleanup() {
    this.log.info('🧹 Bridge Agent limpiado');
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let bridge = null;

function getBridgeAgent() {
  if (!bridge) {
    bridge = new BridgeAgent();
  }
  return bridge;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  BridgeAgent,
  getBridgeAgent,
  CONFLICT_TYPE,
  RESOLUTION_STATUS
};
