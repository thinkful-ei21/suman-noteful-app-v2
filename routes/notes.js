'use strict';

const knex = require('../knex');
const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
// const data = require('../db/notes');
// const simDB = require('../db/simDB');
// const notes = simDB.initialize(data);

// // Get All (and search by query)

router.get('/', (req, res, next) => {
  const { searchTerm,folderId } = req.query;

  knex.select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function (queryBuilder) {
      if (folderId) {
        queryBuilder.where('folder_id', folderId);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
  // knex.select('id', 'title', 'content')
  //   .from('notes')
  //   .modify(function (queryBuilder) {
  //     if (searchTerm) {
  //       queryBuilder.where('title', 'like', `%${searchTerm}%`);
  //     }
  //   })
  //   .orderBy('notes.id')
  //   .then(results => {
  //     res.json(results);
  //   })
  //   .catch(err => {
  //     next(err);
  //   });
});


// Get a single item
router.get('/:id', (req, res, next) => {
  const id = req.params.id;  
  knex.select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')    
    .where({'notes.id':`${id}`})        
    .then(([results]) => {
      res.json(results);
    })
    .catch(err => next(err));  
});

// Put update an item
router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content','folderId'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  console.log(updateObj);
  knex('notes')
    .where({'notes.id': `${id}`})
    .update({title:updateObj.title,content: updateObj.content,folder_id:updateObj.folderId})  
    .returning(['notes.id','title','content','notes.folder_id'])
    .then(([results]) => res.json(results))
    .catch(err => {
      next(err);
    });
});


router.post('/', (req, res, next) => {
  const { title, content, folderId } = req.body; // Add `folderId` to object destructure
  /*
  REMOVED FOR BREVITY
  */
  const newItem = {
    title: title,
    content: content,
    folder_id: folderId  // Add `folderId`
  };

  let noteId;

  // Insert new note, instead of returning all the fields, just return the new `id`
  knex.insert(newItem)
    .into('notes')
    .returning('id')
    .then(([id]) => {
      noteId = id;
      // Using the new id, select the new note and the folder
      return knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', noteId);
    })
    .then(([result]) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

// // Post (insert) an item
// router.post('/', (req, res, next) => {
//   const { title, content,folderId } = req.body;

//   const newItem = { title, content, folder_id:folderId };
//   /***** Never trust users - validate input *****/
//   if (!newItem.title) {
//     const err = new Error('Missing `title` in request body');
//     err.status = 400;
//     return next(err);
//   }
//   // let noteId;
//   // knex('notes')
//   //   .insert(newItem)
//   //   .debug(true)
//   //   .returning(['id','title','content','folder_id'])
//   //   .then(([results]) => res.location(`http://${req.headers.host}/notes/${results.id}`).status(201).json(results))
//   //   .catch(err => next(err));
// });

// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .where({'notes.id':`${id}`})
    .del()
    .then(() => res.sendStatus(204))
    .catch(err => next(err)); 
});

module.exports = router;
