const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/al-profile-blog';
const DEFAULT_DB_NAME = 'al-profile-blog';

function getDatabaseName(uri) {
  try {
    const parsed = new URL(uri);
    const dbName = parsed.pathname.replace(/^\//, '').trim();
    return dbName || DEFAULT_DB_NAME;
  } catch {
    return DEFAULT_DB_NAME;
  }
}

async function createLengruber() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(getDatabaseName(MONGODB_URI));
    const users = db.collection('users');

    const email = 'adrianolengruber@hotmail.com';
    const username = 'Lengruber';
    const password = 'AL_Password_2026';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await users.findOne({ email });
    
    if (existingUser) {
      await users.updateOne(
        { email },
        { $set: { username, password: hashedPassword, avatar: '', bio: 'Senior Developer & Tech Lead' } }
      );
      console.log('Usuário Lengruber atualizado com sucesso.');
    } else {
      await users.insertOne({
        username,
        email,
        password: hashedPassword,
        avatar: '',
        bio: 'Senior Developer & Tech Lead',
        createdAt: new Date()
      });
      console.log('Usuário Lengruber criado com sucesso.');
    }

    console.log('Credenciais para login:');
    console.log('Email:', email);
    console.log('Senha:', password);

  } catch (error) {
    console.error('Erro ao criar usuário Lengruber:', error);
  } finally {
    await client.close();
  }
}

module.exports = { createLengruber };

if (require.main === module) {
  createLengruber();
}
