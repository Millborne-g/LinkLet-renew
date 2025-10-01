import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    background: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    primary: {
        type: String,
        required: true,
    },
    secondary: {
        type: String,
        required: true,
    },
    accent: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Clear existing model to force schema update
if (mongoose.models.Template) {
    delete mongoose.models.Template;
}

const Template = mongoose.model("Template", templateSchema);

export default Template;
