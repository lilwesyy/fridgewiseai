// Remove validation from recipes collection
print('🔧 Removing validation from recipes collection...');

db = db.getSiblingDB('fridgewiseai');

try {
  // Remove validation by setting an empty validator
  db.runCommand({
    collMod: "recipes",
    validator: {}
  });
  
  print('✅ Validation removed successfully from recipes collection');
} catch (error) {
  print('❌ Error removing validation:', error);
}
