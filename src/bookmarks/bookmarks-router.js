const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const bookmarks = require('../store')

const bookmarksRouter = express.Router()
const bodyParser = express.json()


// GET AND POST /BOOKMARKS
bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        // EXTRACT VALUES FROM REQUEST BODY
        const { title, url, description, rating } = req.body

        // CHECK ALL VALUES EXIST
        if (!title) {
            logger.error('Title is required')
            return res
                .status(400)
                .send('Invalid data')
        }

        if (!url) {
            logger.error('URL is required')
            return res
                .status(400)
                .send('Invalid data')
        }

        if (!description) {
            logger.error('Description is required')
            return res
                .status(400)
                .send('Invalid data')
        }

        if (!rating) {
            logger.error('Rating is required')
            return res
                .status(400)
                .send('Invalid data')
        }

        // CREATE UNIQUE ID FOR BOOKMARK
        const id = uuid()

        // MAKE A BOOKMARK OBJECT TO PUSH
        const bookmark = {
            id,
            title,
            url,
            description,
            rating
        }

        // PUSH BOOKMARK TO BOOKMARKS 'DATABASE'
        bookmarks.push(bookmark)
        logger.info(`bookmark with id ${id} created`)

        // RETURN STATUS 201 AND OBJECT
        res.status(201)
           .location(`http://localhost:8000/bookmarks/${id}`)
           .json(bookmark)
    })

    // GET AND DELETE A BOOKMARK BY ID
    bookmarksRouter
        .route('/bookmarks/:id')
        .get((req, res) => {
            // EXTRACT ID FROM PARAMETERS
            const { id } = req.params
            // FIND THE BOOKMARK WITH THAT ID
            const bookmark = bookmarks.find(b => b.id == id)
            // VALIDATE THE BOOKMARK
            if (!bookmark) {
                logger.error(`Bookmark with id ${id} does not exist`)
                return res
                    .status(404)
                    .send('Not found')
            }
            // RETURN A JSON OBJECT
            res.json(bookmark)
        })
        .delete((req, res) => {
            // EXTRACT ID FROM PARAMETERS
            const { id } = req.params
            // FIND THE INDEX OF THE BOOKMARK WITH THAT ID
            const bookmarkIdx = bookmarks.findIndex(b => b.id == id)
            // VALIDATE INDEX
            if (bookmarkIdx === -1) {
                logger.error('Bookmark index not found')
                return res
                    .status(404)
                    .send('Not found')
                }
            // SPLICE THE OBJECT FROM BOOKMARKS
            bookmarks.splice(bookmarkIdx, 1)
            logger.info(`Bookmark with id ${id} deleted`)
            // RETURN STATUS AND END
            res.status(204)
               .end()
        })

        module.exports = bookmarksRouter