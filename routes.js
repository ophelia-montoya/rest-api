'use strict';
const express = require('express');
const router = express.Router();
const { User, Course } = require('./models');

router.use(express.json());

// Handler function to wrap each route.
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        // Forward error to the global error handler
        next(error);
      }
    }
  }
}

// GET route returns all properties + values for currently authenticated User 
// ADD AUTHENTICATEDUSER**
router.get('/users', asyncHandler( async(req, res) => {
  // let user = req.currentUser;
  res.status(200).json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  });
}));

// POST route creates a new user & sets Location header to "/"
router.post('/users', asyncHandler( async(req, res) => {
  await User.create(req.body);
  res.status(201).setHeader('Location', '/').end();
}));

// GET route returns ALL courses, including User associated with each course
router.get('/courses', asyncHandler( async(req, res) => {
  let courses = await Course.findAll({
  include: [
    {
      model: User,
      as: "administrator",
      attributes: [ 'firstName', 'lastName', 'emailAddress' ]
    }]
  });
  res.json(courses);
}));

// GET route returns course with corresponding ID, including User associated
router.get('/courses/:id', asyncHandler( async(req, res) => {
  let course = await Course.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: User,
        as: "administrator", 
        attributes: ['firstName', 'lastName', 'emailAddress'],
      }]
  });
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ "message": "Course not found, or does not exist."});
    }

}));


// POST route creates a new course, sets Location header to URI of newly created course
// ADD AUTHENTICATEDUSER!!! 
router.post('/courses', asyncHandler( async(req, res) => {
  // const user = req.currentUser;
  let course = await Course.create(req.body);
  res.status(201).setHeader('Location', `/api/courses/${course.id}`).end();

}));


// PUT route updates corresponding course
// ADD AUTHENTICATION!!
router.put('/courses/:id', asyncHandler( async(req, res) => {
  // const user = req.currentUser;
  let course = await Course.findByPk(req.params.id);
  if (course) {
    if (user.id == course.userId) {
      await course.update(req.body);
      res.status(204).end();
    } else {
      res.status(403).json({"message": "You do not have access to this course"});
    }

  } else {
    res.status(404).json({"message": "Course not found, or does not exist."});
  }

}));


// DELETE route deletes corresponding course
//ADD AUTHENTICATION!!!
router.delete('/courses/:id', asyncHandler( async(req, res) => {
  // const user = req.currentUser;
  let course = await Course.findByPk(req.params.id);
  if (course) {
    if (user.id == course.userId) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({"message": "You do not have access to this course"});
    }
  } else {
    res.status(404).json({"message": "Course not found, or does not exist."});
  }
}));


module.exports = router;