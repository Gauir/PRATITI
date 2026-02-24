const userDAO = require('../dao/userDAO');
const bcrypt = require('bcrypt');
const saltRounds = 10; 

const userService = {
    register: async (userData) => {
        // Encrypt password before sending to DAO
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        const userToSave = { ...userData, password: hashedPassword };
        return await userDAO.addUser(userToSave);
    },

    validate: async (userId, plainPassword) => {
        const user = await userDAO.getById(userId);
        if (user) {
            // Compare the login password with the hashed password in DB
            const isMatch = await bcrypt.compare(plainPassword, user.password);
            if (isMatch) {
                // delete user.password; // Don't send the hash back to the client
                // return user;
                const userResponse = { ...user };
                delete userResponse.password; // Never send the hashed password to React!
                return userResponse;
            }
        }
        return null;
    },

    viewAll: async () => {
        return await userDAO.getAll();
    },

    updateProfile: async (userId, data) => {
        return await userDAO.updateProfile(userId, data);
    },

    updatePassword: async (userId, oldPassword, newPassword) => {
        const user = await userDAO.getById(userId);
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new Error("Incorrect old password");

        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        return await userDAO.updatePassword(userId, hashedNewPassword);
    },

    removeUser: async (userId) => {
        return await userDAO.deleteUser(userId);
    }
};

module.exports = userService;