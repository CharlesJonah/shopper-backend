const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../../server/config/config'); // get our config file
const User = require('../../server/models/user'); // get our mongoose model
const app = require('../../app')
const bcrypt = require('bcrypt-nodejs');

module.exports = {
    login(user, res) {
        // find the user
        if (user.email && user.password) {
            User.findOne({ email: user.email }, function (err, isUser) {

                if (err) {
                    res.status(500).send({ success: true, message: 'Server encountered problem while saving.' });
                }

                if (!isUser) {
                    res.status(401).send({ success: false, message: 'Login failed. User not found.' });
                } else if (isUser) {

                    // check if password matches
                    if (bcrypt.compareSync(user.password, isUser.password)) {
                        const token = jwt.sign(user, config.DATABASE_URL, {
                            expiresIn: 60 * 60 * 24 // expires in 24 hours
                        });
                        res.status(200).send({
                            success: true, message: 'Login Successful!', token: token
                        });

                    } else {
                        res.status(401).send({ success: false, message: 'Login failed. Wrong password.' });
                    }

                }

            });
        }
        else {
            res.status(400).send({ success: true, message: 'Bad Request. Fill all the fields' });
        }
    },
    register(user, res) {
        debugger;
        if (user.email && user.first_name && user.last_name && user.password) {
            var email_filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var password_filter = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
            if (email_filter.test(user.email)) {
                if (password_filter.test(user.password)) {
                    User.findOne({ email: user.email }, function (err, currentUser) {

                        if (err) {
                            res.status(500).send({ success: true, message: 'Server encountered problem while saving.' });
                        }
                        if (!currentUser) {
                            const newUser = new User(user);
                            const hashedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
                            newUser.password = hashedPassword;
                            newUser.save(function (err) {
                                if (err) {
                                    res.status(500).send({ success: true, message: 'Server encountered problem while saving.' });
                                }
                                else {
                                    res.status(201).send({ success: true, message: 'Registered successfully' });
                                }
                            });
                        } else if (currentUser) {
                            res.status(409).send({ success: false, message: 'User already exists' });
                        }

                    });

                }
                else {
                    res.status(400).send({ success: false, message: 'Weak password. password should contain at least 1 lowercase alphabetical character,at least 1 uppercase alphabetical character,at least 1 numeric character and must be must be eight characters or longer.' });
                }
            }
            else {
                res.status(400).send({ success: false, message: 'Bad Request. Invalid email' });
            }
        }
        else {
            res.status(400).send({ success: true, message: 'Bad Request. Fill all the fields' });
        }
    }
}