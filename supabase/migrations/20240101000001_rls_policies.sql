-- Enable Row-Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Categories RLS Policies
CREATE POLICY categories_select_policy ON categories
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY categories_insert_policy ON categories
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY categories_update_policy ON categories
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY categories_delete_policy ON categories
  FOR DELETE
  USING (auth.uid() = user_id);

-- Transactions RLS Policies
CREATE POLICY transactions_select_policy ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY transactions_insert_policy ON transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY transactions_update_policy ON transactions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY transactions_delete_policy ON transactions
  FOR DELETE
  USING (auth.uid() = user_id);
