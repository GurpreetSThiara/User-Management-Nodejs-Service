// /controllers/connectionController.ts
import { Request, Response } from 'express';
import ConnectionRequest from '../models/ConnectionRequest';
import User from '../models/User';
// import redisClient from '../config/redis';

export const sendConnectionRequest = async (req: Request | any, res: Response) => {
  const { recipientId } = req.body;
  const senderId = req.user.userId;

  try {
    // Create a new connection request
    const connectionRequest = new ConnectionRequest({
      user_id: recipientId,
      status: 'pending',
    });

    await connectionRequest.save();

    // Add to recipient's connection requests
    await User.findByIdAndUpdate(recipientId, {
      $push: { connection_requests: connectionRequest._id },
    });

    res.status(201).json({ message: 'Connection request sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send connection request' });
  }
};

export const acceptConnectionRequest = async (req: Request | any, res: Response) => {
  const { requestId } = req.body;
  const userId = req.user.userId;

  try {
    // Find and update connection request to 'accepted'
    const connectionRequest = await ConnectionRequest.findByIdAndUpdate(
      requestId,
      { status: 'accepted' },
      { new: true }
    );

    if (!connectionRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Add to both users' connections
    await User.findByIdAndUpdate(userId, {
      $push: { connections: connectionRequest.user_id },
      $pull: { connection_requests: requestId },
    });

    await User.findByIdAndUpdate(connectionRequest.user_id, {
      $push: { connections: userId },
    });

    // Invalidate cache
    // await redisClient.del(`connections:${userId}`);
    // await redisClient.del(`connections:${connectionRequest.user_id}`);

    res.status(200).json({ message: 'Connection request accepted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept connection request' });
  }
};

export const rejectConnectionRequest = async (req: Request | any, res: Response) => {
  const { requestId } = req.body;
  const userId = req.user.userId;

  try {
    // Find and update connection request to 'rejected'
    const connectionRequest = await ConnectionRequest.findByIdAndUpdate(
      requestId,
      { status: 'rejected' },
      { new: true }
    );

    if (!connectionRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Remove from user's connection requests
    await User.findByIdAndUpdate(userId, {
      $pull: { connection_requests: requestId },
    });

    // // Invalidate cache
    // await redisClient.del(`connections:${userId}`);

    res.status(200).json({ message: 'Connection request rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject connection request' });
  }
};

export const removeConnection = async (req: Request | any, res: Response) => {
  const { connectionId } = req.params;
  const userId = req.user.userId;

  try {
    // Remove connection from both users
    await User.findByIdAndUpdate(userId, {
      $pull: { connections: connectionId },
    });

    await User.findByIdAndUpdate(connectionId, {
      $pull: { connections: userId },
    });

    // Invalidate cache
    // await redisClient.del(`connections:${userId}`);
    // await redisClient.del(`connections:${connectionId}`);

    res.status(200).json({ message: 'Connection removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove connection' });
  }
};

export const getConnectionRequests = async (req: Request | any, res: Response) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId).populate('connection_requests');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user.connection_requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get connection requests' });
  }
};

export const getConnectionsList = async (req: Request | any, res: Response) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId).populate('connections');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cache connections
    // await redisClient.set(`connections:${userId}`, JSON.stringify(user.connections), {
    //   EX: 3600,
    // });

    res.status(200).json(user.connections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get connections list' });
  }
};
