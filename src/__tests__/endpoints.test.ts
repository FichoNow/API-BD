/**
 * Tests de integración E2E — flujo completo de la API.
 *
 * Requisito: MySQL corriendo con la BD inicializada.
 * Cada test usa el estado del anterior (tokens, IDs...).
 * afterAll limpia todos los datos creados durante los tests.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'
import { pool } from '../database/pool.js'

// ── Datos de prueba ────────────────────────────────────────
const RUN   = Date.now()
const EMAIL = `test_${RUN}@test-e2e.com`
const PASS  = 'TestPass123!'

// Estado compartido entre tests
let accessToken  = ''
let refreshToken = ''
let companyId    = 0
let departmentId = 0
let userId       = 0
let projectId    = 0
let groupId      = 0
let leaveRequestId = 0
let fichajeId    = 0
let entryId      = 0
let breakId      = 0
let userToken    = ''   // token del usuario USER (no admin)
let createdSuperadminId = 0
let scheduleTemplateId  = 0
let scheduleGroupId     = 0
let userAssignmentId    = 0
let groupAssignmentId   = 0

// ── Limpieza ───────────────────────────────────────────────
afterAll(async () => {
  if (companyId) {
    await pool.query('DELETE FROM companies WHERE id = ?', [companyId])
  }
  await pool.end()
})

// ══════════════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════════════

describe('Auth — register', () => {
  it('rechaza body vacío con 400', async () => {
    const { status } = await request(app).post('/auth/register').send({})
    expect(status).toBe(400)
  })

  it('crea empresa y superadmin', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      company: {
        name:         `Empresa Test ${RUN}`,
        cif_nif:      `T${String(RUN).slice(-7)}`,
        email:        `empresa_${RUN}@test-e2e.com`,
        address_line: 'Calle Test 1',
        city:         'Barcelona',
        postal_code:  '08001',
      },
      user: {
        name:     'Admin Test',
        email:    EMAIL,
        password: PASS,
      },
    })

    expect(status).toBe(201)
    companyId    = body.data.company.id
    departmentId = body.data.department?.id ?? 0
    expect(companyId).toBeGreaterThan(0)
  })

  it('rechaza email duplicado con 409', async () => {
    const { status } = await request(app).post('/auth/register').send({
      company: { name: `Dup ${RUN}`, cif_nif: `D${String(RUN).slice(-7)}`, email: `dup_${RUN}@test.com`, address_line: 'X', city: 'X', postal_code: '00000' },
      user:    { name: 'Dup', email: EMAIL, password: PASS },
    })
    expect(status).toBe(409)
  })
})

describe('Auth — login', () => {
  it('rechaza credenciales incorrectas con 401', async () => {
    const { status } = await request(app).post('/auth/login').send({ email: EMAIL, password: 'wrong' })
    expect(status).toBe(401)
  })

  it('devuelve tokens con credenciales correctas', async () => {
    const { status, body } = await request(app).post('/auth/login').send({ email: EMAIL, password: PASS })
    expect(status).toBe(200)
    accessToken  = body.data.accessToken
    refreshToken = body.data.refreshToken
    expect(accessToken).toBeTruthy()
    expect(refreshToken).toBeTruthy()
    // Obtener departmentId del primer departamento
    if (!departmentId) departmentId = body.data.userData.department_id
  })
})

describe('Auth — refresh', () => {
  it('devuelve nuevos tokens con refreshToken válido', async () => {
    const { status, body } = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken })

    expect(status).toBe(200)
    accessToken  = body.data.accessToken
    refreshToken = body.data.refreshToken
    expect(accessToken).toBeTruthy()
  })
})

// ══════════════════════════════════════════════════════════
//  SUPERADMIN
// ══════════════════════════════════════════════════════════

describe('Superadmin — empresa', () => {
  it('GET /superadmin/company devuelve datos de la empresa', async () => {
    const { status, body } = await request(app)
      .get('/superadmin/company')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
    expect(body.data.id).toBe(companyId)
    expect(typeof body.data.name).toBe('string')
  })

  it('edita datos de la empresa', async () => {
    const { status } = await request(app)
      .patch('/superadmin/company')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ city: 'Madrid' })
    expect(status).toBe(200)
  })

  it('rechaza PATCH /superadmin/company con email inválido (400)', async () => {
    const { status } = await request(app)
      .patch('/superadmin/company')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ email: 'no-es-email' })
    expect(status).toBe(400)
  })
})

describe('Superadmin — superadmins', () => {
  it('GET /superadmin/superadmins devuelve la lista', async () => {
    const { status, body } = await request(app)
      .get('/superadmin/superadmins')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBeGreaterThan(0)
  })

  it('rechaza POST /superadmin/superadmin con body inválido (400)', async () => {
    const { status } = await request(app)
      .post('/superadmin/superadmin')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: '', email: 'mal', password: '123' })
    expect(status).toBe(400)
  })

  it('crea un nuevo superadmin', async () => {
    const { status, body } = await request(app)
      .post('/superadmin/superadmin')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name:     `Super Test ${RUN}`,
        email:    `super_${RUN}@test-e2e.com`,
        password: 'SuperPass123!',
      })
    expect(status).toBe(201)
    expect(body.data.id).toBeGreaterThan(0)
    createdSuperadminId = body.data.id
  })

  it('rechaza email duplicado al crear superadmin (409)', async () => {
    const { status } = await request(app)
      .post('/superadmin/superadmin')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name:     'Super Dup',
        email:    `super_${RUN}@test-e2e.com`,
        password: 'SuperPass123!',
      })
    expect(status).toBe(409)
  })

  it('PATCH /superadmin/superadmin/:id renombra el superadmin creado', async () => {
    const { status, body } = await request(app)
      .patch(`/superadmin/superadmin/${createdSuperadminId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: `Super Renombrado ${RUN}` })
    expect(status).toBe(200)
    expect(body.data.id).toBe(createdSuperadminId)
  })

  it('rechaza PATCH /superadmin/superadmin/:id con body vacío (400)', async () => {
    const { status } = await request(app)
      .patch(`/superadmin/superadmin/${createdSuperadminId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
    expect(status).toBe(400)
  })

  it('DELETE /superadmin/superadmin/:id elimina el superadmin no-owner', async () => {
    const { status } = await request(app)
      .delete(`/superadmin/superadmin/${createdSuperadminId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })
})

describe('Superadmin — departamento', () => {
  it('rechaza nombre vacío con 400', async () => {
    const { status } = await request(app)
      .post('/superadmin/department')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: '' })
    expect(status).toBe(400)
  })

  it('crea un nuevo departamento', async () => {
    const { status, body } = await request(app)
      .post('/superadmin/department')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: `Dept Test ${RUN}` })
    expect(status).toBe(201)
    departmentId = body.data.id
    expect(departmentId).toBeGreaterThan(0)
  })

  it('rechaza nombre duplicado con 409', async () => {
    const { status } = await request(app)
      .post('/superadmin/department')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: `Dept Test ${RUN}` })
    expect(status).toBe(409)
  })

  it('PATCH /superadmin/department/:id renombra el departamento', async () => {
    const { status, body } = await request(app)
      .patch(`/superadmin/department/${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: `Dept Renombrado ${RUN}` })
    expect(status).toBe(200)
    expect(body.data.id).toBe(departmentId)
  })

  it('rechaza PATCH /superadmin/department con id inválido (400)', async () => {
    const { status } = await request(app)
      .patch('/superadmin/department/abc')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Whatever' })
    expect(status).toBe(400)
  })
})

// ══════════════════════════════════════════════════════════
//  ADMIN — Overview
// ══════════════════════════════════════════════════════════

describe('Admin — overview', () => {
  it('devuelve empresa y departamentos', async () => {
    const { status, body } = await request(app)
      .get('/admin/company-info')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
    expect(body.data.departments.length).toBeGreaterThan(0)
  })
})

// ══════════════════════════════════════════════════════════
//  ADMIN — Usuarios
// ══════════════════════════════════════════════════════════

describe('Admin — usuarios', () => {
  it('lista usuarios del departamento', async () => {
    const { status, body } = await request(app)
      .get(`/admin/users?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
  })

  it('crea un usuario en el departamento', async () => {
    const { status, body } = await request(app)
      .post('/admin/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        department_id: departmentId,
        group_id:      null,
        name:          'Usuario Test',
        email:         `user_${RUN}@test-e2e.com`,
        password:      'UserPass123!',
        role:          'USER',
        is_active:     true,
      })
    expect(status).toBe(201)
    userId = body.data.id
    expect(userId).toBeGreaterThan(0)
  })

  it('edita el usuario creado', async () => {
    const { status } = await request(app)
      .patch(`/admin/user/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Usuario Editado' })
    expect(status).toBe(200)
  })

  it('rechaza POST /admin/users (bulk) con menos de 2 elementos (400)', async () => {
    const { status } = await request(app)
      .post('/admin/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send([
        { department_id: departmentId, group_id: null, name: 'Solo', email: `solo_${RUN}@test-e2e.com`, password: 'BulkPass123!', role: 'USER', is_active: true },
      ])
    expect(status).toBe(400)
  })

  it('crea varios usuarios en bulk', async () => {
    const { status, body } = await request(app)
      .post('/admin/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send([
        { department_id: departmentId, group_id: null, name: 'Bulk 1', email: `bulk1_${RUN}@test-e2e.com`, password: 'BulkPass123!', role: 'USER', is_active: true },
        { department_id: departmentId, group_id: null, name: 'Bulk 2', email: `bulk2_${RUN}@test-e2e.com`, password: 'BulkPass123!', role: 'USER', is_active: true },
      ])
    expect(status).toBe(201)
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBe(2)
  })
})

// ══════════════════════════════════════════════════════════
//  ADMIN — Proyectos
// ══════════════════════════════════════════════════════════

describe('Admin — proyectos', () => {
  it('lista proyectos del departamento', async () => {
    const { status, body } = await request(app)
      .get(`/admin/projects?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
  })

  it('rechaza GET /admin/projects sin departmentId (400)', async () => {
    const { status } = await request(app)
      .get('/admin/projects')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(400)
  })

  it('crea un proyecto', async () => {
    const { status, body } = await request(app)
      .post('/admin/project')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ department_id: departmentId, group_id: null, name: `Proyecto Test ${RUN}`, is_active: true })
    expect(status).toBe(201)
    projectId = body.data.id
    expect(projectId).toBeGreaterThan(0)
  })

  it('edita el proyecto creado', async () => {
    const { status } = await request(app)
      .patch(`/admin/project/${projectId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: `Proyecto Editado ${RUN}` })
    expect(status).toBe(200)
  })
})

// ══════════════════════════════════════════════════════════
//  ADMIN — Solicitudes
// ══════════════════════════════════════════════════════════

describe('Admin — solicitudes', () => {
  it('lista solicitudes del departamento', async () => {
    const { status, body } = await request(app)
      .get(`/admin/requests?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════
//  ADMIN — Stats
// ══════════════════════════════════════════════════════════

describe('Admin — stats', () => {
  it('devuelve stats del departamento', async () => {
    const { status, body } = await request(app)
      .get(`/admin/stats/overview?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
    expect(typeof body.data.total_minutes).toBe('number')
    expect(typeof body.data.punctuality_rate).toBe('number')
  })

  it('devuelve stats del usuario creado', async () => {
    const { status, body } = await request(app)
      .get(`/admin/stats/user/${userId}?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
    expect(typeof body.data.total_minutes).toBe('number')
  })

  it('GET /admin/stats/overview', async () => {
    const { status } = await request(app)
      .get(`/admin/stats/overview?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })

  it('GET /admin/stats/ranking', async () => {
    const { status, body } = await request(app)
      .get(`/admin/stats/ranking?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data.employees)).toBe(true)
  })

  it('GET /admin/stats/projects-period', async () => {
    const { status } = await request(app)
      .get(`/admin/stats/projects-period?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })

  it('GET /admin/stats/active-now', async () => {
    const { status } = await request(app)
      .get(`/admin/stats/active-now?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })

  it('GET /admin/stats/hourly', async () => {
    const { status } = await request(app)
      .get(`/admin/stats/hourly?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })

  it('GET /admin/stats/absences', async () => {
    const { status } = await request(app)
      .get(`/admin/stats/absences?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })

  it('GET /admin/stats/top-days', async () => {
    const { status } = await request(app)
      .get(`/admin/stats/top-days?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })

  it('GET /admin/stats/breaks', async () => {
    const { status } = await request(app)
      .get(`/admin/stats/breaks?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })

  it('GET /admin/stats/overtime-yearly', async () => {
    const { status } = await request(app)
      .get(`/admin/stats/overtime-yearly?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })

  it('GET /admin/stats/groups', async () => {
    const { status } = await request(app)
      .get(`/admin/stats/groups?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })

  it('GET /admin/stats/projects', async () => {
    const { status } = await request(app)
      .get(`/admin/stats/projects?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })

  it('GET /admin/stats/project', async () => {
    const projectName = `Proyecto Editado ${RUN}`
    const { status } = await request(app)
      .get(`/admin/stats/project?departmentId=${departmentId}&projectName=${encodeURIComponent(projectName)}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })

  it('GET /admin/stats/user-project-hours', async () => {
    const { status, body } = await request(app)
      .get(`/admin/stats/user-project-hours?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data.rows)).toBe(true)
  })

  it('rechaza GET /admin/stats/user-project-hours sin departmentId (400)', async () => {
    const { status } = await request(app)
      .get('/admin/stats/user-project-hours')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(400)
  })
})

// ══════════════════════════════════════════════════════════
//  ADMIN — Grupos
// ══════════════════════════════════════════════════════════

describe('Admin — grupos', () => {
  it('lista grupos del departamento', async () => {
    const { status, body } = await request(app)
      .get(`/admin/groups?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
  })

  it('rechaza POST /admin/group sin nombre (400)', async () => {
    const { status } = await request(app)
      .post('/admin/group')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ department_id: departmentId, name: '' })
    expect(status).toBe(400)
  })

  it('crea un grupo', async () => {
    const { status, body } = await request(app)
      .post('/admin/group')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ department_id: departmentId, name: `Grupo Test ${RUN}` })
    expect(status).toBe(201)
    groupId = body.data.id
    expect(groupId).toBeGreaterThan(0)
  })

  it('renombra el grupo', async () => {
    const { status } = await request(app)
      .patch(`/admin/group/${groupId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: `Grupo Renombrado ${RUN}` })
    expect(status).toBe(200)
  })

  it('elimina el grupo', async () => {
    const { status } = await request(app)
      .delete(`/admin/group/${groupId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })
})

// ══════════════════════════════════════════════════════════
//  ADMIN — Schedules (plantillas y asignaciones)
// ══════════════════════════════════════════════════════════

describe('Admin — schedules', () => {
  const sevenDays = [
    { weekday: 1, is_working_day: true,  start_time: '09:00:00', end_time: '18:00:00', break_minutes: 60 },
    { weekday: 2, is_working_day: true,  start_time: '09:00:00', end_time: '18:00:00', break_minutes: 60 },
    { weekday: 3, is_working_day: true,  start_time: '09:00:00', end_time: '18:00:00', break_minutes: 60 },
    { weekday: 4, is_working_day: true,  start_time: '09:00:00', end_time: '18:00:00', break_minutes: 60 },
    { weekday: 5, is_working_day: true,  start_time: '09:00:00', end_time: '15:00:00', break_minutes: 0 },
    { weekday: 6, is_working_day: false, start_time: null,        end_time: null,        break_minutes: 0 },
    { weekday: 7, is_working_day: false, start_time: null,        end_time: null,        break_minutes: 0 },
  ]

  it('GET /admin/schedules lista plantillas del departamento', async () => {
    const { status, body } = await request(app)
      .get(`/admin/schedules?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
  })

  it('rechaza POST /admin/schedule con días incompletos (400)', async () => {
    const { status } = await request(app)
      .post('/admin/schedule')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ department_id: departmentId, name: 'Bad', is_active: true, days: sevenDays.slice(0, 5) })
    expect(status).toBe(400)
  })

  it('crea una plantilla de horario', async () => {
    const { status, body } = await request(app)
      .post('/admin/schedule')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        department_id: departmentId,
        name:          `Plantilla Test ${RUN}`,
        description:   'Plantilla creada por test',
        is_active:     true,
        days:          sevenDays,
      })
    expect(status).toBe(201)
    scheduleTemplateId = body.data.id
    expect(scheduleTemplateId).toBeGreaterThan(0)
  })

  it('PUT /admin/schedule/:id edita la plantilla', async () => {
    const { status } = await request(app)
      .put(`/admin/schedule/${scheduleTemplateId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name:        `Plantilla Renombrada ${RUN}`,
        description: 'Editada',
        is_active:   true,
        days:        sevenDays,
      })
    expect(status).toBe(200)
  })

  it('GET /admin/schedule/assignments devuelve listas vacías iniciales', async () => {
    const { status, body } = await request(app)
      .get(`/admin/schedule/assignments?departmentId=${departmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data.user_assignments)).toBe(true)
    expect(Array.isArray(body.data.group_assignments)).toBe(true)
  })

  it('crea grupo y usuario para asignaciones', async () => {
    const g = await request(app)
      .post('/admin/group')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ department_id: departmentId, name: `Grupo Sched ${RUN}` })
    expect(g.status).toBe(201)
    scheduleGroupId = g.body.data.id
  })

  it('POST /admin/schedule/group-assignment asigna plantilla a grupo', async () => {
    const { status, body } = await request(app)
      .post('/admin/schedule/group-assignment')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        group_id:    scheduleGroupId,
        template_id: scheduleTemplateId,
        start_date:  '2099-01-01',
        end_date:    null,
      })
    expect(status).toBe(201)
    groupAssignmentId = body.data.id
    expect(groupAssignmentId).toBeGreaterThan(0)
  })

  it('POST /admin/schedule/user-assignment asigna plantilla a usuario', async () => {
    const { status, body } = await request(app)
      .post('/admin/schedule/user-assignment')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        user_id:     userId,
        template_id: scheduleTemplateId,
        start_date:  '2099-01-01',
        end_date:    null,
      })
    expect(status).toBe(201)
    userAssignmentId = body.data.id
    expect(userAssignmentId).toBeGreaterThan(0)
  })

  it('rechaza user-assignment con end_date < start_date (400)', async () => {
    const { status } = await request(app)
      .post('/admin/schedule/user-assignment')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        user_id:     userId,
        template_id: scheduleTemplateId,
        start_date:  '2099-06-01',
        end_date:    '2099-05-01',
      })
    expect(status).toBe(400)
  })

  it('DELETE /admin/schedule/user-assignment/:id', async () => {
    const { status } = await request(app)
      .delete(`/admin/schedule/user-assignment/${userAssignmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })

  it('DELETE /admin/schedule/group-assignment/:id', async () => {
    const { status } = await request(app)
      .delete(`/admin/schedule/group-assignment/${groupAssignmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })
})

// ══════════════════════════════════════════════════════════
//  ADMIN — Solicitudes (approve / reject)
// ══════════════════════════════════════════════════════════

describe('Admin — solicitudes (approve/reject)', () => {
  // Creamos un par de solicitudes para luego aprobarlas/rechazarlas.
  // Nos logueamos primero como el USER creado antes.
  let pendingId1 = 0
  let pendingId2 = 0

  it('login como usuario USER', async () => {
    const { status, body } = await request(app)
      .post('/auth/login')
      .send({ email: `user_${RUN}@test-e2e.com`, password: 'UserPass123!' })
    expect(status).toBe(200)
    userToken = body.data.accessToken
    expect(userToken).toBeTruthy()
  })

  it('crea solicitudes pendientes para luego revisarlas', async () => {
    const r1 = await request(app)
      .post('/user/requests')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        type: 'VACATION',
        start_date: '2099-08-10',
        end_date:   '2099-08-12',
      })
    expect(r1.status).toBe(201)
    pendingId1 = r1.body.data.id

    const r2 = await request(app)
      .post('/user/requests')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        type: 'PERMISSION',
        start_date: '2099-09-05',
        end_date:   '2099-09-05',
      })
    expect(r2.status).toBe(201)
    pendingId2 = r2.body.data.id
  })

  it('aprueba una solicitud', async () => {
    const { status } = await request(app)
      .patch(`/admin/requests/${pendingId1}/approve`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ review_comment: 'Aprobada en test' })
    expect(status).toBe(200)
  })

  it('rechaza una solicitud', async () => {
    const { status } = await request(app)
      .patch(`/admin/requests/${pendingId2}/reject`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ review_comment: 'Rechazada en test' })
    expect(status).toBe(200)
  })
})

// ══════════════════════════════════════════════════════════
//  USER — Profile
// ══════════════════════════════════════════════════════════

describe('User — profile', () => {
  it('PATCH /user/update cambia el nombre', async () => {
    const { status } = await request(app)
      .patch('/user/update')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Usuario Renombrado' })
    expect(status).toBe(200)
  })

  it('rechaza PATCH /user/update con body vacío (400)', async () => {
    const { status } = await request(app)
      .patch('/user/update')
      .set('Authorization', `Bearer ${userToken}`)
      .send({})
    expect(status).toBe(400)
  })
})

// ══════════════════════════════════════════════════════════
//  USER — Calendar
// ══════════════════════════════════════════════════════════

describe('User — calendar', () => {
  it('GET /user/calendar devuelve calendario del mes', async () => {
    const now = new Date()
    const { status } = await request(app)
      .get(`/user/calendar?year=${now.getFullYear()}&month=${now.getMonth() + 1}`)
      .set('Authorization', `Bearer ${userToken}`)
    // 200 si el usuario tiene horario asignado, 404 (SCHEDULE_NOT_FOUND) si no.
    // En el flujo del test no se asigna plantilla de horario, así que 404 es válido.
    expect([200, 404]).toContain(status)
  })
})

// ══════════════════════════════════════════════════════════
//  USER — Projects
// ══════════════════════════════════════════════════════════

describe('User — projects', () => {
  it('GET /user/projects devuelve proyectos accesibles', async () => {
    const { status, body } = await request(app)
      .get('/user/projects')
      .set('Authorization', `Bearer ${userToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════
//  USER — Leave Requests (CRUD)
// ══════════════════════════════════════════════════════════

describe('User — leave requests', () => {
  it('GET /user/requests lista las solicitudes del usuario', async () => {
    const { status, body } = await request(app)
      .get('/user/requests')
      .set('Authorization', `Bearer ${userToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
  })

  it('rechaza POST /user/requests con body inválido (400)', async () => {
    const { status } = await request(app)
      .post('/user/requests')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ type: 'INVALIDO', start_date: '2099-01-01', end_date: '2099-01-02' })
    expect(status).toBe(400)
  })

  it('crea una nueva solicitud de día libre', async () => {
    const { status, body } = await request(app)
      .post('/user/requests')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        type: 'DAY_OFF',
        start_date: '2099-10-15',
        end_date:   '2099-10-15',
        comment:    'Test',
      })
    expect(status).toBe(201)
    leaveRequestId = body.data.id
    expect(leaveRequestId).toBeGreaterThan(0)
  })

  it('cancela la solicitud creada', async () => {
    const { status } = await request(app)
      .delete(`/user/requests/${leaveRequestId}`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(status).toBe(200)
  })
})

// ══════════════════════════════════════════════════════════
//  USER — Fichajes (CRUD)
// ══════════════════════════════════════════════════════════

describe('User — fichajes', () => {
  it('GET /user/fichajes lista los fichajes del usuario', async () => {
    const { status, body } = await request(app)
      .get('/user/fichajes')
      .set('Authorization', `Bearer ${userToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
  })

  it('rechaza POST /user/fichajes sin clock_in (400)', async () => {
    const { status } = await request(app)
      .post('/user/fichajes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({})
    expect(status).toBe(400)
  })

  // Guardamos el clock_in para garantizar que el clock_out posterior sea estrictamente mayor.
  let fichajeClockIn = ''

  it('crea un fichaje (clock-in)', async () => {
    fichajeClockIn = new Date(Date.now() - 60 * 60 * 1000).toISOString() // hace 1 hora
    const { status, body } = await request(app)
      .post('/user/fichajes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ clock_in: fichajeClockIn })
    expect(status).toBe(201)
    fichajeId = body.data.id
    expect(fichajeId).toBeGreaterThan(0)
  })

  it('marca clock_in como modificado', async () => {
    const { status } = await request(app)
      .patch(`/user/fichajes/${fichajeId}/clock-in/modified`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ clock_in: new Date(Date.now() - 50 * 60 * 1000).toISOString() })
    expect(status).toBe(200)
  })

  it('hace clock-out del fichaje', async () => {
    const { status } = await request(app)
      .patch(`/user/fichajes/${fichajeId}/clock-out`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ clock_out: new Date().toISOString() })
    expect(status).toBe(200)
  })

  it('marca clock_out como modificado', async () => {
    const { status } = await request(app)
      .patch(`/user/fichajes/${fichajeId}/clock-out/modified`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ clock_out: new Date().toISOString() })
    expect(status).toBe(200)
  })

  it('DELETE /user/fichajes/:id elimina un fichaje del usuario', async () => {
    // Crea un fichaje específicamente para borrarlo
    const created = await request(app)
      .post('/user/fichajes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ clock_in: new Date(Date.now() - 30 * 60 * 1000).toISOString() })
    expect(created.status).toBe(201)
    const idToDelete = created.body.data.id

    const { status } = await request(app)
      .delete(`/user/fichajes/${idToDelete}`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(status).toBe(200)
  })
})

// ══════════════════════════════════════════════════════════
//  USER — Fichaje Entries
// ══════════════════════════════════════════════════════════

describe('User — fichaje entries', () => {
  // Creamos un nuevo fichaje abierto para poder añadirle entries.
  let openFichajeId = 0

  it('crea un fichaje abierto para los entries', async () => {
    const { status, body } = await request(app)
      .post('/user/fichajes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ clock_in: new Date().toISOString() })
    expect(status).toBe(201)
    openFichajeId = body.data.id
  })

  it('crea una entry en el fichaje', async () => {
    const { status, body } = await request(app)
      .post(`/user/fichajes/${openFichajeId}/entries`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ project_id: projectId, started_at: new Date().toISOString() })
    expect(status).toBe(201)
    entryId = body.data.id
    expect(entryId).toBeGreaterThan(0)
  })

  it('lista las entries del fichaje', async () => {
    const { status, body } = await request(app)
      .get(`/user/fichajes/${openFichajeId}/entries`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
  })

  it('PATCH /user/fichajes/:id/entries/:entryId/start cambia started_at', async () => {
    const { status } = await request(app)
      .patch(`/user/fichajes/${openFichajeId}/entries/${entryId}/start`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ started_at: new Date(Date.now() - 5 * 60 * 1000).toISOString() })
    expect(status).toBe(200)
  })

  it('PATCH /user/fichajes/:id/entries/:entryId/project cambia el proyecto', async () => {
    const { status } = await request(app)
      .patch(`/user/fichajes/${openFichajeId}/entries/${entryId}/project`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ project_id: projectId })
    expect(status).toBe(200)
  })

  it('cierra una entry', async () => {
    const { status } = await request(app)
      .patch(`/user/fichajes/${openFichajeId}/entries/${entryId}/end`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ ended_at: new Date().toISOString() })
    expect(status).toBe(200)
  })

  it('cierra el fichaje del entry', async () => {
    await request(app)
      .patch(`/user/fichajes/${openFichajeId}/clock-out`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ clock_out: new Date().toISOString() })
  })
})

// ══════════════════════════════════════════════════════════
//  USER — Fichaje Breaks
// ══════════════════════════════════════════════════════════

describe('User — fichaje breaks', () => {
  let breakFichajeId = 0

  it('crea un fichaje abierto para los breaks', async () => {
    const { status, body } = await request(app)
      .post('/user/fichajes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ clock_in: new Date().toISOString() })
    expect(status).toBe(201)
    breakFichajeId = body.data.id
  })

  it('crea un break', async () => {
    const { status, body } = await request(app)
      .post(`/user/fichajes/${breakFichajeId}/breaks`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ started_at: new Date().toISOString() })
    expect(status).toBe(201)
    breakId = body.data.id
    expect(breakId).toBeGreaterThan(0)
  })

  it('lista los breaks del fichaje', async () => {
    const { status, body } = await request(app)
      .get(`/user/fichajes/${breakFichajeId}/breaks`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
  })

  it('cierra el break', async () => {
    const { status } = await request(app)
      .patch(`/user/fichajes/${breakFichajeId}/breaks/${breakId}/end`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ ended_at: new Date().toISOString() })
    expect(status).toBe(200)
  })

  it('cierra el fichaje del break', async () => {
    await request(app)
      .patch(`/user/fichajes/${breakFichajeId}/clock-out`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ clock_out: new Date().toISOString() })
  })
})

// ══════════════════════════════════════════════════════════
//  ADMIN — Limpieza (delete user, fichajes)
// ══════════════════════════════════════════════════════════

describe('Admin — limpieza usuarios', () => {
  it('elimina el usuario USER creado', async () => {
    const { status } = await request(app)
      .delete(`/admin/user/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(200)
  })
})

// ══════════════════════════════════════════════════════════
//  USER — Logout (al final, después de usar el token)
// ══════════════════════════════════════════════════════════
// El usuario fue eliminado, así que no podemos llamar logout aquí.
// El logout se prueba con el superadmin al final.

describe('Auth — logout (superadmin)', () => {
  it('DELETE /user/logout invalida el refresh token', async () => {
    const { status } = await request(app)
      .delete('/user/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken })
    expect(status).toBe(200)
  })
})
