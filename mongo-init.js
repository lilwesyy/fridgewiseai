// MongoDB initialization script for FridgeWiseAI
print('🍀 Initializing FridgeWiseAI database...');

// Switch to fridgewiseai database
db = db.getSiblingDB('fridgewiseai');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "must be a valid email address and is required"
        },
        password: {
          bsonType: "string",
          minLength: 6,
          description: "must be a string with at least 6 characters and is required"
        }
      }
    }
  }
});

db.createCollection('recipes', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "ingredients", "instructions", "cookingTime", "servings", "difficulty", "createdBy"],
      properties: {
        title: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        description: {
          bsonType: "string",
          description: "must be a string and is required"
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
          bsonType: "object",
          required: ["total"],
          properties: {
            prep: { bsonType: "number" },
            cook: { bsonType: "number" },
            total: { bsonType: "number" }
          },
          description: "must be an object with total time and is required"
        },
        servings: {
          bsonType: "number",
          minimum: 1,
          maximum: 20,
          description: "must be a number between 1 and 20 and is required"
        },
        difficulty: {
          bsonType: "string",
          enum: ["easy", "medium", "hard"],
          description: "must be easy, medium, or hard and is required"
        },
        cuisine: {
          bsonType: "string",
          enum: ["italian", "french", "chinese", "japanese", "indian", "mexican", "american", "mediterranean", "other"]
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
        },
        ratings: {
          bsonType: "object"
        },
        nutrition: {
          bsonType: "object"
        },
        image: {
          bsonType: "object"
        },
        createdAt: {
          bsonType: "date"
        },
        updatedAt: {
          bsonType: "date"
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

db.recipes.createIndex({ "createdBy": 1 });
db.recipes.createIndex({ "title": "text", "description": "text" });
db.recipes.createIndex({ "createdAt": 1 });

// Insert some initial data if needed
print('📚 Creating indexes...');
print('✅ FridgeWiseAI database initialized successfully!');
