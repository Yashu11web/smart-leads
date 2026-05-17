import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User';
import { Lead } from '../models/Lead';

const seed = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGO_URI ?? 'mongodb://localhost:27017/smart_leads');

  await User.deleteMany({});
  await Lead.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin',
  });

  const sales = await User.create({
    name: 'Sales User',
    email: 'sales@demo.com',
    password: 'sales123',
    role: 'sales',
  });

  const statuses = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
  const sources = ['Website', 'Instagram', 'Referral'] as const;

  const names = [
    'Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Sneha Patel',
    'Vikram Mehta', 'Anjali Gupta', 'Rohan Verma', 'Kavya Nair',
    'Arjun Reddy', 'Pooja Iyer', 'Siddharth Joshi', 'Meera Das',
    'Kartik Mishra', 'Divya Rao', 'Nikhil Kapoor', 'Riya Bansal',
    'Aditya Choudhary', 'Swati Pandey', 'Vishal Tiwari', 'Shreya Saxena',
  ];

  const leads = names.map((name, i) => ({
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    status: statuses[i % statuses.length],
    source: sources[i % sources.length],
    notes: i % 3 === 0 ? 'Follow up next week' : undefined,
    createdBy: i % 3 === 0 ? admin._id : sales._id,
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  }));

  await Lead.insertMany(leads);

  console.log('✅ Seed complete');
  console.log('👤 Admin: admin@demo.com / admin123');
  console.log('👤 Sales: sales@demo.com / sales123');
  await mongoose.disconnect();
};

seed().catch(console.error);
