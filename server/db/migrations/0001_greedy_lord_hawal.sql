ALTER TABLE `bookings` ADD `dp_amount` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD `remaining_amount` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD `payment_status` text DEFAULT 'Menunggu DP' NOT NULL;