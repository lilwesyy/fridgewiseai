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
      required: ["title", "ingredients", "instructions", "userId"],
      properties: {
        title: {
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
        userId: {
          bsonType: "objectId",
          description: "must be an objectId and is required"
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

db.recipes.createIndex({ "userId": 1 });
db.recipes.createIndex({ "title": "text", "description": "text" });
db.recipes.createIndex({ "createdAt": 1 });

// Insert some initial data if needed
print('📚 Creating indexes...');
print('✅ FridgeWiseAI database initialized successfully!');
