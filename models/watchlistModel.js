
// /models/watchlistModel.js

import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    coins: { 
        type: [String], 
        default: [] 
    }
}, { timestamps: true });

// Ensure unique watchlist names per user

watchlistSchema.index({ name: 1, userId: 1 }, { unique: true });

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
export default Watchlist;

// export default mongoose.model('Watchlist', watchlistSchema);

// export const Watchlist = mongoose.model('Watchlist', watchlistSchema);