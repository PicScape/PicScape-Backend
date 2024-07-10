const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
const Pfp = require('../models/Pfp');
const Wallpaper = require('../models/Wallpaper');
const emailUtil = require('../utils/emailUtil');
const crypto = require('crypto');

const { JWT_SECRET } = process.env;




const getAccounts = async (req, res) => {
    const { sortField = 'name', sortOrder = 'asc', page = 1 } = req.query;
    const limit = 40;
    const sortOrderValue = sortOrder === 'asc' ? 1 : -1;

    try {
        if (!Number.isInteger(+page) || +page <= 0) {
            return res.status(400).json({ error: 'Invalid page number specified' });
        }

        if (!['name', 'creation_date'].includes(sortField)) {
            return res.status(400).json({ error: 'Invalid sortField specified' });
        }

        const results = await Account.find()
            .sort({ [sortField]: sortOrderValue })
            .skip((+page - 1) * limit)
            .limit(limit);

        const formattedResults = await Promise.all(results.map(async (account) => {

            

            return {
                id: account._id,
                username: account.username,
                email: account.email,
                roles: account.roles,
                isAdmin: account.isAdmin,
                isActivated: account.isActivated,
                created_at: account.created_at,
                updated_at: account.updated_at,
            };
        }));

        res.json({
            accounts: formattedResults,
            currentPage: +page,
            totalPages: Math.ceil(results.length / limit)
        });
    } catch (error) {
        console.error(`Error in getAccounts: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = { getAccounts };
