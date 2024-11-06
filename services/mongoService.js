
// mongoService.js

// Import the Mongoose model
import Crypto from '../models/crypto.js';   // export default
// import { Crypto } from '../models/crypto.js';

// Function to store or update data in MongoDB

// Replace the bulk upsert with a more specific findOnedAndUpdate

export const storeCryptoData = async (data) => {
    try {
        // Loop through each coin in the data array
        for (const coin of data) {
            await Crypto.findOneAndUpdate(
                { id: coin.id },     // Filter by CoinGecko ID
                { $set: coin },      // Update the document with the new data
                { upsert: true, new: true }     // Insert if not found, return the modified document
            );
        }

        console.log('Data successfully stored/updated in MongoDB');

    } catch (error) {
        console.error('Error storing data in MongoDB:', error);
        throw error;
    }
}

// Bulk write (for larger datasets)

// export const storeCryptoData = async (data) => {
//     try {
//         // Insert or update each entry in MongoDB

//         const operations = data.map((coin) => ({
//             updateOne: {
//                 filter: { id: coin.id },    // Use the CoinGecko `id` as the unique identifier
//                 update: { $set: coin },     // Update the document if it exists, or insert if not
//                 upsert: true,               // Create a new document if it doesn’t exist
//             },
//         }));

//         // Perform a bulk operation to insert or update all documents at once

//         const result = await Crypto.bulkWrite(operations);
//         // console.log(`Data successfully stored in MongoDB: ${result.upsertedCount} new entries, ${result.modifiedCount} updated`);

//         // console.log(result);
//         return result;

//     } catch (error) {
//         console.error('Error storing data in MongoDB:', error);
//         throw error;
//     }
// };

// Function to retrieve all crypto data from MongoDB

export const getAllCryptoDataFromMongo = async () => {
    try {
        const data = await Crypto.find({});
        return data;

    } catch (error) {
        console.error('Error retrieving data from MongoDB:', error);
        throw error;
    }
};

// Function to retrieve specific coins by their IDs from MongoDB

export const getCryptoDataByIdFromMongo = async (ids) => {
    try {
        const data = await Crypto.find({id: { $in: ids } });
        return data;
        
    } catch (error) {
        console.error(`Error retrieving data for ${ids} from MongoDB:`, error);
        throw error;
    }
}