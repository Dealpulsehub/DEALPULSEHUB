/**
 * @client-manager - Gestión de Clientes (FASE 4, Día 9)
 *
 * Responsabilidades:
 * - Registrar clientes
 * - Rastrear proyectos
 * - Gestionar contactos
 * - Enviar notificaciones
 * - SLA tracking
 */

const { v4: uuidv4 } = require('uuid');

// ============================================================================
// TIPOS Y CONFIGURACIÓN
// ============================================================================

const CLIENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PROSPECT: 'prospect',
  CHURNED: 'churned'
};

const PROJECT_STATUS = {
  PROPOSAL: 'proposal',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold'
};

const SLA_METRICS = {
  RESPONSE_TIME: 24, // horas
  DELIVERY_TIME: 14, // días
  UPTIME: 99.5      // %
};

// ============================================================================
// CLIENT MANAGER CLASS
// ============================================================================

class ClientManager {
  constructor() {
    this.clients = new Map();
    this.projects = new Map();
    this.contacts = new Map();
    this.notifications = [];
    this.slaMetrics = new Map();

    this.log = {
      info: (msg) => console.log(`[👥 CLIENTS] ${msg}`),
      warn: (msg) => console.warn(`[⚠️  CLIENTS] ${msg}`),
      error: (msg) => console.error(`[❌ CLIENTS] ${msg}`)
    };
  }

  // ==========================================================================
  // GESTIÓN DE CLIENTES
  // ==========================================================================

  registerClient(name, email, company = null, phone = null) {
    const client = {
      id: uuidv4(),
      name,
      email,
      company,
      phone,
      status: CLIENT_STATUS.PROSPECT,
      registeredAt: new Date(),
      projects: [],
      contacts: [],
      preferences: {
        emailNotifications: true,
        slackNotifications: false,
        weeklyReports: true
      }
    };

    this.clients.set(client.id, client);

    this.log.info(`👤 Cliente registrado: ${name} (${email})`);

    return client;
  }

  getClient(clientId) {
    return this.clients.get(clientId);
  }

  listClients(status = null) {
    let clients = Array.from(this.clients.values());

    if (status) {
      clients = clients.filter(c => c.status === status);
    }

    return clients;
  }

  updateClientStatus(clientId, newStatus) {
    const client = this.clients.get(clientId);

    if (client) {
      const oldStatus = client.status;
      client.status = newStatus;
      client.statusUpdatedAt = new Date();

      this.log.info(`✅ Estado actualizado: ${oldStatus} → ${newStatus}`);
    }

    return client;
  }

  // ==========================================================================
  // GESTIÓN DE PROYECTOS
  // ==========================================================================

  createProject(clientId, name, description, budget = 0) {
    const client = this.clients.get(clientId);

    if (!client) {
      this.log.error(`❌ Cliente no encontrado: ${clientId}`);
      return null;
    }

    const project = {
      id: uuidv4(),
      clientId,
      name,
      description,
      budget,
      status: PROJECT_STATUS.PROPOSAL,
      createdAt: new Date(),
      startDate: null,
      endDate: null,
      tasks: [],
      timeline: {
        proposed: null,
        actual: null
      },
      budget: {
        proposed: budget,
        actual: 0
      }
    };

    this.projects.set(project.id, project);
    client.projects.push(project.id);

    this.log.info(`📊 Proyecto creado: ${name} (${clientId})`);

    return project;
  }

  getProject(projectId) {
    return this.projects.get(projectId);
  }

  updateProjectStatus(projectId, newStatus) {
    const project = this.projects.get(projectId);

    if (project) {
      project.status = newStatus;
      project.statusUpdatedAt = new Date();

      this.log.info(`✅ Proyecto: ${newStatus}`);
    }

    return project;
  }

  completeProject(projectId) {
    const project = this.projects.get(projectId);

    if (project) {
      project.status = PROJECT_STATUS.COMPLETED;
      project.completedAt = new Date();

      // Calcular duración real
      if (project.startDate) {
        const duration = project.completedAt - project.startDate;
        project.timeline.actual = Math.round(duration / (1000 * 60 * 60 * 24)); // días
      }

      this.log.info(`🎉 Proyecto completado: ${project.name}`);

      // Enviar notificación
      this.sendNotification(
        project.clientId,
        'success',
        `Proyecto "${project.name}" completado exitosamente`
      );
    }

    return project;
  }

  // ==========================================================================
  // GESTIÓN DE CONTACTOS
  // ==========================================================================

