const asyncHandler = require("express-async-handler");
const HealthRecord = require("../models/HealthRecord");
const Pet = require("../models/Pet");
const User = require("../models/User");
const mongoose = require("mongoose");


const healthRecordController = {
    // create a new health record
    createHealthRecord: asyncHandler(async(req,res)=> {
        const { type, title, description, veterinarian, cost, date  } = req.body;
        const { petId } = req.params;
        const userId = req.user;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(petId)) {
            res.status(400);
            throw new Error('Invalid pet ID format');
        }

        if(!type || !title || !description || !veterinarian || !cost) {
            res.status(400);
            throw new Error('All fields are required');
        }
        if(isNaN(cost)){
            res.status(400);
            throw new Error("Cost is expected to be a number")
        }

        // Check if pet exists and belongs to the user
        const pet = await Pet.findOne({ _id: petId, ownerId: userId });
        if (!pet) {
            res.status(404);
            throw new Error('Pet not found or does not belong to this user');
        }

        // Create a new health record
        const healthRecordData = await HealthRecord.create({
            petId,
            title,
            type,
            description,
            veterinarian,
            cost,
            date,
            documents: req.files ? req.files.map(file => file.path) : [],
        });

        res.status(201).json({
            message: 'Health record created successfully',
            id: healthRecordData._id,
            petId: healthRecordData.petId,
            healthRecord: healthRecordData.healthRecord,
        });
    }),
    // get all health records
    getHealthRecordByPet: asyncHandler(async(req,res)=> {
        const { petId } = req.params;
        const userId = req.user;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(petId)) {
            res.status(400);
            throw new Error('Invalid pet ID format');
        }

        // Check if pet exists and belongs to the user
        const pet = await Pet.findOne({ _id: petId, ownerId: userId });
        if (!pet) {
            res.status(404);
            throw new Error('Pet not found or does not belong to this user');
        }

        // Find health records by pet ID
        const healthRecords = await HealthRecord.find({ petId }).lean();
        if (!healthRecords || healthRecords.length === 0) {
            res.status(404);
            throw new Error('No health records found for this pet');
        }

        res.status(200).json({
            message: 'Health records found',
            healthRecords,
        });
    }),
    // get health record by id
    getHealthRecordById: asyncHandler(async(req,res)=> {
        const { healthRecordId } = req.params;
        const userId = req.user;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(healthRecordId)) {
            res.status(400);
            throw new Error('Invalid health record ID format');
        }

        // Find health record by ID
        const healthRecord = await HealthRecord.findById(healthRecordId).lean()
        if (!healthRecord) {
            res.status(404);
            throw new Error('Health record not found');
        }

        // Check if the pet belongs to the user
        const pet = await Pet.findOne({ _id: healthRecord.petId, ownerId: userId });
        if (!pet) {
            res.status(404);
            throw new Error('Pet not found or does not belong to this user');
        }

        res.status(200).json({
            message: 'Health record found',
            healthRecord,
        });
    }),
    // delete health record by id
    deleteHealthRecord: asyncHandler(async(req,res)=> {
        const { healthRecordId } = req.params;
        const userId = req.user;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(healthRecordId)) {
            res.status(400);
            throw new Error('Invalid health record ID format');
        }

        // Find health record by ID
        const healthRecord = await HealthRecord.findById(healthRecordId).lean()
        if (!healthRecord) {
            res.status(404);
            throw new Error('Health record not found');
        }

        // Check if the pet belongs to the user
        const pet = await Pet.findOne({ _id: healthRecord.petId, ownerId: userId });
        if (!pet) {
            res.status(404);
            throw new Error('Pet not found or does not belong to this user');
        }

        // Delete the health record
        await HealthRecord.findByIdAndDelete(healthRecordId);

        res.status(200).json({
            message: 'Health record deleted successfully',
        });
    }),
    // update health record by id
    updateHealthRecord: asyncHandler(async(req,res)=> {
        const { healthRecordId } = req.params;
        const userId = req.user;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(healthRecordId)) {
            res.status(400);
            throw new Error('Invalid health record ID format');
        }

        // Find health record by ID
        const healthRecord = await HealthRecord.findById(healthRecordId).lean()
        if (!healthRecord) {
            res.status(404);
            throw new Error('Health record not found');
        }

        // Check if the pet belongs to the user
        const pet = await Pet.findOne({ _id: healthRecord.petId, ownerId: userId });
        if (!pet) {
            res.status(404);
            throw new Error('Pet not found or does not belong to this user');
        }

        // Update the health record
        const updatedHealthRecord = await HealthRecord.findByIdAndUpdate(
            healthRecordId,
            { ...req.body, documents: req.files ? req.files.map(file => file.path) : [] },
            { new: true }
        );

        res.status(200).json({
            message: 'Health record updated successfully',
            updatedHealthRecord,
        });
    }),
}

module.exports = healthRecordController;