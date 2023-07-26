const express = require("express");
const app = express();
const service = require("./service");

app.use(express.json());

const _baseUrl = "/api/v1/users";
const PORT = 3000;

app.get("/", (req, res) => {
    res.json({
        message: "Hello from server!"
    });
});

app.get(`${_baseUrl}/getusers`, service.getAllUsers);

app.post(`${_baseUrl}/signup`, service.signUp);

app.post(`${_baseUrl}/signin`, service.signIn);

app.patch(`${_baseUrl}/edituser/:id`, service.editUser);

app.delete(`${_baseUrl}/deleteuser/:id`, service.deleteUser);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})