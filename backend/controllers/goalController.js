const asyncHandler = require('express-async-handler')
const { Error } = require('mongoose')
const Goal = require('../models/goalModel')
const userModel = require('../models/userModel')
const User = require('../models/userModel')

//@desc gets goals
//@route GET /api/goals
//@access Private
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id })

    res.status(200).json(goals)
})

//@desc sets goals
//@route POST /api/goals
//@access Private
const createGoals = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please add a text field')
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id,
    })

    res.status(200).json(goal)
})

//@desc creates goals
//@route PUT /api/goals
//@access Private
const updateGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    //Check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    //Make sure logged in user matches the goal user
    if(goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.params.body, {
        new: true,
    })

    res.status(200).json(updatedGoal)
})

//@desc deletes goals
//@route DELETE /api/goals
//@access Private
const deleteGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)

    //Check for user
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //Make sure logged in user matches the goal user
    if(goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    await goal.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getGoals,
    createGoals,
    updateGoals,
    deleteGoals
}