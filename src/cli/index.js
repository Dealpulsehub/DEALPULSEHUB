#!/usr/bin/env node

/**
 * DealPulseHub - CLI Maestro (FASE 1)
 *
 * Interfaz unificada de comandos que conecta con API central
 *
 * COMANDOS:
 * dealphub audit <cliente>           - Auditar landing de cliente
 * dealphub propose <cliente>         - Generar propuesta
 * dealphub landing <producto>        - Crear landing page
 * dealphub metrics                   - Ver métricas del sistema
 * dealphub status                    - Ver estado general
 * dealphub task list                 - Listar tareas
 * dealphub task run <id>             - Ejecutar tarea
 */

const { program } = require('commander');
const axios = require('axios');
const Table = require('cli-table3');

// Configuración
const API_URL = process.env.API_URL || 'http://localhost:3000';

// ============================================================================
// HELPERS
// ============================================================================

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const printSuccess = (message) => {
  console.log(`✅ ${message}`);
};

const printError = (message) => {
  console.error(`❌ ${message}`);
};

const printInfo = (message) => {
  console.log(`ℹ️  ${message}`);
};

const printTable = (headers, rows) => {
  const table = new Table({ head: headers });
  rows.forEach(row => table.push(row));
  console.log(table.toString());
};

// ============================================================================
// CLI COMMANDS
// ============================================================================

program
  .name('dealphub')
  .description('🚀 DealPulseHub - Orquestador de Agentes de Marketing')
  .version('1.0.0');

// COMANDO: STATUS
program
  .command('status')
  .description('Ver estado general del sistema')
  .action(async () => {
    try {
      const response = await apiClient.get('/api/v1/status');
      const data = response.data;

      console.log(`
╔════════════════════════════════════════════════════════════╗
║               ESTADO DEL SISTEMA                           ║
╚════════════════════════════════════════════════════════════╝

Status:      ${data.status}
Uptime:      ${(data.uptime / 1000).toFixed(2)}s
Version:     ${data.version}
Timestamp:   ${data.timestamp}

Componentes:
  ✅ Database:   ${data.components.database}
  ✅ Job Queue:  ${data.components.jobQueue}
  ✅ Cache:      ${data.components.cache}
      `);
      printSuccess('Sistema operativo');
    } catch (error) {
      printError(`No se pudo conectar a la API: ${error.message}`);
      process.exit(1);
    }
  });

// COMANDO: HEALTH CHECK
program
  .command('health')
  .description('Verificar salud de la API')
  .action(async () => {
    try {
      const response = await apiClient.get('/api/v1/health');
      printSuccess(`API respondiendo correctamente: ${response.data.timestamp}`);
    } catch (error) {
      printError(`API no responde: ${error.message}`);
      process.exit(1);
    }
  });

// COMANDO: AUDIT (crear tarea de auditoría)
program
  .command('audit <cliente>')
  .description('Auditar landing page de un cliente')
  .option('-u, --url <url>', 'URL de la landing page')
  .action(async (cliente, options) => {
    try {
      printInfo(`Creando tarea de auditoría para: ${cliente}`);

      const response = await apiClient.post('/api/v1/tasks', {
        type: 'audit',
        priority: 'high',
        payload: {
          cliente,
          url: options.url || 'https://example.com',
          timestamp: new Date().toISOString()
        }
      });

      printSuccess(`Tarea creada: ${response.data.taskId}`);
      console.log(`
Estado:     ${response.data.status}
Creada:     ${response.data.createdAt}

Próximo paso: dealphub task run ${response.data.taskId}
      `);
    } catch (error) {
      printError(`Error al crear tarea: ${error.response?.data?.error || error.message}`);
      process.exit(1);
    }
  });

// COMANDO: PROPOSE (crear tarea de propuesta)
program
  .command('propose <cliente>')
  .description('Generar propuesta para un cliente')
  .option('-p, --presupuesto <amount>', 'Presupuesto estimado')
  .action(async (cliente, options) => {
    try {
      printInfo(`Generando propuesta para: ${cliente}`);

      const response = await apiClient.post('/api/v1/tasks', {
        type: 'proposal',
        priority: 'high',
        payload: {
          cliente,
          presupuesto: options.presupuesto || '5000',
          timestamp: new Date().toISOString()
        }
      });

      printSuccess(`Propuesta iniciada: ${response.data.taskId}`);
      console.log(`
Estado:     ${response.data.status}
Creada:     ${response.data.createdAt}
Presupuesto: ${options.presupuesto || 'No especificado'}
      `);
    } catch (error) {
      printError(`Error: ${error.response?.data?.error || error.message}`);
      process.exit(1);
    }
  });

