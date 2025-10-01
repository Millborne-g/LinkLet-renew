// Migration script to add exploreByAll field to existing URL documents
// Run this with: node src/scripts/migrate-explore-by-all.js

const mongoose = require("mongoose");
require("dotenv").config();

// Define the URL schema with the new exploreByAll field
const urlSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    public: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    views: {
        type: Number,
        default: 0,
    },
    template: {
        type: Object,
        default: null,
    },
    userAlias: {
        type: Object,
        default: null,
    },
    exploreByAll: {
        type: Boolean,
        default: false,
    },
});

const Url = mongoose.model("Url", urlSchema);

async function migrateExploreByAll() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Find all documents without exploreByAll field
        const documentsWithoutExploreByAll = await Url.find({
            exploreByAll: { $exists: false },
        });

        console.log(
            `Found ${documentsWithoutExploreByAll.length} documents without exploreByAll field`
        );

        if (documentsWithoutExploreByAll.length > 0) {
            // Update all documents to add exploreByAll field with default value false
            const result = await Url.updateMany(
                { exploreByAll: { $exists: false } },
                { $set: { exploreByAll: false } }
            );

            console.log(`Updated ${result.modifiedCount} documents`);

            // Log some statistics
            const totalUrls = await Url.countDocuments();
            const publicUrls = await Url.countDocuments({ public: true });
            const privateUrls = await Url.countDocuments({ public: false });

            console.log("\nMigration Statistics:");
            console.log(`Total URLs: ${totalUrls}`);
            console.log(`Public URLs: ${publicUrls}`);
            console.log(`Private URLs: ${privateUrls}`);
            console.log(
                `URLs with exploreByAll field: ${result.modifiedCount}`
            );
        } else {
            console.log("No documents need updating");

            // Still show statistics for existing data
            const totalUrls = await Url.countDocuments();
            const publicUrls = await Url.countDocuments({ public: true });
            const privateUrls = await Url.countDocuments({ public: false });
            const exploreByAllUrls = await Url.countDocuments({
                exploreByAll: true,
            });

            console.log("\nCurrent Statistics:");
            console.log(`Total URLs: ${totalUrls}`);
            console.log(`Public URLs: ${publicUrls}`);
            console.log(`Private URLs: ${privateUrls}`);
            console.log(`URLs with exploreByAll enabled: ${exploreByAllUrls}`);
        }

        console.log("\nMigration completed successfully");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

// Run the migration
migrateExploreByAll();
