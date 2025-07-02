const { MongoClient } = require('mongodb');

const MONGO_URL = 'mongodb://fridgewiseai:supersecret123@localhost:27017/fridgewiseai?authSource=fridgewiseai';

async function fixDatabase() {
    const client = new MongoClient(MONGO_URL);
    
    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        
        const db = client.db('fridgewiseai');
        console.log('Connected successfully to database');
        
        // Check if recipes collection exists
        const collections = await db.listCollections({ name: 'recipes' }).toArray();
        
        if (collections.length > 0) {
            console.log('Found existing recipes collection. Dropping it...');
            await db.collection('recipes').drop();
            console.log('Recipes collection dropped successfully');
        } else {
            console.log('No existing recipes collection found');
        }
        
        // Create new recipes collection with correct validation
        console.log('Creating new recipes collection with correct schema...');
        
        await db.createCollection('recipes', {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["title", "ingredients", "instructions", "createdBy"],
                    properties: {
                        title: {
                            bsonType: "string",
                            description: "Recipe title is required and must be a string"
                        },
                        description: {
                            bsonType: "string"
                        },
                        ingredients: {
                            bsonType: "array",
                            items: {
                                bsonType: "object",
                                required: ["name"],
                                properties: {
                                    name: { bsonType: "string" },
                                    amount: { bsonType: "string" },
                                    unit: { bsonType: "string" }
                                }
                            }
                        },
                        instructions: {
                            bsonType: "array",
                            items: {
                                bsonType: "string"
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
                        difficulty: {
                            bsonType: "string",
                            enum: ["easy", "medium", "hard"]
                        },
                        servings: {
                            bsonType: "number"
                        },
                        tags: {
                            bsonType: "array",
                            items: {
                                bsonType: "string"
                            }
                        },
                        createdBy: {
                            bsonType: "objectId",
                            description: "User ID who created the recipe is required"
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
        
        console.log('✅ Recipes collection created successfully with correct validation schema');
        
        // Create indexes for better performance
        console.log('Creating indexes...');
        
        await db.collection('recipes').createIndex({ createdBy: 1 });
        await db.collection('recipes').createIndex({ title: "text", description: "text" });
        await db.collection('recipes').createIndex({ tags: 1 });
        await db.collection('recipes').createIndex({ difficulty: 1 });
        await db.collection('recipes').createIndex({ createdAt: -1 });
        
        console.log('✅ Indexes created successfully');
        
        // Verify the collection was created correctly
        const newCollections = await db.listCollections({ name: 'recipes' }).toArray();
        if (newCollections.length > 0) {
            console.log('✅ Database fix completed successfully!');
            console.log('The recipes collection now uses "createdBy" instead of "userId"');
        } else {
            console.log('❌ Something went wrong - recipes collection not found');
        }
        
    } catch (error) {
        console.error('❌ Error fixing database:', error);
        throw error;
    } finally {
        await client.close();
        console.log('Database connection closed');
    }
}

// Run the fix
if (require.main === module) {
    fixDatabase()
        .then(() => {
            console.log('\n🎉 Database fix completed successfully!');
            console.log('You can now try generating recipes again.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Database fix failed:', error.message);
            process.exit(1);
        });
}

module.exports = { fixDatabase };
