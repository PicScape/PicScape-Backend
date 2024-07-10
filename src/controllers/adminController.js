const Account = require('../models/Account');





const getAccounts = async (req, res) => {
    const { sortField = 'username', sortOrder = 'asc', page = 1 } = req.query;
    const limit = 40;
    const sortOrderValue = sortOrder === 'dec' ? -1: 1;

    try {
        if (!Number.isInteger(+page) || +page <= 0) {
            return res.status(400).json({ error: 'Invalid page number specified' });
        }

        if (!['username', 'created_at'].includes(sortField)) {
            return res.status(400).json({ error: 'Invalid sortField specified' });
        }

        const totalAccounts = await Account.countDocuments();

        const results = await Account.find()
            .sort({ [sortField]: sortOrderValue })
            .skip((+page - 1) * limit)
            .limit(limit);

        const formattedResults = results.map(account => ({
            id: account._id,
            username: account.username,
            email: account.email,
            roles: account.roles,
            isAdmin: account.isAdmin,
            isActivated: account.isActivated,
            created_at: account.created_at,
            updated_at: account.updated_at,
        }));

        res.json({
            accounts: formattedResults,
            currentPage: +page,
            totalPages: Math.ceil(totalAccounts / limit)
        });
    } catch (error) {
        console.error(`Error in getAccounts: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteAccount = async (req, res) => {
    const { accountId } = req.query;
    try {
        const deletedAccount = await Account.findByIdAndDelete(accountId);

        if (!deletedAccount) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json({ message: 'Account deleted successfully', deletedAccount });
    } catch (error) {
        console.error(`Error in deleteAccount: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAccounts, deleteAccount };
