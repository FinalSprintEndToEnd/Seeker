const { MongoClient } = require('mongodb');
const { Pool } = require('pg');

// MongoDB DAL
class MongoDAL {
  constructor() {
    this.client = new MongoClient('mongodb://localhost', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.client.connect((err, client) => {
      if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
      }
      this.db = client.db('your-mongodb-database-name');
      console.log('Connected to MongoDB');
    });
  }

  async searchEquipment(query) {
    const equipmentCollection = this.db.collection('equipment');
    const searchResults = await equipmentCollection.find({ name: { $regex: query, $options: 'i' } }).toArray();
    return searchResults;
  }

  async rentEquipment(id) {
    const equipmentCollection = this.db.collection('equipment');
    const rentedEquipment = await equipmentCollection.findOneAndUpdate(
      { _id: id },
      { $set: { rented: true } },
      { returnOriginal: false }
    );
    return rentedEquipment.value;
  }
}

// PostgreSQL DAL
class PostgresDAL {
  constructor() {
    this.pool = new Pool({
      user: 'your-postgres-user',
      host: 'localhost',
      database: 'your-postgres-database-name',
      password: 'your-postgres-password',
      port: 5432,
    });

    this.pool.connect()
      .then(() => {
        console.log('Connected to PostgreSQL');
      })
      .catch(err => {
        console.error('Error connecting to PostgreSQL:', err);
      });
  }

  async searchEquipment(query) {
    const result = await this.pool.query('SELECT * FROM equipment WHERE name ILIKE $1', [`%${query}%`]);
    return result.rows;
  }

  async rentEquipment(id) {
    const result = await this.pool.query('UPDATE equipment SET rented = true WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = {
  MongoDAL,
  PostgresDAL,
};
