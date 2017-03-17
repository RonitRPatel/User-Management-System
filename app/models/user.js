var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
    validate({
      validator: 'matches',
      arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
      message: 'Name must be at least 3 characters, max 30 characters, no special characters or numbers, must have space in between name.'
  }),
  validate({
      validator: 'isLength',
      arguments: [3, 20],
      message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

var emailValidator = [
    validate({
      validator: 'isEmail',
      message: 'Invalid Email'
  }),
  validate({
      validator: 'isLength',
      arguments: [3, 50],
      message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contain letters and numbers only '
    })
];

var passwordValidator = [
    validate({
      validator: 'matches',
      arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
      message: 'Password needs to have atleast one lower case, one upper case, one number, one special character and must be atleast 8 characters but no more than 35!'
  }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })

];
var UserSchema = new Schema({
    name: {type: String, required:true, validate: nameValidator },
    username: {type: String, lowercase: true, required:true, unique: true, validate: usernameValidator },
    password: {type: String, required: true, validate: passwordValidator, select: false},
    email: {type: String, lowercase: true, required:true, unique: true , validate: emailValidator},
    prof_photo: { type: String, default:'default.png' },
    permission: { type: String, required: true, default: 'user'}
});


//Before saving schema perform password hashing using 'pre' middleware
UserSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.plugin(titlize, {
    paths: [ 'name' ]
});


UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',UserSchema);
