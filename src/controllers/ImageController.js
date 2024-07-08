const Pfp = require('../models/Pfp');
const Wallpaper = require('../models/Wallpaper');
const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const sharp = require('sharp');


const findUploadById = async (imgId) => {
    let upload = await Pfp.findOne({ imgId: imgId });
    if (!upload) {
        upload = await Wallpaper.findOne({ imgId: imgId });
    }
    return upload;
};


const getUploadData = async (req, res) => {
    const { imgId } = req.params;

    try {
        const upload = await findUploadById(imgId);
        if (!upload) {
            return res.status(404).json({ error: 'Upload not found' });
        }

        const response = {
            id: upload._id,
            title: upload.title,
            description: upload.description,
            type: upload.type,
            tags: upload.tags,
            imgId: imgId,
            authorId: upload.account,
            uploadedDate: upload.uploadedDate,
        };

        res.json({ upload: response });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid upload ID format' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const viewUpload = async (req, res) => {
    const { imgId } = req.params;
    const { lowRes } = req.query;

    try {
        const upload = await findUploadById(imgId);
        if (!upload) {
            return res.status(404).json({ error: 'Upload not found' });
        }

        res.set('Content-Type', 'image/jpeg');
        res.set('Content-Disposition', `inline; filename="${imgId}.jpg"`);

        if (lowRes === 'true') {
            let lowResImage;

            if (upload instanceof Wallpaper) {
                lowResImage = await sharp(upload.image)
                    .resize({ width: 400 })
                    .jpeg({ quality: 50 })
                    .toBuffer();
            } else if (upload instanceof Pfp) {
                lowResImage = await sharp(upload.image)
                    .resize({ width: 100 })
                    .jpeg({ quality: 40 })
                    .toBuffer();
            }

            res.send(lowResImage);
        } else {
            res.send(upload.image);
        }
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid upload ID format' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const searchUploads = async (req, res) => {
    const { searchQuery, type } = req.body;

    try {
        if (!searchQuery) {
            return res.status(400).json({ error: 'Invalid Query specified' });
        }
        const query = {
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { tags: { $regex: searchQuery, $options: 'i' } }
            ]
        };

        let results;
        if (type === 'wallpaper') {
            results = await Wallpaper.find(query);
        } else if (type === 'pfp') {
            results = await Pfp.find(query);
        } else {
            return res.status(400).json({ error: 'Invalid type specified' });
        }
        const formattedResults = results.map(upload => ({
            id: upload._id,
            title: upload.title,
            description: upload.description,
            type: upload.type,
            tags: upload.tags,
            imgId: upload.imgId,
            author: upload.account,
            createdAt: upload.createdAt,
        }));

        res.json({ uploads: formattedResults });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getUploadsFromUser = async (req, res) => {
    const { userid, type, page } = req.query;
    const limit = 30;

    try {
        if (!userid) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (!page || !Number.isInteger(+page) || +page <= 0) {
            return res.status(400).json({ error: 'Invalid page number specified' });
        }

        const query = { account: userid };

        let model;
        if (type === 'wallpaper') {
            model = Wallpaper;
        } else if (type === 'pfp') {
            model = Pfp;
        } else {
            return res.status(400).json({ error: 'Invalid type specified' });
        }

        const totalCount = await model.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        const uploads = await model.find(query)
            .sort({ uploadedDate: -1 })
            .skip((+page - 1) * limit)
            .limit(limit);

        const formattedResults = await Promise.all(uploads.map(async (upload) => {
            let username = '';

            try {
                const user = await Account.findById(upload.account);
                if (user) {
                    username = user.username;
                } 
            } catch (error) {
                console.warn(`Error fetching user for account: ${upload.account}, setting username to empty.`);
            }

            return {
                id: upload._id,
                title: upload.title,
                description: upload.description,
                type: upload.type,
                tags: upload.tags,
                imgId: upload.imgId,
                authorId: upload.account,
                username: username,
                uploadedDate: upload.uploadedDate,
            };
        }));

        res.json({ 
            uploads: formattedResults,
            currentPage: +page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error(`Error in getUploadsFromUser: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getNewestUploads = async (req, res) => {
    const { type, page } = req.query;
    const limit = 40;

    try {
        if (!page || !Number.isInteger(+page) || +page <= 0) {
            return res.status(400).json({ error: 'Invalid page number specified' });
        }

        let results;
        if (type === 'wallpaper') {
            results = await Wallpaper.find().sort({ uploadedDate: -1 }).skip((page - 1) * limit).limit(limit);
        } else if (type === 'pfp') {
            results = await Pfp.find().sort({ uploadedDate: -1 }).skip((page - 1) * limit).limit(limit);
        } else {
            return res.status(400).json({ error: 'Invalid type specified' });
        }

        const formattedResults = await Promise.all(results.map(async (upload) => {
            let username = '';

            try {
                const user = await Account.findById(upload.account);
                if (user) {
                    username = user.username;
                } 
            } catch (error) {
                console.warn(`Error fetching user for account: ${upload.account}, setting username to empty.`);
            }

            return {
                id: upload._id,
                title: upload.title,
                description: upload.description,
                type: upload.type,
                tags: upload.tags,
                imgId: upload.imgId,
                authorId: upload.account,
                username: username,
                uploadedDate: upload.uploadedDate,
            };
        }));

        res.json({ 
            uploads: formattedResults,
            currentPage: +page,
            totalPages: Math.ceil(formattedResults.length / limit)
        });
    } catch (error) {
        console.error(`Error in getNewestUploads: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




const deleteUpload = async (req, res) => {
    const token = req.headers['authorization'];
    const { imgId } = req.params;

    if (!token) {
        return res.status(401).json({ error: 'JWT token is missing' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.error('Failed to authenticate token for deletion:', err);
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }

        try {
            let upload = await findUploadById(imgId);
            const account = await Account.findOne({'_id': decoded.id})
            console.log(account)
            if (!upload) {
                return res.status(404).json({ error: 'Upload not found' });
            }

            if (!account.isAdmin && upload.account.toString() !== decoded.id.toString()) {
                return res.status(401).json({ error: 'Unauthorized to delete this upload' });
            }


            if (upload instanceof Pfp) {
                await Pfp.deleteOne({ imgId: imgId });
            } else if (upload instanceof Wallpaper) {
                await Wallpaper.deleteOne({ imgId: imgId });
            } else {
                return res.status(404).json({ error: 'Upload not found' });
            }

            console.log(`Upload ${imgId} deleted successfully by user ${decoded.id}`);
            res.json({ message: 'Upload deleted successfully' });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({ error: 'Invalid upload ID format' });
            }
            console.error('Error deleting upload:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
};


    module.exports = { getUploadData, viewUpload, searchUploads, getNewestUploads, deleteUpload, getUploadsFromUser };
