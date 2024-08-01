const { pool } = require("../../db");

const createOrder = async (req, res) => {
  const { userId, productId, bidAmount } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, product_id, bid_amount) VALUES ($1, $2, $3) RETURNING *',
      [userId, productId, bidAmount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { userId, productId, bidAmount } = req.body;
  try {
    const result = await pool.query(
      'UPDATE orders SET user_id = $1, product_id = $2, bid_amount = $3 WHERE id = $4 RETURNING *',
      [userId, productId, bidAmount, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder
}