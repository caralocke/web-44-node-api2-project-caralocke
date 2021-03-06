// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')

const router = express.Router()

router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({ message: 'The posts information could not be retrieved'})
        })
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    Posts.findById(id)
        .then(post => {
          if(post) {
            res.status(200).json(post)
          } else {
              res.status(404).json({message: 'the post with the specified ID does not exist'})
          }
        })
        .catch(err => {
            res.status(500).json({ message: 'The post information could not be retrieved'})
        })
})

router.post('/', (req, res) => {
    if(!req.body.title || !req.body.contents) {
        res.status(400).json({ message: 'Please provide title and contents for the post'})
    } else {
        const { title, contents } = req.body
        Posts.insert({title, contents})
            .then(newPost => {
                Posts.findById(newPost.id)
                    .then(post => {
                        res.status(201).json(post)
                    })
            })
            .catch(err => {
                res.status(500).json({ message: 'There was an error while saving the post to the database'})
            })
    }
})

router.put('/:id', (req, res) => {
    if(!req.body.title || !req.body.contents) {
        res.status(400).json({ message: 'Please provide title and contents for the post'})
    } else {
    const changes = req.body
    Posts.update(req.params.id, changes)
        .then(updated => {
            if(updated) {
                Posts.findById(updated)
                    .then(post => {
                        res.status(200).json(post)
                    })
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist'})
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'The post information could not be modified'})
        })
    }
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    Posts.findById(id)
        .then(post => {
            if(post) {
                Posts.remove(id)
                    .then(deleted => {
                        res.status(200).json(post)
                    })
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist'})
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'The post could not be removed'})
        })
})

router.get('/:id/comments', (req, res) => {
    const id = req.params.id
    Posts.findPostComments(id)
        .then(post => {
            if(post.length) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist'})
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'The comments information could not be retrieved'})
        })
})

module.exports = router