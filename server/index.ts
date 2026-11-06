import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, lte, gte, or } from 'drizzle-orm';
import * as schema from './db/schema';
import { INITIAL_CARS, INITIAL_BOOKINGS, DRIVER_RATE_PER_DAY, DELIVERY_RATE } from '../data/dummy';

export type Bindings = {
  DB: D1Database;
  FRONTEND_URL?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors({
  origin: (origin, c) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      c.env.FRONTEND_URL,
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.some(allowed => origin.includes(allowed as string))) {
      return origin || '*';
    }
    return allowedOrigins[0] as string;
  },
  credentials: true,
}));

function getDb(env: Bindings) {
  return drizzle(env.DB, { schema });
}

// 1. GET ALL CARS (with anti-overlapping date filter)
app.get('/api/cars', async (c) => {
  const db = getDb(c.env);
  const category = c.req.query('category');
  const transmission = c.req.query('transmission');
  const seats = c.req.query('seats');
  const startDate = c.req.query('start_date');
  const endDate = c.req.query('end_date');
  const onlyAvailable = c.req.query('only_available') === 'true';

  let allCars = await db.select().from(schema.cars).all();

  // If table empty, auto-seed
  if (allCars.length === 0) {
    for (const car of INITIAL_CARS) {
      await db.insert(schema.cars).values({
        id: car.id,
        name: car.name,
        brand: car.brand,
        category: car.category,
        transmission: car.transmission,
        seats: car.seats,
        luggage: car.luggage,
        fuelType: car.fuelType,
        pricePerDay: car.pricePerDay,
        plateNumber: car.plateNumber,
        year: car.year,
        imageUrl: car.imageUrl,
        features: car.features,
        status: car.status,
        description: car.description,
        createdAt: new Date().toISOString()
      }).run();
    }
    allCars = await db.select().from(schema.cars).all();
  }

  // Check anti-overlap if dates provided: only active bookings (Pending Verification & Approved) block the car.
  let bookedCarIds = new Set<string>();
  if (startDate && endDate) {
    const overlappingBookings = await db
      .select({ carId: schema.bookings.carId })
      .from(schema.bookings)
      .where(
        and(
          or(
            eq(schema.bookings.status, 'Pending Verification'),
            eq(schema.bookings.status, 'Approved'),
            eq(schema.bookings.status, 'Ongoing')
          ),
          lte(schema.bookings.startDate, endDate),
          gte(schema.bookings.endDate, startDate)
        )
      )
      .all();

    bookedCarIds = new Set(overlappingBookings.map((b) => b.carId));
  }

  const result = allCars
    .filter((car) => {
      if (category && category !== 'Semua' && car.category !== category) return false;
      if (transmission && transmission !== 'Semua' && car.transmission !== transmission) return false;
      if (seats && seats !== 'Semua' && car.seats.toString() !== seats) return false;

      const isBooked = bookedCarIds.has(car.id);
      if (onlyAvailable && (isBooked || car.status !== 'Ready')) return false;

      return true;
    })
    .map((car) => ({
      ...car,
      isAvailable: !bookedCarIds.has(car.id) && car.status === 'Ready'
    }));

  return c.json({ success: true, data: result });
});

// 2. GET CAR BY ID
app.get('/api/cars/:id', async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const car = await db.select().from(schema.cars).where(eq(schema.cars.id, id)).get();

  if (!car) {
    return c.json({ success: false, message: 'Armada tidak ditemukan' }, 404);
  }

  return c.json({ success: true, data: car });
});

// 3. CREATE NEW CAR (ADMIN)
app.post('/api/cars', async (c) => {
  const db = getDb(c.env);
  const body = await c.req.json();

  const id = `car-${Date.now()}`;
  await db.insert(schema.cars).values({
    id,
    name: body.name,
    brand: body.brand,
    category: body.category,
    transmission: body.transmission,
    seats: Number(body.seats),
    luggage: Number(body.luggage || 3),
    fuelType: body.fuelType || 'Bensin',
    pricePerDay: Number(body.pricePerDay),
    plateNumber: body.plateNumber,
    year: Number(body.year),
    imageUrl: body.imageUrl,
    features: body.features || ['AC', 'Audio Touchscreen', 'Airbag'],
    status: body.status || 'Ready',
    description: body.description || '',
    createdAt: new Date().toISOString()
  }).run();

  const created = await db.select().from(schema.cars).where(eq(schema.cars.id, id)).get();
  return c.json({ success: true, data: created }, 201);
});

