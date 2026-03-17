const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/al-profile-blog';

async function createLengruber() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const email = 'adrianolengruber@hotmail.com';
    const username = 'Lengruber';
    const password = 'AL_Password_2026'; // Senha definida para o teste
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await users.findOne({ email });
    
    if (existingUser) {
      await users.updateOne(
        { email },
        { $set: { username, password: hashedPassword } }
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
    console.error('Erro:', error);
  } finally {
    await client.close();
  }
}

createLengruber();
