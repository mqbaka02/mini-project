const { listUsers } = require("../admin/user-query");

function usersQuickList (req, res) {
    res.json({
        status: 'success',
        data: listUsers().map(u=> ({
            id: u.id,
            name: u.name,
        }))
    });
};

module.exports= {usersQuickList}