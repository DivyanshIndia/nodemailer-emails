import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 export async function cleanAndValidateEmails() {
    try {
        // Read raw email data asynchronously
        const rawEmails = await fs.readFile(path.join(__dirname, 'emails.txt'), 'utf-8');

        // Split emails by spaces and new lines
        let emails = rawEmails.split(/[\s\n]+/);
        
        // Email validation regex
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        // Process emails
        const validEmails = [];
        const invalidEmails = [];
        
        emails.forEach(email => {
            // Clean the email
            email = email.toLowerCase().trim();
            
            // Validate email
            if (emailRegex.test(email)) {
                validEmails.push(email);
            } else {
                invalidEmails.push(email);
            }
        });
        
        // Remove duplicates
        const uniqueValidEmails = [...new Set(validEmails)];
        
        // Create the output string with one email per line
        const outputContent = uniqueValidEmails.join('\n');
        
        // Save to email_list.txt
        await fs.writeFile(path.join(__dirname, 'email_list.txt'), outputContent);
        
        // Create a report
        const report = {
            totalProcessed: emails.length,
            validUnique: uniqueValidEmails.length,
            invalid: invalidEmails.length,
            duplicatesRemoved: validEmails.length - uniqueValidEmails.length,
            invalidEmails: invalidEmails
        };
        
        // Display report
        console.log('\nEmail Processing Report:');
        console.log('=====================');
        console.log(`Total emails processed: ${report.totalProcessed}`);
        console.log(`Valid unique emails: ${report.validUnique}`);
        console.log(`Invalid emails: ${report.invalid}`);
        console.log(`Duplicates removed: ${report.duplicatesRemoved}`);
        
        if (invalidEmails.length > 0) {
            console.log('\nInvalid emails found:');
            invalidEmails.forEach(email => console.log(`- ${email}`));
        }
        
        console.log('\nValid emails have been saved to email_list.txt');
        
        // Display all valid emails for verification
        console.log('\nValid Emails:');
        console.log('=============');
        uniqueValidEmails.forEach(email => console.log(email));
        
        return report;
    } catch (error) {
        console.error('Error processing emails:', error);
        throw error;
    }
}

// Run the cleaner
cleanAndValidateEmails().catch(console.error);
