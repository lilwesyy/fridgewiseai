// Fix MongoDB collection validation to match actual data structure
print('🔧 Fixing MongoDB recipes collection validation...');

// Switch to fridgewiseai database
db = db.getSiblingDB('fridgewiseai');

// Remove existing validation
try {
  db.runCommand({
    collMod: "recipes",
    validator: {}
  });
  print('✅ Removed existing validation');
} catch (error) {
  print('⚠️ Failed to remove existing validation:', error);
}

// Add new validation that matches the actual data structure
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
          description: "must be an array and is required",
          items: {
            bsonType: "object",
            properties: {
              name: { bsonType: "string" },
              amount: { bsonType: "string" },
              unit: { bsonType: "string" },
              notes: { bsonType: "string" }
            }
          }
        },
        instructions: {
          bsonType: "array", 
          description: "must be an array and is required",
          items: {
            bsonType: "object",
            properties: {
              step: { bsonType: "number" },
              description: { bsonType: "string" },
              duration: { bsonType: "number" },
              temperature: { bsonType: "string" }
            }
          }
        },
        cookingTime: {
          bsonType: "object",
          properties: {
            prep: { bsonType: "number" },
            cook: { bsonType: "number" },
            total: { bsonType: "number" }
          }
        },
        servings: {
          bsonType: "number",
          minimum: 1,
          maximum: 20
        },
        difficulty: {
          bsonType: "string",
          enum: ["easy", "medium", "hard"]
        },
        cuisine: {
          bsonType: "string"
        },
        tags: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        generatedFrom: {
          bsonType: "object",
          properties: {
            ingredients: {
              bsonType: "array",
              items: { bsonType: "string" }
            },
            prompt: { bsonType: "string" },
            aiModel: { bsonType: "string" }
          }
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

print('✅ Updated validation schema to match Mongoose model');
print('🎉 MongoDB recipes collection validation fixed!');
