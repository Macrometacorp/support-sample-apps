import getClient  from '../util/serverAuth.js';
import express from 'express';
import insertUser from '../queries/insertUser.js';
import deleteUserByKey from '../queries/deleteUser.js';
import searchUserByName from '../queries/searchUser.js';

const userRoutes = express.Router()
const client = getClient()

userRoutes.post('/', async (req, res) => {
    try {
      const newUser = req.body;
      const response = await insertUser(newUser,client)
      res.status(200).json({ message: response });
    } catch (error) {
      res.status(500).json({ message: `Error creating product: ${error}` });
    }
  });
  userRoutes.delete('/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      // Call the deleteUser function here and pass userId as an argument
      const response = await deleteUserByKey(userId,client)
      res.status(200).json({ message: response });
    } catch (error) {
      res.status(500).json({ message: `Error creating product: ${error}` });
    }
  });
  userRoutes.post('/search', async (req, res) => {
    try {
      const user = req.body;
      // Call the getUser function here and pass userId as an argument
      const response = await searchUserByName(user,client)
      res.status(200).json({ message: response });
    } catch (error) {
      res.status(500).json({ message: `Error creating product: ${error}` });
    }
  });
  export { userRoutes  }
