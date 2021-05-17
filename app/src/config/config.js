module.exports = {
    usefake: true,
    fakepassword: "myP@ss892UT",
    user: {
        username: "myUser",
        password: "myP@ss892UT"
    },
    jwtJSCode: `
        function ensureJWTTokenInRequest() {
        };
    `,
    jwtSecret: "myP@ss892UT"
};