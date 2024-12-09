
// /models/watchlistModel.js

import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    userId: { 
        type: String, 
        required: true 
    },
    coins: { 
        type: [String], 
        default: [] 
    }
}, { timestamps: true });

export default mongoose.model('Watchlist', watchlistSchema);

// const Watchlist = mongoose.model('Watchlist', watchlistSchema);
// export default Watchlist;

// export const Watchlist = mongoose.model('Watchlist', watchlistSchema);