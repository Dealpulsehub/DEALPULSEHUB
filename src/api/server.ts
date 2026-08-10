/**
 * DealPulseHub - API REST Central (FASE 1)
 *
 * Orquestador central de tareas, validación y métricas
 * Punto único de entrada para el sistema
 *
 * ENDPOINTS:
 * GET  /api/v1/health      - Health check del sistema
 * GET  /api/v1/status      - Estado general del sistema
 * POST /api/v1/tasks       - Crear nueva tarea
 * GET  /api/v1/tasks       - Listar tareas
 * GET  /api/v1/tasks/:id   - Obtener tarea específica
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Cargar variables de entorno
dotenv.config();

// Logger centralizado (simple)
const logger = {
  info: (message: any) => console.log(`[INFO] ${JSON.stringify(message)}`),
  error: (message: any) => console.error(`[ERROR] ${JSON.stringify(message)}`)
};

// Crear app Express
const app: Express = express();
const PORT = process.env.PORT || 3000;

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Parsear JSON
app.use(express.json());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info({
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString()
  });
  next();
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    path: req.path
  });
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// =============================================================================
// ESTADO GLOBAL DEL SISTEMA
// =============================================================================

interface SystemStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  timestamp: string;
  version: string;
  components: {
    database: 'operational' | 'error';
    jobQueue: 'operational' | 'error';
    cache: 'operational' | 'error';
  };
}

const systemStartTime = Date.now();

const getSystemStatus = (): SystemStatus => {
  return {
    status: 'healthy',
    uptime: Date.now() - systemStartTime,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    components: {
      database: 'operational',
      jobQueue: 'operational',
      cache: 'operational'
    }
  };
};

// =============================================================================
// RUTAS: HEALTH + STATUS
// =============================================================================

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/status', (req: Request, res: Response) => {
  const status = getSystemStatus();
  res.status(200).json(status);
});

// =============================================================================
// RUTAS: TAREAS (Job Queue)
// =============================================================================

interface Task {
  id: string;
  type: 'audit' | 'proposal' | 'landing' | 'validate' | 'deploy';
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  assignedTo?: string;
  payload: Record<string, any>;
  result?: Record<string, any>;
  error?: string;
}

// Almacenamiento en memoria (será persistente con BD)
const taskQueue: Map<string, Task> = new Map();
const taskHistory: Task[] = [];

app.post('/api/v1/tasks', (req: Request, res: Response) => {
  const { type, priority = 'medium', payload } = req.body;

  // Validación básica
  if (!type || !payload) {
    return res.status(400).json({
      error: 'Missing required fields: type, payload'
    });
  }

  // Crear tarea
  const task: Task = {
    id: uuidv4(),
    type,
    status: 'pending',
    priority,
    createdAt: new Date().toISOString(),
    payload
  };

  // Guardar en queue
  taskQueue.set(task.id, task);

  logger.info({
    message: 'Task created',
    taskId: task.id,
    type: task.type,
    priority: task.priority
  });

  res.status(201).json({
    taskId: task.id,
    status: task.status,
    createdAt: task.createdAt
  });
});

app.get('/api/v1/tasks', (req: Request, res: Response) => {
  const { status, priority } = req.query;

  let tasks = Array.from(taskQueue.values());

  // Filtrar por status
  if (status) {
    tasks = tasks.filter(t => t.status === status);
  }

  // Filtrar por prioridad
  if (priority) {
    tasks = tasks.filter(t => t.priority === priority);
  }

  res.status(200).json({
    count: tasks.length,
    tasks: tasks.sort((a, b) => {
      // Ordenar por prioridad (crítica primero)
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] -
             priorityOrder[b.priority as keyof typeof priorityOrder];
    })
  });
});

app.get('/api/v1/tasks/:id', (req: Request, res: Response) => {
  const task = taskQueue.get(req.params.id as string);

  if (!task) {
    return res.status(404).json({
      error: 'Task not found'
    });
  }

  res.status(200).json(task);
});

app.post('/api/v1/tasks/:id/run', (req: Request, res: Response) => {
  const task = taskQueue.get(req.params.id as string);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Cambiar estado
  task.status = 'running';
  task.startedAt = new Date().toISOString();

  logger.info({
    message: 'Task started',
    taskId: task.id,
    type: task.type
  });

  res.status(200).json({
    taskId: task.id,
    status: task.status,
    startedAt: task.startedAt
  });
});

app.post('/api/v1/tasks/:id/complete', (req: Request, res: Response) => {
  const task = taskQueue.get(req.params.id as string);
  const { result } = req.body;

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Completar tarea
  task.status = 'completed';
  task.completedAt = new Date().toISOString();
  if (result) task.result = result;

  logger.info({
    message: 'Task completed',
    taskId: task.id,
    type: task.type
  });

  res.status(200).json({
    taskId: task.id,
    status: task.status,
    completedAt: task.completedAt
  });
});

// =============================================================================
// RUTAS: MÉTRICAS (Placeholder para @metrics-monitor)
// =============================================================================

app.get('/api/v1/metrics', (req: Request, res: Response) => {
  const allTasks = Array.from(taskQueue.values());
  const completedTasks = allTasks.filter(t => t.status === 'completed');
  const failedTasks = allTasks.filter(t => t.status === 'failed');
  const runningTasks = allTasks.filter(t => t.status === 'running');

  res.status(200).json({
    timestamp: new Date().toISOString(),
    summary: {
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      failedTasks: failedTasks.length,
      runningTasks: runningTasks.length,
      successRate: allTasks.length > 0
        ? ((completedTasks.length / allTasks.length) * 100).toFixed(2) + '%'
        : 'N/A'
    },
    byType: {
      audit: allTasks.filter(t => t.type === 'audit').length,
      proposal: allTasks.filter(t => t.type === 'proposal').length,
      landing: allTasks.filter(t => t.type === 'landing').length,
      validate: allTasks.filter(t => t.type === 'validate').length,
      deploy: allTasks.filter(t => t.type === 'deploy').length
    }
  });
});

// =============================================================================
// RUTA RAÍZ
// =============================================================================

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'DealPulseHub API v1',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /api/v1/health',
      status: 'GET /api/v1/status',
      tasks: {
        create: 'POST /api/v1/tasks',
        list: 'GET /api/v1/tasks',
        get: 'GET /api/v1/tasks/:id',
        run: 'POST /api/v1/tasks/:id/run',
        complete: 'POST /api/v1/tasks/:id/complete'
      },
      metrics: 'GET /api/v1/metrics'
    }
  });
});

// =============================================================================
// 404 HANDLER
// =============================================================================

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// =============================================================================
// INICIAR SERVIDOR
// =============================================================================

app.listen(PORT, () => {
  logger.info(`
╔════════════════════════════════════════════════════════════╗
║  🚀 DealPulseHub API Server (FASE 1)                       ║
║  Listening on http://localhost:${PORT}                     ║
║  Health check: GET http://localhost:${PORT}/api/v1/health  ║
║  Status: GET http://localhost:${PORT}/api/v1/status        ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
