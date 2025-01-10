const mongoose = require('mongoose');

interface Permission {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },

},{
    timestamps: true
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;