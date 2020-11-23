const Joi = require('joi');

module.exports.Campground = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().min(0).required(),
      image: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
    }).required(),
  });

  module.exports.Review = Joi.object({
    review: Joi.object({
      body: Joi.string().required(),
      rating: Joi.number().min(1).max(5).required()
    }).required()
  })