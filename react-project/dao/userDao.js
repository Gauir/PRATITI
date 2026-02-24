const db = require('../dbconnect');

const UserDAO = {
    addUser: async (user) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Insert into user_login_info
            const loginSql = `INSERT INTO user_login_info (userId, password, isAdmin) VALUES (?, ?, ?)`;
            const isAdmin = (user.userId === 'gauri111' || user.isAdmin === 1) ? 1 : 0;
            await connection.execute(loginSql, [user.userId, user.password, isAdmin]);

            // 2. Insert into user_profile_info (Matches your new columns)
            const profileSql = `INSERT INTO user_profile_info 
                (userId, fname, lname, dob, designation, emp_email, personal_email, gender, address, profile_pic) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const profileValues = [
                user.userId,
                user.fname,
                user.lname,
                user.dob,
                user.designation,
                user.emp_email,
                user.personal_email,
                user.gender,
                user.address,
                user.profile_pic || null // This prevents errors if no photo was uploaded
            ];

            await connection.execute(profileSql, profileValues);
            await connection.commit();
            return { success: true };
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    },

    getById: async (userId) => {
        const sql = `
            SELECT l.userId, l.password, l.isAdmin, p.fname, p.lname, p.dob, 
                   p.designation, p.emp_email, p.personal_email, p.gender, p.address, p.profile_pic
            FROM user_login_info l
            JOIN user_profile_info p ON l.userId = p.userId
            WHERE l.userId = ?`;
        const [rows] = await db.execute(sql, [userId]);
        return rows[0];
    },

    getAll: async () => {
        const sql = `
            SELECT l.userId, l.isAdmin, p.fname, p.lname, p.dob, 
                   p.designation, p.emp_email, p.personal_email, p.gender, p.address, p.profile_pic
            FROM user_login_info l
            JOIN user_profile_info p ON l.userId = p.userId`;
        const [rows] = await db.execute(sql);
        return rows;
    },

    updateProfile: async (userId, data) => {
        const sql = `UPDATE user_profile_info 
                     SET fname=?, lname=?, dob=?, designation=?, emp_email=?, personal_email=?, gender=?, address=? 
                     WHERE userId=?`;
        const values = [
            data.fname, data.lname, data.dob, data.designation,
            data.emp_email, data.personal_email, data.gender, data.address, userId
        ];
        const [result] = await db.execute(sql, values);
        return result;
    },

    updatePassword: async (userId, hashedNewPassword) => {
        const sql = `UPDATE user_login_info SET password=? WHERE userId=?`;
        const [result] = await db.execute(sql, [hashedNewPassword, userId]);
        return result;
    },

    deleteUser: async (userId) => {
        // Because of ON DELETE CASCADE in your SQL, deleting from login_info 
        // will automatically delete the profile.
        const sql = `DELETE FROM user_login_info WHERE userId=?`;
        const [result] = await db.execute(sql, [userId]);
        return result;
    }
};

module.exports = UserDAO;