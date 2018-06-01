'use strict';

const knex = require('../knex');
const express = require('express');

const router = express.Router();

//Get all tags
router.get('/',(req,res,next) => {
  knex
    .select('id','name')
    .from('tags')
    .then(results => res.json(results))
    .catch(err =>  next(err));
});

//Get tags by id 
router.get('/:id',(req,res,next) => {
  const id = req.params.id;

  knex
    .select('id','name')    
    .from('tags')
    .modify(querybuilder => {
      if(id){
        querybuilder.where('tags.id','=', `${id}`);
      }
    })  
    .then(([result]) => res.json(result))
    .catch(err =>  next(err));
});

//Put/Update tags by id
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
    const err = new Error('Missing `tag name`  in the request body');
    err.status = 400;
    return next(err);
  }

  knex('tags')
    .where({'tags.id': `${id}`})
    .update({name: updateObj.name})
    .returning(['tags.name'])
    .then(([result]) => {
      res.json(result);
    })
    .catch(err => next(err));
});

//POST or CREATE a new tag
router.post('/',(req,res,next) => {
  const {name} = req.body;
  
  const newItem = {name};

  if(!newItem.name){
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('tags')
    .insert({name: newItem.name})
    .returning(['id','name'])
    .then(([result]) => res.location(`http://${req.headers.host}/notes/${result.id}`).status(201).json(result))
    .catch(err => next(err));
});

//Delete a tag
router.delete('/:id',(req,res,next) => {
  const id = req.params.id;

  knex('tags')
    .where({'tags.id': `${id}`})
    .del()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => next(err));
});

module.exports = router;