// 4. UPDATE CAR / STATUS (ADMIN)
app.put('/api/cars/:id', async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const body = await c.req.json();

  await db.update(schema.cars).set({
    name: body.name,
    brand: body.brand,
    category: body.category,
    transmission: body.transmission,
    seats: body.seats !== undefined ? Number(body.seats) : undefined,
    luggage: body.luggage !== undefined ? Number(body.luggage) : undefined,
    fuelType: body.fuelType,
    pricePerDay: body.pricePerDay !== undefined ? Number(body.pricePerDay) : undefined,
    plateNumber: body.plateNumber,
    year: body.year !== undefined ? Number(body.year) : undefined,
    imageUrl: body.imageUrl,
    features: body.features,
    status: body.status,
    description: body.description
  }).where(eq(schema.cars.id, id)).run();

  const updated = await db.select().from(schema.cars).where(eq(schema.cars.id, id)).get();
  return c.json({ success: true, data: updated });
});

// 5. DELETE CAR (ADMIN)
app.delete('/api/cars/:id', async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');

  // Guard: Protect owner & customer from deleting a car with active bookings
  const activeBookings = await db
    .select()
    .from(schema.bookings)
    .where(
      and(
        eq(schema.bookings.carId, id),
        or(
          eq(schema.bookings.status, 'Pending Verification'),
          eq(schema.bookings.status, 'Approved')
        )
      )
    )
    .all();

  if (activeBookings.length > 0) {
    return c.json({
      success: false,
      message: 'Tidak dapat menghapus armada yang sedang memiliki pesanan aktif atau belum selesai.'
    }, 400);
  }

  await db.delete(schema.cars).where(eq(schema.cars.id, id)).run();
  return c.json({ success: true, message: 'Armada berhasil dihapus' });
});

// 6. CREATE BOOKING (with Anti-Overlapping validation)
app.post('/api/bookings', async (c) => {
  const db = getDb(c.env);
  const body = await c.req.json();

  const {
    carId,
    customerName,
    customerPhone,
    customerAddress,
    serviceType,
    deliveryLocation,
    startDate,
    endDate,
    ktpUrl,
    simUrl
  } = body;

  if (!carId || !customerName || !customerPhone || !startDate || !endDate) {
    return c.json({ success: false, message: 'Data booking belum lengkap' }, 400);
  }

  // Guard: Date boundary validation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start < today) {
    return c.json({ success: false, message: 'Tanggal mulai tidak boleh di masa lalu.' }, 400);
  }
  
  if (startDate > endDate) {
    return c.json({ success: false, message: 'Tanggal mulai tidak boleh lebih lambat dari tanggal selesai.' }, 400);
  }

  // 1. Check Car existence & maintenance status
  const car = await db.select().from(schema.cars).where(eq(schema.cars.id, carId)).get();
  if (!car) {
    return c.json({ success: false, message: 'Armada tidak ditemukan' }, 404);
  }

  if (car.status === 'Maintenance') {
    return c.json({ success: false, message: 'Armada sedang dalam perawatan bengkel dan tidak dapat disewa.' }, 400);
  }

  // 2. Anti-Overlapping Check in D1: Only active bookings (Pending Verification & Approved) block the unit.
  const overlap = await db
    .select()
    .from(schema.bookings)
    .where(
      and(
        eq(schema.bookings.carId, carId),
        or(
          eq(schema.bookings.status, 'Pending Verification'),
          eq(schema.bookings.status, 'Approved'),
          eq(schema.bookings.status, 'Ongoing')
        ),
        lte(schema.bookings.startDate, endDate),
        gte(schema.bookings.endDate, startDate)
      )
    )
    .get();

  if (overlap) {
    return c.json({
      success: false,
      message: 'Mobil ini sudah terbooking di rentang tanggal tersebut. Silakan pilih tanggal lain.'
    }, 409);
  }

  // 3. Price calculation
  const s = new Date(startDate);
  const e = new Date(endDate);
  const diffDays = Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const rentalFee = car.pricePerDay * diffDays;
  const driverFee = serviceType === 'Dengan Driver' ? DRIVER_RATE_PER_DAY * diffDays : 0;
  const deliveryFee = deliveryLocation ? DELIVERY_RATE : 0;
  const totalPrice = rentalFee + driverFee + deliveryFee;
  const dpAmount = Math.round(totalPrice * 0.3);
  const remainingAmount = totalPrice - dpAmount;

  const bookingId = body.id || `BK-${Date.now().toString().slice(-6)}`;

  await db.insert(schema.bookings).values({
    id: bookingId,
    carId: car.id,
    carName: car.name,
    carPlate: car.plateNumber,
    customerName,
    customerPhone,
    customerAddress,
    serviceType: serviceType || 'Lepas Kunci',
    deliveryLocation: deliveryLocation || null,
    startDate,
    endDate,
    totalDays: diffDays,
    dailyPrice: car.pricePerDay,
    driverFee,
    deliveryFee,
    totalPrice,
    dpAmount,
    remainingAmount,
    paymentStatus: 'Menunggu DP',
    status: 'Pending Verification',
    ktpUrl: ktpUrl || null,
    simUrl: simUrl || null,
    createdAt: new Date().toISOString()
  }).run();

  const createdBooking = await db.select().from(schema.bookings).where(eq(schema.bookings.id, bookingId)).get();
  return c.json({ success: true, data: createdBooking }, 201);
});

