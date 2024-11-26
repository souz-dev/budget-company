CREATE SEQUENCE IF NOT EXISTS companies_id_seq;

CREATE TABLE IF NOT EXISTS Companies (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(500),
  subscription_status enum,
  subscription_start timestamp,
  subscription_end timestamp,
  created_at timestamp,
  updated_at timestamp
);

CREATE SEQUENCE IF NOT EXISTS user_id_seq;

CREATE TABLE IF NOT EXISTS "user" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid,
  subscription_id uuid,
  name varchar(500),
  email varchar(500),
  role enum,
  password_hash varchar(500),
  created_at timestamp,
  updated_at timestamp
);

CREATE SEQUENCE IF NOT EXISTS budget_fields_id_seq;

CREATE TABLE IF NOT EXISTS budget_fields (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid,
  name varchar(500),
  type varchar(500),
  options jsonb,
  created_at timestamp,
  update_at timestamp
);

CREATE SEQUENCE IF NOT EXISTS budgets_id_seq;

CREATE TABLE IF NOT EXISTS budgets (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid,
  user_id uuid,
  name varchar(500),
  status varchar(500),
  created_at timestamp,
  updated_at timestamp
);

CREATE SEQUENCE IF NOT EXISTS budget_items_id_seq;

CREATE TABLE IF NOT EXISTS budget_items (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id uuid,
  field_id uuid,
  value jsonb,
  price numeric,
  created_at timestamp
);

CREATE SEQUENCE IF NOT EXISTS subscriptions_id_seq;

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid,
  plan enum,
  price decimal,
  billing_period enum,
  status enum,
  next_billing_date timestamp,
  created_at timestamp,
  updated_at timestamp
);

ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_company_id_fk FOREIGN KEY (company_id) REFERENCES Companies (id);
ALTER TABLE "user" ADD CONSTRAINT user_company_id_fk FOREIGN KEY (company_id) REFERENCES Companies (id);
ALTER TABLE "user" ADD CONSTRAINT user_subscription_id_fk FOREIGN KEY (subscription_id) REFERENCES subscriptions (id);
ALTER TABLE budgets ADD CONSTRAINT budgets_company_id_fk FOREIGN KEY (company_id) REFERENCES Companies (id);
ALTER TABLE budgets ADD CONSTRAINT budgets_user_id_fk FOREIGN KEY (user_id) REFERENCES "user" (id);
ALTER TABLE budget_items ADD CONSTRAINT budget_items_budget_id_fk FOREIGN KEY (budget_id) REFERENCES budgets (id);
ALTER TABLE budget_fields ADD CONSTRAINT budget_fields_id_fk FOREIGN KEY (id) REFERENCES budget_items (field_id);
ALTER TABLE budget_fields ADD CONSTRAINT budget_fields_company_id_fk FOREIGN KEY (company_id) REFERENCES Companies (id);