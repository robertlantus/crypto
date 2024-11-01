
// mongoService.js

// Import the Mongoose model
import Crypto from '../models/crypto.js';   // export default
// import { Crypto } from '../models/crypto.js';

// Function to store data in MongoDB

export const storeCryptoData = async (data) => {
    try {
        // Insert or update each entry in MongoDB

        const operations = data.map((coin) => ({
            updateOne: {
                filter: { id: coin.id },    // Use the CoinGecko `id` as the unique identifier
                update: { $set: coin },     // Update the document if it exists, or insert if not
                upsert: true,               // Create a new document if it doesn’t exist
            },
        }));

        // Perform a bulk operation to insert or update all documents at once

        const result = await Crypto.bulkWrite(operations);
        // console.log(`Data successfully stored in MongoDB: ${result.upsertedCount} new entries, ${result.modifiedCount} updated`);

        // console.log(result);
        return result;

    } catch (error) {
        console.error('Error storing data in MongoDB:', error);
        throw error;
    }
};

// Function to retrieve all crypto data from MongoDB

export const getAllCryptoData = async () => {
    try {
        const data = await Crypto.find({});
        return data;

    } catch (error) {
        console.error('Error retrieving data from MongoDB:', error);
        throw error;
    }
};

// Function to retrieve specific crypto data by ID from MongoDB

export const getCryptoDataById = async (id) => {
    try {
        const data = await Crypto.findOne( {id} );
        return data;
        
    } catch (error) {
        console.error(`Error retrieving data for ${id} from MongoDB:`, error);
        throw error;
    }
}