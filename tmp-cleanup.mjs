import mongoose from 'mongoose';
const conn = await mongoose.connect('mongodb://127.0.0.1:27017/akinteriors', { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 });
const first = await conn.connection.db.collection('settings').findOne({});
const r = await conn.connection.db.collection('settings').deleteMany({ _id: { $ne: first._id } });
console.log('Deleted ' + r.deletedCount + ' duplicate settings');
await mongoose.disconnect();
