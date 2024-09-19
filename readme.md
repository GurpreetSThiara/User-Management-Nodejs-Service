/user-management-app
│
├── /config
│   ├── db.ts             # MongoDB connection
│   ├── redis.ts          # Redis connection
│
├── /controllers
│   ├── authController.ts
│   ├── userController.ts
│   ├── connectionController.ts
│   ├── notificationController.ts
│   ├── settingsController.ts
│   ├── activityController.ts
│
├── /models
│   ├── User.ts
│   ├── AuthToken.ts
│   ├── ConnectionRequest.ts
│   ├── Notification.ts
│   ├── ActivityLog.ts
│
├── /workers
│   ├── emailWorker.ts
│   ├── notificationWorker.ts
│   ├── connectionWorker.ts
│   ├── activityLogWorker.ts
│   ├── cacheUpdateWorker.ts
│
├── /routes
│   ├── auth.ts
│   ├── users.ts
│   ├── connections.ts
│   ├── notifications.ts
│   ├── settings.ts
│   ├── activity.ts
│
├── /types
│   ├── express.d.ts      # Custom types for Express
│
├── index.ts             # Main server file
├── tsconfig.json         # TypeScript configuration
├── package.json
└── README.md
