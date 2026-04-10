const { logout, login, checkToken, authenticateToken } = require("../accounts/auth");
const { profileInfo, refreshToken, updateProfileInfo } = require("../accounts/functions");
const { getUsers, getUser, createProfile, createNewUser, deleteUserById } = require("../admin/functions");
const { usersQuickList } = require("../utils/functions");

const routes= {
    get: [
        {
            path: "/users",
            function: getUsers,
        },
        {
            path: "/users/list",
            function: usersQuickList,
        },
        {
            path: "/user/:id",
            function: getUser,
        },
        {
            path: "/logout",
            function: logout,
        },
    ],
    post: [
        {
            path: "/user/newprofile",
            function: createProfile,
        },
        {
            path: "/user/create",
            function: createNewUser,
        },
        {
            path: "/login",
            function: login,
        },
        {
            path: "/check-token",
            function: checkToken,
        },
        {
            path: "/profile-info",
            function: profileInfo,
            middleware: authenticateToken,
        },
        {
            path: "/refresh",
            function: refreshToken,
        },
        {
            path: "/update-info",
            function: updateProfileInfo,
            middleware: authenticateToken,
        },
    ],
    delete: [
        {
            path: "/user/:id",
            function: deleteUserById,
            middleware: authenticateToken,
        }
    ],
};

module.exports= {routes};