// 7. GET SINGLE BOOKING BY ID (CUSTOMER RECEIPT /pesanan/:id)
app.get('/api/bookings/:id', async (c) => {
  const db = getDb(c.env);
  const rawId = c.req.param('id') || '';
  const id = rawId.trim();

  const booking = await db.select().from(schema.bookings).where(
    or(
      eq(schema.bookings.id, id),
      eq(schema.bookings.id, id.toUpperCase()),
      eq(schema.bookings.id, id.toLowerCase())
    )
  ).get();

  if (!booking) {
    return c.json({ success: false, message: 'Pesanan tidak ditemukan' }, 404);
  }
  return c.json({ success: true, data: booking });
});

// 8. GET ALL BOOKINGS (ADMIN)
app.get('/api/bookings', async (c) => {
  const db = getDb(c.env);
  const status = c.req.query('status');

  let list = await db.select().from(schema.bookings).all();

  if (status && status !== 'All') {
    list = list.filter((b) => b.status === status);
  }

  return c.json({ success: true, data: list });
});

// 9. UPDATE BOOKING STATUS (ADMIN) + Auto-sync Car Status
app.patch('/api/bookings/:id/status', async (c) => {
  const db = getDb(c.env);
  const rawId = c.req.param('id') || '';
  const id = rawId.trim();
  const { status, paymentStatus } = await c.req.json();

  const booking = await db.select().from(schema.bookings).where(
    or(
      eq(schema.bookings.id, id),
      eq(schema.bookings.id, id.toUpperCase()),
      eq(schema.bookings.id, id.toLowerCase())
    )
  ).get();

  if (!booking) {
    return c.json({ success: false, message: 'Booking tidak ditemukan' }, 404);
  }

  const updateData: Record<string, string> = {};
  if (status) updateData.status = status;

  if (paymentStatus) {
    updateData.paymentStatus = paymentStatus;
  } else if (status === 'Approved') {
    updateData.paymentStatus = 'DP Dikonfirmasi';
  } else if (status === 'Ongoing') {
    updateData.paymentStatus = 'Pelunasan Dikonfirmasi';
  } else if (status === 'Completed') {
    updateData.paymentStatus = 'Lunas';
  } else if (status === 'Cancelled') {
    updateData.paymentStatus = 'Dibatalkan';
  }

  await db.update(schema.bookings).set(updateData).where(
    or(
      eq(schema.bookings.id, id),
      eq(schema.bookings.id, id.toUpperCase()),
      eq(schema.bookings.id, id.toLowerCase())
    )
  ).run();

  // Auto-sync car status
  if (status === 'Ongoing') {
    await db.update(schema.cars).set({ status: 'Booked' }).where(eq(schema.cars.id, booking.carId)).run();
  } else if (status === 'Completed' || status === 'Cancelled') {
    const otherActiveBookings = await db
      .select()
      .from(schema.bookings)
      .where(
        and(
          eq(schema.bookings.carId, booking.carId),
          or(
            eq(schema.bookings.status, 'Pending Verification'),
            eq(schema.bookings.status, 'Approved'),
            eq(schema.bookings.status, 'Ongoing')
          )
        )
      )
      .all();

    if (otherActiveBookings.length === 0) {
      await db.update(schema.cars).set({ status: 'Ready' }).where(eq(schema.cars.id, booking.carId)).run();
    }
  }

  const updated = await db.select().from(schema.bookings).where(
    or(
      eq(schema.bookings.id, id),
      eq(schema.bookings.id, id.toUpperCase()),
      eq(schema.bookings.id, id.toLowerCase())
    )
  ).get();

  return c.json({ success: true, data: updated });
});

