
// crypto.js

import mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema({
   id: { type: String, required: true, unique: true },
   symbol: { type: String, required: true },
   name: { type: String, required: true },
   image: { type: String, required: true },
   current_price: { type: Number, required: true },
   market_cap: { type: Number },
   market_cap_rank: { type: Number },
   fully_diluted_valuation: { type: Number },
   total_volume: { type: Number },
   high_24h: { type: Number },
   low_24h: { type: Number },
   price_change_24h: { type: Number },
   price_change_percentage_24h: { type: Number },
   market_cap_change_24h: { type: Number },
   market_cap_change_percentage_24h: { type: Number },
   circulating_supply: { type: Number },
   total_supply: { type: Number },
   max_supply: { type: Number },
   ath: { type: Number },
   ath_change_percentage: { type: Number },
   ath_date: { type: Date },
   atl: { type: Number },
   atl_change_percentage: { type: Number },
   atl_date: { type: Date },
   roi: {                                       // ROI data (optional, as it may not always be present)
    times: { type: Number },
    currency: { type: String },
    percentage: { type: Number }
   },
   last_updated: { type: Date }
}, { timestamps: true });

export default mongoose.model('Crypto', cryptoSchema);

// export const Crypto = mongoose.model('Crypto', cryptoSchema);