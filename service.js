const { v4: uuidv4 } = require('uuid');
var bcrypt = require('bcryptjs');
const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/dev-data/data/users.json`);
const users = JSON.parse(data);

exports.getAllUsers = (req, res) => {
    res.status(200).json({
        returncode: "300",
        message: "Successful",
        count: users.length,
        datalist: users
    });
}

exports.signUp = (req, res) => {

    const { name, email, password, role, photo } = req.body;

    if (!req.body.hasOwnProperty("name") || !name) {
        res.status(200).json({
            message: "username must not be empty!"
        });
    }

    if (!req.body.hasOwnProperty("email") || !email) {
        res.status(200).json({
            message: 'email must not be empty!'
        });
    }

    if (!req.body.hasOwnProperty("password") || !password) {
        res.status(200).json({
            message: `password must not be empty!`
        });
    }

    const userExists = users.find(user => user.email === email)

    if (!userExists) {

        const newId = uuidv4();
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        const userRole = !role ? "user" : role;
        const userPhoto = !photo ? "" : photo;

        const newUser = Object.assign(req.body, {
            _id: newId,
            password: hashedPassword,
            role: userRole,
            photo: userPhoto
        });

        users.push(newUser);

        fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(users), (err) => {
            if (err) {
                console.log("Something went wrong");
            } else {
                return res.status(200).json({
                    message: "User was registered successfully!",
                    user: newUser,
                })
            }
        });
    } else {
        return res.status(400).json({
            message: "User already exists!"
        });
    }
}

exports.signIn = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(404).json({
            message: "Please check your email or password"
        });
    } else {
        var user = users.find((user) => user.email == req.body.email)
        if (user) {
            var checkPassword = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!checkPassword) {
                res.status(401).json({
                    message: "Invalid password"
                });
            }

            res.status(200).json({
                message: "Successfully logged in!",
                data: user,
            })

        } else {
            res.status(404).json({
                message: "User not found"
            });
        }

    }
}

exports.editUser = (req, res) => {
    const { name, email, password, role, photo } = req.body;

    var _id = req.params.id;

    var user = users.find((user) => user._id == _id);
    if (!user) {
        res.status(404).json({
            message: "User not found"
        });
    } else {
        const username = !name ? user.name : name;
        const newEmail = !email ? user.email : email;
        const newPassword = !password ? user.password : bcrypt.hashSync(password, 8);
        const newRole = !role ? user.role : role;
        const newPhoto = !photo ? user.photo : photo;

        Object.assign(user, {
            _id: user._id,
            name: username,
            email: newEmail,
            password: newPassword,
            role: newRole,
            photo: newPhoto,
        });

        fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(users), (err) => {
            if (err) {
                console.log("Something went wrong");
            } else {
                return res.status(200).json({
                    message: "User was updated successfully!",
                })
            }
        });
    }
}

exports.deleteUser = (req, res) => {
    const { name, email, password, role, photo } = req.body;

    var _id = req.params.id;

    var userIndex = users.findIndex((user) => user._id == _id);

    if (userIndex == -1) {
        res.status(404).json({
            message: "User not found"
        });
    } else {

        users.splice(userIndex, 1);

        fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(users), (err) => {
            if (err) {
                console.log("Something went wrong");
            } else {
                res.status(200).json({
                    message: "User was deleted successfully!"
                });
            }
        });


    }
}