  addContact(clientId, name, email, role = 'primary') {
    const contact = {
      id: uuidv4(),
      clientId,
      name,
      email,
      role,
      addedAt: new Date()
    };

    this.contacts.set(contact.id, contact);

    const client = this.clients.get(clientId);
    if (client) {
      client.contacts.push(contact.id);
    }

    this.log.info(`👤 Contacto agregado: ${name} (${role})`);

    return contact;
  }

  getClientContacts(clientId) {
    const client = this.clients.get(clientId);

    if (!client) return [];

    return client.contacts.map(contactId => this.contacts.get(contactId));
  }

  // ==========================================================================
  // NOTIFICACIONES
  // ==========================================================================

  sendNotification(clientId, type, message) {
    const notification = {
      id: uuidv4(),
      clientId,
      type, // 'info', 'warning', 'success', 'error'
      message,
      timestamp: new Date(),
      read: false,
      channels: ['email', 'dashboard']
    };

    this.notifications.push(notification);

    const emoji = type === 'success' ? '✅' :
                  type === 'error' ? '❌' :
                  type === 'warning' ? '⚠️ ' : 'ℹ️ ';

    this.log.info(`${emoji} Notificación: ${message}`);

    return notification;
  }

  getNotifications(clientId) {
    return this.notifications.filter(n => n.clientId === clientId);
  }

  getUnreadNotifications(clientId) {
    return this.getNotifications(clientId).filter(n => !n.read);
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);

    if (notification) {
      notification.read = true;
      notification.readAt = new Date();
    }

    return notification;
  }

  // ==========================================================================
  // SLA TRACKING
  // ==========================================================================

  trackSLA(projectId, metric, value) {
    const key = `${projectId}-${metric}`;

    const slaRecord = {
      projectId,
      metric,
      value,
      expected: SLA_METRICS[metric],
      compliant: value <= SLA_METRICS[metric],
      timestamp: new Date()
    };

    this.slaMetrics.set(key, slaRecord);

    return slaRecord;
  }

  getSLAReport(projectId) {
    const metrics = Array.from(this.slaMetrics.values())
      .filter(m => m.projectId === projectId);

    const compliant = metrics.filter(m => m.compliant).length;
    const total = metrics.length;

    return {
      projectId,
      totalMetrics: total,
      compliantMetrics: compliant,
      complianceRate: total > 0 ? ((compliant / total) * 100).toFixed(2) + '%' : '0%',
      metrics: metrics
    };
  }

  // ==========================================================================
  // REPORTING
  // ==========================================================================

  getClientReport(clientId) {
    const client = this.clients.get(clientId);

    if (!client) return null;

    const projects = client.projects.map(pId => this.projects.get(pId));
    const contacts = this.getClientContacts(clientId);
    const notifications = this.getNotifications(clientId);

    return {
      timestamp: new Date().toISOString(),
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        company: client.company,
        status: client.status
      },
      projects: {
        total: projects.length,
        active: projects.filter(p => p.status !== PROJECT_STATUS.COMPLETED).length,
        completed: projects.filter(p => p.status === PROJECT_STATUS.COMPLETED).length,
        list: projects
      },
      contacts: {
        total: contacts.length,
        list: contacts
      },
      notifications: {
        total: notifications.length,
        unread: this.getUnreadNotifications(clientId).length
      }
    };
  }

  getStats() {
    return {
      timestamp: new Date().toISOString(),
      clients: {
        total: this.clients.size,
        active: Array.from(this.clients.values()).filter(c => c.status === CLIENT_STATUS.ACTIVE).length,
        prospects: Array.from(this.clients.values()).filter(c => c.status === CLIENT_STATUS.PROSPECT).length,
        churned: Array.from(this.clients.values()).filter(c => c.status === CLIENT_STATUS.CHURNED).length
      },
      projects: {
        total: this.projects.size,
        inProgress: Array.from(this.projects.values()).filter(p => p.status === PROJECT_STATUS.IN_PROGRESS).length,
        completed: Array.from(this.projects.values()).filter(p => p.status === PROJECT_STATUS.COMPLETED).length
      },
      notifications: {
        total: this.notifications.length,
        unread: this.notifications.filter(n => !n.read).length
      }
    };
  }

  // ==========================================================================
  // LIMPIEZA
  // ==========================================================================

  cleanup() {
    this.log.info('🧹 Client Manager limpiado');
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let manager = null;

function getClientManager() {
  if (!manager) {
    manager = new ClientManager();
  }
  return manager;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  ClientManager,
  getClientManager,
  CLIENT_STATUS,
  PROJECT_STATUS,
  SLA_METRICS
};
