import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const cars = sqliteTable('cars', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  category: text('category').notNull(),
  transmission: text('transmission').notNull(),
  seats: integer('seats').notNull(),
  luggage: integer('luggage').notNull().default(2),
  fuelType: text('fuel_type').notNull().default('Bensin'),
  pricePerDay: integer('price_per_day').notNull(),
  plateNumber: text('plate_number').notNull().unique(),
  year: integer('year').notNull(),
  imageUrl: text('image_url').notNull(),
  features: text('features', { mode: 'json' }).$type<string[]>().notNull(),
  status: text('status').notNull().default('Ready'),
  description: text('description').notNull(),
  createdAt: text('created_at').notNull()
});

export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey(),
  carId: text('car_id').notNull().references(() => cars.id),
  carName: text('car_name').notNull(),
  carPlate: text('car_plate').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerAddress: text('customer_address').notNull(),
  serviceType: text('service_type').notNull(),
  deliveryLocation: text('delivery_location'),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  totalDays: integer('total_days').notNull(),
  dailyPrice: integer('daily_price').notNull(),
  driverFee: integer('driver_fee').notNull().default(0),
  deliveryFee: integer('delivery_fee').notNull().default(0),
  totalPrice: integer('total_price').notNull(),
  dpAmount: integer('dp_amount').notNull().default(0),
  remainingAmount: integer('remaining_amount').notNull().default(0),
  paymentStatus: text('payment_status').notNull().default('Menunggu DP'),
  status: text('status').notNull().default('Pending Verification'),
  ktpUrl: text('ktp_url'),
  simUrl: text('sim_url'),
  createdAt: text('created_at').notNull()
});

export const admins = sqliteTable('admins', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull()
});