// COMANDO: LANDING (crear tarea de landing)
program
  .command('landing <producto>')
  .description('Crear landing page para un producto')
  .option('-p, --persona <persona>', 'Buyer persona (carlos|maria|juan|roberto)')
  .action(async (producto, options) => {
    try {
      printInfo(`Creando landing para: ${producto} (Persona: ${options.persona || 'default'})`);

      const response = await apiClient.post('/api/v1/tasks', {
        type: 'landing',
        priority: 'medium',
        payload: {
          producto,
          persona: options.persona || 'carlos',
          timestamp: new Date().toISOString()
        }
      });

      printSuccess(`Landing iniciada: ${response.data.taskId}`);
      console.log(`
Estado:     ${response.data.status}
Creada:     ${response.data.createdAt}
Persona:    ${options.persona || 'carlos'}
      `);
    } catch (error) {
      printError(`Error: ${error.response?.data?.error || error.message}`);
      process.exit(1);
    }
  });

// COMANDO: METRICS
program
  .command('metrics')
  .description('Ver métricas del sistema')
  .action(async () => {
    try {
      const response = await apiClient.get('/api/v1/metrics');
      const data = response.data;

      console.log(`
╔════════════════════════════════════════════════════════════╗
║                     MÉTRICAS DEL SISTEMA                   ║
╚════════════════════════════════════════════════════════════╝

Resumen:
  Total de tareas:      ${data.summary.totalTasks}
  Completadas:          ${data.summary.completedTasks}
  Fallidas:             ${data.summary.failedTasks}
  En ejecución:         ${data.summary.runningTasks}
  Tasa de éxito:        ${data.summary.successRate}

Por tipo:
  Auditorías:           ${data.byType.audit}
  Propuestas:           ${data.byType.proposal}
  Landings:             ${data.byType.landing}
  Validaciones:         ${data.byType.validate}
  Deployments:          ${data.byType.deploy}

Timestamp:              ${data.timestamp}
      `);
    } catch (error) {
      printError(`Error al obtener métricas: ${error.message}`);
      process.exit(1);
    }
  });

// COMANDO TASK LIST
program
  .command('task')
  .description('Gestión de tareas')
  .addCommand(
    program
      .createCommand('list')
      .description('Listar todas las tareas')
      .option('-s, --status <status>', 'Filtrar por estado')
      .action(async (options) => {
        try {
          const params = options.status ? { status: options.status } : {};
          const response = await apiClient.get('/api/v1/tasks', { params });
          const tasks = response.data.tasks;

          if (tasks.length === 0) {
            printInfo('No hay tareas');
            return;
          }

          const headers = ['ID', 'Tipo', 'Estado', 'Prioridad', 'Creada'];
          const rows = tasks.map(t => [
            t.id.substring(0, 8),
            t.type,
            t.status,
            t.priority,
            new Date(t.createdAt).toLocaleTimeString()
          ]);

          printTable(headers, rows);
          printSuccess(`${tasks.length} tareas encontradas`);
        } catch (error) {
          printError(`Error: ${error.message}`);
          process.exit(1);
        }
      })
  );

// COMANDO TASK RUN
program
  .command('task <taskId>')
  .description('Ejecutar una tarea específica')
  .action(async (taskId) => {
    try {
      printInfo(`Ejecutando tarea: ${taskId}`);

      const response = await apiClient.post(`/api/v1/tasks/${taskId}/run`);

      printSuccess(`Tarea iniciada: ${response.data.taskId}`);
      console.log(`
Estado:     ${response.data.status}
Iniciada:   ${response.data.startedAt}
      `);
    } catch (error) {
      printError(`Error: ${error.response?.data?.error || error.message}`);
      process.exit(1);
    }
  });

// COMANDO AYUDA DEFAULT
program.on('--help', () => {
  console.log(`

Ejemplos de uso:

  $ dealphub status
  $ dealphub health
  $ dealphub audit empresa-xyz -u https://landing.com
  $ dealphub propose empresa-xyz -p 5000
  $ dealphub landing infoproducto -p carlos
  $ dealphub metrics
  $ dealphub task list
  $ dealphub task list --status completed
  $ dealphub task abc-123-def

API Base: ${API_URL}
  `);
});

// Parsear argumentos y ejecutar
program.parse(process.argv);

// Si no hay argumentos, mostrar help
if (process.argv.length === 2) {
  program.outputHelp();
}
