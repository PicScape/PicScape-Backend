const authController = require('./authController');

const userController = {
  async getProfile(req, res) {
    try {
      // Fetch user profile using the userId attached to the request object
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getUserDataFromToken(req, res) {
    // Call the getUserDataFromToken function from the authController
    authController.getUserDataFromToken(req, res);
  }
};

module.exports = userController;
