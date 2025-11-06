require('dotenv').config();
const mongoose = require('mongoose');
const Department = require('../models/Department');
const Circle = require('../models/Circle');

async function updateStructure() {
  try {
    console.log('🔄 Starting structure updates...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // 1. Update Transaction Processing name
    console.log('📝 Updating Transaction Processing name...');
    await Department.findOneAndUpdate(
      { name: 'Transaction Processing' },
      { 
        name: 'Transaction Processing and Settlement',
        description: 'Transaction processing, settlement, and reconciliation'
      }
    );
    console.log('✅ Updated to: Transaction Processing and Settlement\n');
    
    // 2. Update Treasury structure
    console.log('�� Restructuring Treasury...');
    const treasury = await Department.findOne({ name: 'FX (Treasury)' });
    const stablecoins = await Department.findOne({ name: 'Stablecoins' });
    
    if (treasury) {
      treasury.name = 'Treasury';
      treasury.description = 'Foreign exchange, treasury management, and stablecoins operations';
      await treasury.save();
      console.log('✅ Updated FX (Treasury) → Treasury\n');
    }
    
    if (stablecoins) {
      await Department.findByIdAndDelete(stablecoins._id);
      console.log('✅ Removed Stablecoins (merged into Treasury)\n');
      
      const commercial = await Circle.findOne({ slug: 'commercial' });
      if (commercial) {
        commercial.departments = commercial.departments.filter(
          id => id.toString() !== stablecoins._id.toString()
        );
        await commercial.save();
        console.log('✅ Updated Commercial circle\n');
      }
    }
    
    console.log('🎉 Structure updates completed successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Summary of changes:');
    console.log('  ✓ Transaction Processing → Transaction Processing and Settlement');
    console.log('  ✓ FX (Treasury) → Treasury');
    console.log('  ✓ Stablecoins merged into Treasury');
    console.log('  ✓ Commercial circle updated');
    console.log('═══════════════════════════════════════\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating structure:', error);
    process.exit(1);
  }
}

updateStructure();
