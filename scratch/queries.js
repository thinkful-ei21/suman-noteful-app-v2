'use strict';

const knex = require('../knex');

// let searchTerm ;
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });

// let id = 1007;
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (id) {
//       queryBuilder.where('notes.id', '=', `${id}`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });

// let id = 1001;
// let updateObj ={ title:'Suman tESTING blan vlahsdfjasnfnasd uPDATE',content:'Testing update with knex query...........' };

// knex('notes')
//   .where({'notes.id': `${id}`})
//   .update({title:updateObj.title,content: updateObj.content})  
//   .returning(['notes.id','title','content'])
//   .then(([results]) => console.log(JSON.stringify(results, null, 2)))
//   .catch(err => {
//     console.error(err);
//   });

// let createObj = {title:'creating new obj ajsdbfasdflsadf test sdfgsdgsg',
//   content:'creasting sdfhdfghdf new obj test via knex'};

// knex('notes')
//   .insert({title: createObj.title,
//     content: createObj.content})
//   .debug(true)
//   .returning(['id','title','content'])
//   .then(([results]) => console.log(JSON.stringify(results, null, 2)))
//   .catch(err => {console.error(err);});

// let id = 1005;
// knex('notes')
//   .where({'notes.id':`${id}`})
//   .del()
//   .then(result => console.log(JSON.stringify(result,null,2)))
//   .catch(err => console.log(err));