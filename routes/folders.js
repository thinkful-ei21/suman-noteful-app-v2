'use strict';

const knex = require('../knex');
const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

//Get all folders 
router.get('/', (req, res, next) => {  
  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});


//Get folder by ID
router.get('/:id',(req,res,next) => {
  const id = req.params.id;

  knex
    .select('id','name')
    .from('folders')
    .modify(querybuilder => {
      if(id){
        querybuilder.where('folders.id','=', `${id}`);
      }
    })    
    .then(([result]) => res.json(result))
    .catch(err => next(err));
});

//Put/Update folder by id
router.put('/:id',(req,res,next) => {
  const id = req.params.id;

  const updateObj = {};
  const updateableField = ['name'];

  updateableField.forEach(field => {
    if(field in req.body){
      updateObj[field] = req.body[field];
    }
  });

  if(!updateObj.name){
    const err = new Error('Missing `folder name`  in the request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .where({'folders.id': `${id}`})
    .update({name: updateObj.name})
    .returning(['folders.name'])
    .then(([result]) => {
      res.json(result);
    })
    .catch(err => next(err));
});

//POST or CREATE a new folder
router.post('/',(req,res,next) => {
  const {name} = req.body;
  
  const newItem = {name};

  if(!newItem.name){
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .insert({name: newItem.name})
    .returning(['id','name'])
    .then(([result]) => res.location(`http://${req.headers.host}/notes/${result.id}`).status(201).json(result))
    .catch(err => next(err));
});

//Delete a folder
router.delete('/:id',(req,res,next) => {
  const id = req.params.id;

  knex('folders')
    .where({'folders.id': `${id}`})
    .del()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => next(err));
});



module.exports = router;