// 9. SCHEDULE & DASHBOARD STATS (ADMIN)
app.get('/api/schedule', async (c) => {
  const db = getDb(c.env);

  const allBookings = await db.select().from(schema.bookings).all();
  const allCars = await db.select().from(schema.cars).all();

  const activeBookings = allBookings.filter((b) => b.status === 'Approved');
  const pendingBookings = allBookings.filter((b) => b.status === 'Pending Verification');
  const completedBookings = allBookings.filter((b) => b.status === 'Completed');

  const totalIncome = allBookings
    .filter((b) => b.status === 'Approved' || b.status === 'Completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return c.json({
    success: true,
    data: {
      stats: {
        totalIncome,
        totalCars: allCars.length,
        readyCars: allCars.filter((c) => c.status === 'Ready').length,
        maintenanceCars: allCars.filter((c) => c.status === 'Maintenance').length,
        pendingOrders: pendingBookings.length,
        activeOrders: activeBookings.length,
        completedOrders: completedBookings.length
      },
      activeBookings,
      pendingBookings
    }
  });
});

// 10. MANUAL SEED ENDPOINT
app.post('/api/seed', async (c) => {
  const db = getDb(c.env);

  for (const car of INITIAL_CARS) {
    await db.insert(schema.cars).values({
      id: car.id,
      name: car.name,
      brand: car.brand,
      category: car.category,
      transmission: car.transmission,
      seats: car.seats,
      luggage: car.luggage,
      fuelType: car.fuelType,
      pricePerDay: car.pricePerDay,
      plateNumber: car.plateNumber,
      year: car.year,
      imageUrl: car.imageUrl,
      features: car.features,
      status: car.status,
      description: car.description,
      createdAt: new Date().toISOString()
    }).onConflictDoNothing().run();
  }

  for (const b of INITIAL_BOOKINGS) {
    await db.insert(schema.bookings).values({
      id: b.id,
      carId: b.carId,
      carName: b.carName,
      carPlate: b.carPlate,
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      customerAddress: b.customerAddress,
      serviceType: b.serviceType,
      deliveryLocation: b.deliveryLocation || null,
      startDate: b.startDate,
      endDate: b.endDate,
      totalDays: b.totalDays,
      dailyPrice: b.dailyPrice,
      driverFee: b.driverFee,
      deliveryFee: b.deliveryFee,
      totalPrice: b.totalPrice,
      status: b.status,
      ktpUrl: b.ktpUrl || null,
      simUrl: b.simUrl || null,
      createdAt: b.createdAt
    }).onConflictDoNothing().run();
  }

  return c.json({ success: true, message: 'Database seeded successfully' });
});

export default app;
