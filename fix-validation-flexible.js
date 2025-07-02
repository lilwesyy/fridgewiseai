// Fix MongoDB collection validation to be more flexible
print('🔧 Making MongoDB recipes collection validation more flexible...');

// Switch to fridgewiseai database
db = db.getSiblingDB('fridgewiseai');

// Remove existing validation completely
try {
  db.runCommand({
    collMod: "recipes",
    validator: {}
  });
  print('✅ Removed existing validation');
} catch (error) {
  print('⚠️ Failed to remove existing validation:', error);
}

// Add minimal validation that only checks required top-level fields
db.runCommand({
  collMod: "recipes",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "ingredients", "instructions", "createdBy"],
      properties: {
        title: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        description: {
          bsonType: "string",
          description: "must be a string"
        },
        ingredients: {
          bsonType: "array",
          description: "must be an array and is required"
        },
        instructions: {
          bsonType: "array", 
          description: "must be an array and is required"
        },
        cookingTime: {
          bsonType: "object"
        },
        servings: {
          bsonType: "number"
        },
        difficulty: {
          bsonType: "string"
        },
        cuisine: {
          bsonType: "string"
        },
        tags: {
          bsonType: "array"
        },
        generatedFrom: {
          bsonType: "object"
        },
        createdBy: {
          bsonType: "objectId",
          description: "must be an objectId and is required"
        },
        isPublic: {
          bsonType: "bool"
        }
      }
    }
  }
});

print('✅ Updated validation schema to be more flexible');
print('🎉 MongoDB recipes collection validation is now flexible!');
