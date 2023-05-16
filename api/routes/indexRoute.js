const express = require('express')
const router = express.Router()

//prisma import
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
// midlewares
const isAuth = require('../middlewares/isAuth').isAuth

const fieldsExcluder = (model, fields) => {
    let i = 0;
    for (i; i < fields.length; i++) {
        delete model[fields[i]]
    }
    return model
}

// user GET http://localhost:3001/api/profile
router.get('/profile', isAuth, async (req, res) => {
    try {

        const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { posts: { include: { comment: { include: { user: true } }, user: true } } } })
        const user_info = fieldsExcluder(user, ["id", "password"])
        return res.status(200).json(user_info)
    }
    catch (err) {
        return res.status(500).json({ err })
    }
})


// posts endpoints
// GET http://localhost:3001/api/posts get new posts
router.get('/posts', isAuth, async (req, res) => {
    try {
        let show_posts = []
        const posts = await prisma.post.findMany({ include: { user: true, comment: { include: { user: true } } } });
        posts.forEach(post => { if (post.user_id !== req.user.id) show_posts.push(post) })
        return res.status(200).json({ posts: show_posts })
    }
    catch (err) {
        return res.status(500).json({ err })
    }
})

// GET http://loclahost:3001/api/posts/post_id
router.get('/posts/:post_id', isAuth, async (req, res) => {
    const post_id = req.params.post_id;
    try {
        const post = await prisma.post.findUnique({ where: { id: post_id }, include: { user: true, comment: { include: { user: true } } } })
        return res.status(200).json({post})
    }
    catch (err) { res.status(500).json({ err }) }
})

// GET http://localhost:3001/api/posts/search?title=title
router.get('/posts/search', isAuth, async (req, res) => {
    const title = req.query.title;
    try {
        const posts = await prisma.post.findMany({
            where: {
                title: {
                    contains: title
                }
            }
        });
        return res.status(200).json({ posts })
    }
    catch (err) {
        return res.staus(500).json({ err })
    }
})


// creation d'un post POST http://localhost:3001/api/posts/new
router.post('/posts/new', isAuth, async (req, res) => {
    const { title, content } = req.body
    const user_id = req.user.id

    if (title.length > 40) return res.status(400).json({ err: "title is too long" })
    if (content.length > 2500) return res.status(400).json({ err: "content is too long" })

    try {
        await prisma.post.create({ data: { title, content, user_id } })
        return res.status(201).json({ message: "post created" })
    }
    catch (err) {
        return res.status(500).json({ err })
    }
})

// suprimmer un post DELETE http://localhost:3001/api/posts/delete/post_id
router.delete('/posts/delete/:post_id', isAuth, async (req, res) => {
    const user_id = req.user.id;
    const post_id = req.params.post_id;

    try {
        const post = await prisma.post.findUnique({ where: { id: post_id } });
        if (user_id !== post.user_id) return res.status(401).json({ err: "unauthirized to delete this post" });
        await prisma.post.delete({ where: { id: post_id } })
        return res.status(200).json({ message: "post deleted" })
    }
    catch (err) {
        return res.status(500).json({ err })
    }
})

router.put('/posts/edit/:post_id', isAuth, async (req, res) => {
    const user_id = req.user.id;
    const post_id = req.params.post_id;
    const { title, content } = req.body;

    if (title.length > 40) return res.status(400).json({ err: "title is too long" })
    if (content.length > 2500) return res.status(400).json({ err: "content is too long" })

    try {
        const post = await prisma.post.findUnique({ where: { id: post_id } });
        if (user_id !== post.user_id) return res.status(401).json({ err: "unauthorized to edit this post" });
        await prisma.post.update({ data: { title, content }, where: { id: post_id } })
        return res.status(201).json({ message: "post updated" })

    }
    catch (err) {
        return res.status(500).json({ err })
    }

})

// comments endpoints

// add comment http://localhost:3001/api/post/:post_id/comment/add
router.post('/posts/:post_id/comments/add', isAuth, async (req, res) => {
    const user_id = req.user.id;
    const { post_id } = req.params;
    const { content } = req.body;
    if (content === '') res.status(400).json({err: 'no content'})
    if (content.length > 500) return res.status(400).json({ err: "comment too long" });
    try {
        await prisma.comment.create({ data: { content, user_id, post_id } })
        return res.status(201).json({ message: "comment added" });
    }
    catch (err) {
        return res.status(500).json({ err });
    }
})

// get all post comments GET http://localhost:3001/posts/post_id/comments
router.get('/posts/:post_id/comments', isAuth, async (req, res) => {
    const post_id = req.params.post_id;
    try {
        const comments = await prisma.comment.findMany({ where: { post_id }, include: { user: true } });
        return res.status(200).json({ comments });
    }
    catch (err) {
        return res.status(500).json({ err });
    }
})

// delete comment DELETE http://localhost:3001/comments/comment_id/delete
router.delete('/comments/:comment_id/delete', isAuth, async (req, res) => {
    const comment_id = req.params.comment_id;
    const user_id = req.user.id;

    const comment = await prisma.comment.findUnique({ where: { id: comment_id } });
    if (!comment) return res.json({ err: "comment not found" });
    if (comment.user_id !== user_id) return res.status(401).json({ err: "cannot delete this comment" });

    try {
        await prisma.comment.delete({ where: { id: comment_id } });
        return res.status(200).json({ message: "comment deleted" });
    }
    catch (err) {
        return res.status(500).json({ err });
    }
})
// upadate PUT http://localhost:3001/comments/:comment_id/edit
router.put('/comments/:comment_id/edit', isAuth, async (req, res) => {
    const comment_id = req.params.comment_id;
    const user_id = req.user.id;
    const { content } = req.body

    const comment = await prisma.comment.findUnique({ where: { id: comment_id } });
    if (!comment) return res.status(404).json({ err: "comment not found " });
    if (comment.user_id !== user_id) return res.status(401).json({ err: "can not edit this comment" });

    try {
        await prisma.comment.update({ where: { id: comment_id }, data: { content } });
        return res.status(200).json({ message: "comment edited" })
    }
    catch (err) {
        return res.status(500).json(err)
    }
})
module.exports = router