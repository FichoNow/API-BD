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
  it('edita datos de la empresa', async () => {
    const { status } = await request(app)
      .patch('/superadmin/company')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ city: 'Madrid' })
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
})

// ══════════════════════════════════════════════════════════
//  ADMIN — Proyectos
// ══════════════════════════════════════════════════════════

describe('Admin — proyectos', () => {
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
      .get(`/admin/stats/department?departmentId=${departmentId}`)
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
})
