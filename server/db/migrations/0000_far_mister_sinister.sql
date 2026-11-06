CREATE TABLE `admins` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_username_unique` ON `admins` (`username`);--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`car_id` text NOT NULL,
	`car_name` text NOT NULL,
	`car_plate` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`customer_address` text NOT NULL,
	`service_type` text NOT NULL,
	`delivery_location` text,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`total_days` integer NOT NULL,
	`daily_price` integer NOT NULL,
	`driver_fee` integer DEFAULT 0 NOT NULL,
	`delivery_fee` integer DEFAULT 0 NOT NULL,
	`total_price` integer NOT NULL,
	`status` text DEFAULT 'Pending Verification' NOT NULL,
	`ktp_url` text,
	`sim_url` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cars` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`brand` text NOT NULL,
	`category` text NOT NULL,
	`transmission` text NOT NULL,
	`seats` integer NOT NULL,
	`luggage` integer DEFAULT 2 NOT NULL,
	`fuel_type` text DEFAULT 'Bensin' NOT NULL,
	`price_per_day` integer NOT NULL,
	`plate_number` text NOT NULL,
	`year` integer NOT NULL,
	`image_url` text NOT NULL,
	`features` text NOT NULL,
	`status` text DEFAULT 'Ready' NOT NULL,
	`description` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cars_plate_number_unique` ON `cars` (`plate_number`);