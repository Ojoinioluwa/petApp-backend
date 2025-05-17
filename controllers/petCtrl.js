const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Pet = require('../models/Pet');

const petController = {
    createPet: asyncHandler(async (req, res) => {
        const { name, age, breed, species, weight, sex, description } = req.body;
        const image = req.file;
        // console.log(image)
        const ownerId = req.user; 
        console.log(ownerId);
        // Validate required fields
        if(!name || !age || !species || !breed || !image || !weight || !sex || !description) {
            res.status(400);
            throw new Error('All fields are required');
        }       

        // Create a new pet
        const pet = await Pet.create({
            name,
            age,
            species,
            breed,
            image: image.path,
            weight,
            description,
            sex,
            ownerId,
        });

        res.status(201).json({
            message: 'Pet created successfully',
            pet: {
                id: pet._id,
                name: pet.name,
                age: pet.age,
                species: pet.species,
                breed: pet.breed,
                image: pet.image,
                ownerId: pet.ownerId,
                weight: pet.weight,
                description: pet.description,
                sex: pet.sex,
            },
        });
    }),
    getPetByUser: asyncHandler(async (req, res) => {
        const userId = req.user; 

        // Find pets by owner ID
        const pets = await Pet.find({ ownerId: userId }).lean();

        if (!pets || pets.length === 0) {
            res.status(404)
            throw new Error('No pets found for this user');
        }

        res.status(200).json({
            message: 'Pets found',
            pets,
            length: pets.length
        });
    }),
    getPetById: asyncHandler(async (req, res) => {
        const {petId} = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(petId)) {
            res.status(400);
            throw new Error('Invalid pet ID format');
        }

        // Find pet by ID
        const pet = await Pet.findById(petId);
        if (!pet) {
            res.status(404)
            throw new Error('Pet not found');
        }
        res.status(200).json({
            message: 'Pet found',
            pet
        });
    }),
    updatePet: asyncHandler(async (req, res) => {
        const {petId} = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(petId)) {
            res.status(400);
            throw new Error('Invalid pet ID format');
        }

        // Find and update pet by ID
        const pet = await Pet.findByIdAndUpdate(
            petId,
            ...req.body,
            { new: true }
        );

        if (!pet) {
            res.status(404)
            throw new Error('Pet not found');
        }

        res.status(200).json({
            message: 'Pet updated successfully',
            pet
        });
    }),
    deletePet: asyncHandler(async (req, res) => {
        const {petId} = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(petId)) {
            res.status(400);
            throw new Error('Invalid pet ID format');
        }

        // Find and delete pet by ID
        const pet = await Pet.findByIdAndDelete(petId);

        if (!pet) {
            res.status(404)
            throw new Error('Pet not found');
        }

        res.status(200).json({
            message: 'Pet deleted successfully',
            pet
        });
    }),
}

module.exports = petController;