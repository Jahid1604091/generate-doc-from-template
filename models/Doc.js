const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: [5, 'Name cant be less than 5 char'],
        required: [true, 'Please add course name'],
    },

    description: {
        type: String,
        required: [true, 'Please add course description'],
    },
    price: {
        type: String,
        required: [true, 'Please add course price'],
    },
    duration: {
        type: String,
        required: [true, 'Please add course duration in week'],
    },
    level: {
        type: String,
        required: [true, 'Please add course level'],
        enum: ['Beginner', 'Mid', 'Advanced']
    },
    topics: {
        type: [String],
        required: [true, 'Please add course Topics, i.e [HTML, React, JS] '],

    },
    schedule: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        classDays: {
            type: [String],
            enum: ["Monday", "Wednesday", "Friday"],
            required: [true, 'Please add class Day between Monday, Wednesday, Friday'],
        },
        classTime: {
            type: String,
            required: [true, 'Please add class duration, i.e 18:00-20.00 '],
            default:"18:00-20.00"
        }
    },

}, { timestamps: true })



module.exports = Course = mongoose.model('Course', courseSchema)
