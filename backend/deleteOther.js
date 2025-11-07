const mongoose = require('mongoose');
require('dotenv').config();

const deleteOther = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    const db = mongoose.connection.db;
    const result = await db.collection('categories').deleteOne({
      _id: new mongoose.Types.ObjectId('690db850115a8f6079fe969f')
    });

    console.log('✓ Deleted:', result.deletedCount, 'document(s)');
    
    // Verify
    const remaining = await db.collection('categories').find({}).toArray();
    console.log('\n✓ Remaining categories:');
    remaining.forEach(cat => console.log('-', cat.name));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

deleteOther();