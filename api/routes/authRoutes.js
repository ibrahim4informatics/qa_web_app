const express = require('express')
const router = express.Router()

// module import
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// midlewares
const isAnonym = require('../middlewares/isAnonym').isAnonym
// POST http://loclahost:3001/api/auth/login
router.post('/login', isAnonym, async (req, res) => {
    const { email, password } = req.body
    if (email === '' || password === '') return res.status(400).json({err:"fill all fields"})
    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return res.status(404).json({ err: "user doesn't exist" })
        if (bcrypt.compareSync(password, user.password) !== true) return res.status(400).json({ err: "invalid password" })

        const token = jwt.sign({ id: user.id }, process.env.SECRET, {expiresIn:"1d"})
        return res.status(200).json({ message: "connected successfully", token })

    }
    catch (err) {
        return res.status(500).json({ err })
    }

})


// POST http://localhost:3001/api/auth/register
router.post('/register', isAnonym, async (req, res) => {
    const { email, username, password, confirm } = req.body
    try {
        const user_email_used = await prisma.user.findUnique({ where: { email } })
        const user_username_used = await prisma.user.findUnique({ where: { username } })

        if (email === '' || username === '' || password === '' || confirm === '') return res.status(400).json({ err: "fill all fields" })
        if (user_email_used !== null) return res.status(400).json({ err: "email is used" })
        if (user_username_used !== null) return res.status(400).json({ err: "username is used" })
        if (password !== confirm) return res.status(400).json({ err: "password doen't match" })
        if (password.length < 6) return res.status(400).json({ err: "password must be more than 6 characters" })

        const salt = bcrypt.genSaltSync(12)
        await prisma.user.create({ data: { email, username, password: bcrypt.hashSync(password, salt) } })
        return res.status(201).json({ message: "user created" })

    }
    catch (err) {
        res.status(500).json({ err })
    }
})

module.exports = router