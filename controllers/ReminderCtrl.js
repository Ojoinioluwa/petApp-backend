const mongoose = require('mongoose');
const Reminder = require('../models/Reminder');
const asyncHandler = require('express-async-handler');

const Pet = require('../models/Pet');

const reminderController = {
    createReminder: asyncHandler(async(req,res)=> {
        const { type, title, description, veterinarian, date } = req.body;
        const { petId } = req.params;
        const userId = req.user; // Assuming the user ID is available in req.user

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

        // Create a new reminder
        const reminderData = await Reminder.create({
            petId,
            title,
            type,
            description,
            veterinarian,
            date,
            userId: userId,
        });

        res.status(201).json({
            message: 'Reminder created successfully',
            reminder: {
                id: reminderData._id,
                petId: reminderData.petId,
                type: reminderData.type,
                title: reminderData.title,
                description: reminderData.description,
                veterinarian: reminderData.veterinarian,
                date: reminderData.date,
            },
        });

    }),
    getReminderByPet: asyncHandler(async(req,res)=> {
        const { petId } = req.params;
        const userId = req.user; // Assuming the user ID is available in req.user

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

        // Find reminders by pet ID
        const reminders = await Reminder.find({ petId });
        if (!reminders || reminders.length === 0) {
            res.status(404)
            throw new Error('No reminders found for this pet');
        }

        res.status(200).json({
            message: 'Reminders found',
            reminders
        });
    }),
    getReminderById: asyncHandler(async(req,res)=> {
        const { reminderId } = req.params;
        const userId = req.user; // Assuming the user ID is available in req.user

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(reminderId)) {
            res.status(400);
            throw new Error('Invalid reminder ID format');
        }

        // Check if reminder exists and belongs to the user
        const reminder = await Reminder.findOne({ _id: reminderId, ownerId: userId });
        if (!reminder) {
            res.status(404)
            throw new Error('Reminder not found or does not belong to this user');
        }

        res.status(200).json({
            message: 'Reminder found',
            reminder
        });
    }),
    getReminderByUser: asyncHandler(async(req, res)=> {
        const userId = req.user;

        if(!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400);
            throw new Error('Invalid user ID format');
        }

        const reminders = await Reminder.find({userId});
        if(reminders.length === 0) {
            res.status(404);
            throw new Error('No reminders found for this user');
        }
        res.status(200).json({
            message: 'Reminders found',
            reminders
        });
    }),
    deleteReminder: asyncHandler(async(req, res)=> {
        const {reminderId} = req.params;
        const userId = req.user;

        // validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(reminderId)) {
            res.status(400);
            throw new Error('Invalid reminder ID format');
        }

        // check if the reminder be;pongs to the user
        const reminder = await Reminder.findOne({_id: reminderId, userId});
        if(!reminder){
            res.status(404);
            throw new Error('Reminder not found or does not belong to this user');
        }

        // delete the reminder
        await Reminder.deleteOne({_id: reminderId});
        res.status(200).json({
            message: 'Reminder deleted successfully',
        })
    }),
    updateReminder: asyncHandler(async(req, res)=> {
        const { reminderId } = req.params;
        const userId = req.user; // Assuming the user ID is available in req.user

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(reminderId)) {
            res.status(400);
            throw new Error('Invalid reminder ID format');
        }

        // Check if reminder exists and belongs to the user
        const reminder = await Reminder.findOne({ _id: reminderId, userId });
        if (!reminder) {
            res.status(404);
            throw new Error('Reminder not found or does not belong to this user');
        }

        if (new Date(req.body.date) < new Date()) {
            res.status(400).send('Reminder date must be in the future');
            return;
        }
        

        // Update the reminder
        const updatedReminder = await Reminder.findByIdAndUpdate(reminderId, req.body, { new: true });

        res.status(200).json({
            message: 'Reminder updated successfully',
            reminder: updatedReminder,
        });
    }),
    upcomingReminders: asyncHandler(async(req, res)=> {
        const userId = req.user; // Assuming the user ID is available in req.user

        // Get current date
        const currentDate = new Date();

        // Find upcoming reminders for the user
        const reminders = await Reminder.find({ userId, date: { $gte: currentDate } });

        if (!reminders || reminders.length === 0) {
            res.status(404)
            throw new Error('No upcoming reminders found for this user');
        }

        res.status(200).json({
            message: 'Upcoming reminders found',
            reminders
        });
    }),
    pastReminders: asyncHandler(async(req, res)=> {
        const userId = req.user; // Assuming the user ID is available in req.user

        // Get current date
        const currentDate = new Date();

        // Find past reminders for the user
        const reminders = await Reminder.find({ userId, date: { $lt: currentDate } });

        if (!reminders || reminders.length === 0) {
            res.status(404)
            throw new Error('No past reminders found for this user');
        }

        res.status(200).json({
            message: 'Past reminders found',
            reminders
        });
    }),

}