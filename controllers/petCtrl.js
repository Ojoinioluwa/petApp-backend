const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Pet = require('../models/Pet');

const petController = {
    createPet: asyncHandler(async (req, res) => {
        const { name, age, species, breed, image } = req.body;
        const ownerId = req.user._id; // Assuming the user ID is available in req.user

        // Create a new pet
        const pet = await Pet.create({
            name,
            age,
            species,
            breed,
            image,
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
            },
        });
    }),
    getPetByUser: asyncHandler(async (req, res) => {
        const userId = req.user; 

        // Find pets by owner ID
        const pets = await Pet.find({ ownerId: userId });

        if (!pets || pets.length === 0) {
            res.status(404)
            throw new Error('No pets found for this user');
        }

        res.status(200).json({
            message: 'Pets found',
            pets
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
        const { name, age, species, breed, image } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(petId)) {
            res.status(400);
            throw new Error('Invalid pet ID format');
        }

        // Find and update pet by ID
        const pet = await Pet.findByIdAndUpdate(
            petId,
            { name, age, species, breed, image },
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